const express = require('express');
const { createBlog, getBlogs, updateBlog, getBlog, deleteBlog, likeBlog, dislikeBlog, uploadImages } = require('../controller/blogCtrl');
const { isAdmin, authMiddleware, isAuthor } = require('../middlewares/authMiddleware');
const { route } = require('./authRoute');

const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImg');
const router = express.Router();

router.get('/', authMiddleware, getBlogs);
router.get('/:id', getBlog);
router.post('/', authMiddleware, createBlog)
router.put('/likes', authMiddleware, likeBlog)
router.put('/dislikes', authMiddleware, dislikeBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.delete('/:id', authMiddleware, isAuthor, deleteBlog);
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array("images", 10), blogImgResize, uploadImages);
module.exports = router;