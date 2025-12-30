const Blogs = require('../models/blogsModel');

exports.createBlog = async (req, res) => {
  try {
    const result = await Blogs.create(req.body);
    res.status(201).json({ message: 'Blog created', id: result.insertId });
  } catch (err) {
    console.error('Error creating Blog:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blogs.getById(Number(id));
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    return res.status(200).json({ status: 'success', data: blog });
  } catch (err) {
    console.error('Error fetching Blog by id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllBlogsByPage = async (req, res) => {
  try {
    const { limit = 10, page = 1, searchtxt = '' } = req.query;

    const results = await Blogs.getAllByPage(Number(limit), Number(page), searchtxt);

    res.status(200).json({
      status: 'success',
      data: results.data,
      totalCount: results.totalCount,
      totalPages: Math.ceil(results.totalCount / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error('Error fetching Blogs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateBlog = async (req, res) => {
  const id = req.params.id;
  try {
    const results = await Blogs.update(id, req.body);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error updating Blog:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteBlog = async (req, res) => {
  const id = req.params.id;
  try {
    await Blogs.delete(id);
    res.status(200).json({ message: 'Blog deleted' });
  } catch (err) {
    console.error('Error deleting Blog:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
