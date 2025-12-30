const axios = require('axios')
const db = require('../config/db')

const cache = new Map()

async function ensureGoogleReviewsColumns() {
  const alters = [
    "ALTER TABLE siteconfig ADD COLUMN googleReviewsEnabled TINYINT(1) DEFAULT 0",
    "ALTER TABLE siteconfig ADD COLUMN googlePlaceId VARCHAR(255) NULL",
    "ALTER TABLE siteconfig ADD COLUMN googleReviewsTitle VARCHAR(255) NULL",
    "ALTER TABLE siteconfig ADD COLUMN googleReviewsMax INT DEFAULT 6",
    "ALTER TABLE siteconfig ADD COLUMN googleReviewsMinRating DECIMAL(2,1) DEFAULT 0",
  ]

  for (const sql of alters) {
    try {
      await db.execute(sql)
    } catch (err) {
      if (err && (err.code === 'ER_DUP_FIELDNAME' || err.errno === 1060)) continue
      if (err && (err.code === 'ER_NO_SUCH_TABLE' || err.errno === 1146)) continue
      throw err
    }
  }
}

function getCacheKey(placeId) {
  return `place:${placeId}`
}

function getFromCache(placeId) {
  const key = getCacheKey(placeId)
  const hit = cache.get(key)
  if (!hit) return null
  if (Date.now() > hit.expiresAt) {
    cache.delete(key)
    return null
  }
  return hit.data
}

function setCache(placeId, data, ttlMs) {
  const key = getCacheKey(placeId)
  cache.set(key, { data, expiresAt: Date.now() + ttlMs })
}

async function readSiteConfig() {
  await ensureGoogleReviewsColumns()
  const [rows] = await db.execute(
    'SELECT googleReviewsEnabled, googlePlaceId, googleReviewsTitle, googleReviewsMax, googleReviewsMinRating FROM siteconfig ORDER BY created_at DESC LIMIT 1',
    [],
  )
  return rows?.[0] || null
}

function normalizeNumber(v, fallback) {
  const n = Number(v)
  if (Number.isFinite(n)) return n
  return fallback
}

exports.getReviews = async (req, res) => {
  try {
    const cfg = await readSiteConfig()

    const enabled = cfg?.googleReviewsEnabled === 1 || cfg?.googleReviewsEnabled === true
    if (!enabled) {
      return res.status(200).json({ status: 'success', data: { enabled: false, reviews: [] } })
    }

    const placeId = String(cfg?.googlePlaceId || '').trim()
    if (!placeId) {
      return res.status(200).json({ status: 'success', data: { enabled: true, reviews: [] } })
    }

    const apiKey = String(process.env.GOOGLE_PLACES_API_KEY || '').trim()
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GOOGLE_PLACES_API_KEY on server' })
    }

    const max = Math.max(1, Math.min(20, normalizeNumber(cfg?.googleReviewsMax, 6)))
    const minRating = Math.max(0, Math.min(5, normalizeNumber(cfg?.googleReviewsMinRating, 0)))
    const title = cfg?.googleReviewsTitle || 'Google Reviews'

    const cached = getFromCache(placeId)
    if (cached) {
      return res.status(200).json({ status: 'success', data: { ...cached, enabled: true, title } })
    }

    const url = 'https://maps.googleapis.com/maps/api/place/details/json'
    const fields = 'name,rating,user_ratings_total,url,reviews'

    const resp = await axios.get(url, {
      params: {
        place_id: placeId,
        fields,
        reviews_sort: 'newest',
        key: apiKey,
      },
      timeout: 12000,
    })

    const payload = resp?.data || null
    if (!payload || payload.status !== 'OK') {
      return res.status(200).json({
        status: 'success',
        data: {
          enabled: true,
          title,
          place: null,
          reviews: [],
          error: payload?.error_message || payload?.status || 'Google API error',
        },
      })
    }

    const result = payload.result || {}
    const rawReviews = Array.isArray(result.reviews) ? result.reviews : []

    const reviews = rawReviews
      .map((r) => ({
        authorName: r.author_name || '',
        authorUrl: r.author_url || '',
        profilePhotoUrl: r.profile_photo_url || '',
        rating: typeof r.rating === 'number' ? r.rating : Number(r.rating || 0),
        relativeTime: r.relative_time_description || '',
        text: r.text || '',
        time: r.time || null,
      }))
      .filter((r) => r.rating >= minRating)
      .slice(0, max)

    const data = {
      place: {
        name: result.name || '',
        rating: typeof result.rating === 'number' ? result.rating : Number(result.rating || 0),
        userRatingsTotal: typeof result.user_ratings_total === 'number' ? result.user_ratings_total : Number(result.user_ratings_total || 0),
        url: result.url || '',
      },
      reviews,
    }

    setCache(placeId, data, 10 * 60 * 1000)

    return res.status(200).json({ status: 'success', data: { ...data, enabled: true, title } })
  } catch (err) {
    console.error('Error fetching google reviews:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
