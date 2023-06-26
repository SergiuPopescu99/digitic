const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodb');




const createBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {

        const newBlog = new Blog(req.body);
        newBlog.author = _id;
        await newBlog.save();
        return res.json(newBlog)
    }
    catch (err) {

        throw new Error(err);
    }

})
const getBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find();
        return res.json(blogs)

    }
    catch (err) {
        throw new Error(err);
    }


})
const getBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const blog = await Blog.findById(id).populate('likes').populate('dislikes');
        await Blog.findByIdAndUpdate(id, { $inc: { numViews: 1 } }, { new: true })
        if (!blog) { throw new Error("Blog not found!") }
        return res.json(blog);
    }
    catch (err) {
        throw new Error(err);
    }
});
const updateBlog = asyncHandler(async (req, res) => {
    try {
        console.log(req.user._id)
        let idString = String(req.user._id)
        console.log(idString);

        const { id } = req.params;
        validateMongoDbId(id);
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });

        if (!updateBlog) throw new Error("blog doesn`t exist!")
        return res.json(updateBlog)
    }
    catch (err) {

        throw new Error(err);
    }

})
const deleteBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const deleteBlog = await Blog.findByIdAndDelete(id);

        if (!deleteBlog) throw new Error("blog doesn`t exist!")
        return res.json(deleteBlog)
    }
    catch (err) {

        throw new Error(err);
    }

})
const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    const blog = await Blog.findById(blogId);
    const loginUserId = req.user?._id;
    const isLiked = blog?.isLiked;
    // const alreadyLiked = blog?.likes?.find(userId => userId.toString() === loginUserId.toString());
    // if (alreadyLiked) {
    //     res.redirect('')
    // }

    const alreadyDisliked = blog?.dislikes?.find(userId => userId?.toString() === loginUserId.toString())
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, { $pull: { dislikes: loginUserId }, isDisliked: false, isLiked: true, $push: { likes: loginUserId } }, { new: true })
        return res.json(blog)
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, { $pull: { likes: loginUserId }, isLiked: false }, { new: true })
        return res.json(blog)
    }
    else {

        const blog = await Blog.findByIdAndUpdate(blogId, { $push: { likes: loginUserId }, isLiked: true }, { new: true })
        return res.json(blog)
    }

})
const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    const blog = await Blog.findById(blogId);
    const loginUserId = req.user?._id;
    const isLiked = blog?.isLiked;
    // const alreadyLiked = blog?.likes?.find(userId => userId.toString() === loginUserId.toString());
    // if (alreadyLiked) {
    //     res.redirect('')
    // }

    const alreadyDisliked = blog?.dislikes?.find(userId => userId?.toString() === loginUserId.toString())
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, { $pull: { dislikes: loginUserId }, isDisliked: false, }, { new: true })
        return res.json(blog)
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, { $pull: { likes: loginUserId }, isLiked: false, isDisliked: true, $push: { dislikes: loginUserId } }, { new: true })
        return res.json(blog)
    }
    else {

        const blog = await Blog.findByIdAndUpdate(blogId, { $push: { dislikes: loginUserId }, isDisliked: true }, { new: true })
        return res.json(blog)
    }

})

module.exports = { createBlog, getBlogs, updateBlog, getBlog, deleteBlog, likeBlog, dislikeBlog }