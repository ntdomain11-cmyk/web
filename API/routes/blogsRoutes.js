const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogsController');
const { auth } = require('../middlewares/auth.js');

// Public (frontend) pagination
router.get('/getAllBlogsByPage', blogsController.getAllBlogsByPage);

// Public (frontend) single blog
router.get('/getBlog/:id', blogsController.getBlogById);

// Admin (protected)
router.post('/createBlog', auth, blogsController.createBlog);
router.put('/updateBlog/:id', auth, blogsController.updateBlog);
router.delete('/deleteBlog/:id', auth, blogsController.deleteBlog);

module.exports = router;
