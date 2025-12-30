const db = require('../config/db');

async function ensureGoogleReviewsColumns() {
    const alters = [
        "ALTER TABLE siteconfig ADD COLUMN googleReviewsEnabled TINYINT(1) DEFAULT 0",
        "ALTER TABLE siteconfig ADD COLUMN googlePlaceId VARCHAR(255) NULL",
        "ALTER TABLE siteconfig ADD COLUMN googleReviewsTitle VARCHAR(255) NULL",
        "ALTER TABLE siteconfig ADD COLUMN googleReviewsMax INT DEFAULT 6",
        "ALTER TABLE siteconfig ADD COLUMN googleReviewsMinRating DECIMAL(2,1) DEFAULT 0",
    ];

    for (const sql of alters) {
        try {
            await db.execute(sql);
        } catch (err) {
            if (err && (err.code === 'ER_DUP_FIELDNAME' || err.errno === 1060)) {
                continue;
            }
            if (err && (err.code === 'ER_NO_SUCH_TABLE' || err.errno === 1146)) {
                continue;
            }
            throw err;
        }
    }
}

const siteconfig = {
    create: async (data) => {
        await ensureGoogleReviewsColumns();
        const sql = 'INSERT INTO siteconfig (siteName,clientUrl, logo, whiteLogo, icon, theme, instagramURL, facebookURL, twitterURL, linkedInURL, youtubeURL, mobile, email, googleReviewsEnabled, googlePlaceId, googleReviewsTitle, googleReviewsMax, googleReviewsMinRating, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';
        try {
            const [results] = await db.execute(sql, [
                data.siteName,
                data.clientUrl,
                data.logo,
                data.whiteLogo,
                data.icon,
                data.theme,
                data.instagramURL,
                data.facebookURL,
                data.twitterURL,
                data.linkedInURL,
                data.youtubeURL,
                data.mobile,
                data.email,
                data.googleReviewsEnabled ? 1 : 0,
                data.googlePlaceId || null,
                data.googleReviewsTitle || null,
                Number(data.googleReviewsMax || 6),
                Number(data.googleReviewsMinRating || 0),
            ]);

            let dataJSON = {
                status: 'success',
                data: results
            }

            return dataJSON;
        } catch (err) {
            throw err; // Propagate the error to be handled later
        }
    },

    getAll: async () => {
        await ensureGoogleReviewsColumns();
        try {
            const [results] = await db.execute(`SELECT * FROM siteconfig ORDER BY created_at DESC`);

            let dataJSON = {
                status: 'success',
                data: results
            };

            return dataJSON;
        } catch (err) {
            throw err;
        }
    },
    update: async (id, data) => {
        await ensureGoogleReviewsColumns();
        const sqlUpdate = 'UPDATE siteconfig SET siteName = ?, clientUrl = ?, logo = ?, whiteLogo = ?, icon = ?, theme = ?, instagramURL = ?, facebookURL = ?, twitterURL = ?, linkedInURL = ?, youtubeURL = ?, mobile = ?, email = ?, googleReviewsEnabled = ?, googlePlaceId = ?, googleReviewsTitle = ?, googleReviewsMax = ?, googleReviewsMinRating = ?, updated_at = NOW() WHERE id = ?';
        try {
            const [results] = await db.execute(sqlUpdate, [
                data.siteName,
                data.clientUrl,
                data.logo,
                data.whiteLogo,
                data.icon,
                data.theme,
                data.instagramURL,
                data.facebookURL,
                data.twitterURL,
                data.linkedInURL,
                data.youtubeURL,
                data.mobile,
                data.email,
                data.googleReviewsEnabled ? 1 : 0,
                data.googlePlaceId || null,
                data.googleReviewsTitle || null,
                Number(data.googleReviewsMax || 6),
                Number(data.googleReviewsMinRating || 0),
                id,
            ]);

            let dataJSON = {
                status: 'success',
                data: results
            }

    
            return dataJSON;
        } catch (err) {
            throw err;
        }
    },

    delete: async (id) => {
        try {
            const [results] = await db.execute('DELETE FROM siteconfig WHERE id = ?', [id]);
            return results;
        } catch (err) {
            throw err;
        }
    },  
};

module.exports = siteconfig;