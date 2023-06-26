const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Blog = require('../models/blogModel')
const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (err) {
            throw new Error('Not authorized token expired , please login again!')
        }
    }
    else {
        throw new Error("There is no token attached to the header!")
    }
})

const isAdmin = asyncHandler(async (req, res, next) => {

    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.role !== "admin") {
        throw new Error("Not an admin");
    }
    else {
        next();
    }


});
const isAuthor = asyncHandler(async (req, res, next) => {
    console.log("AUTHOR MIDDLEWEAR!")
    const idString = String(req.user._id);
    const { id } = req.params;
    console.log(idString, id)
    const blog = await Blog.findById(id);
    console.log(blog)
    if (!blog) {
        throw new Error("Blog not found!")
    }
    if (blog.author !== idString) {
        throw new Error("Must own the blog in order to delete!")
    }
    else if (req.user.role = "admin") {
        next()
    }
    else throw new Error("this can be deleted only by admin / owner!")
})
module.exports = { authMiddleware, isAdmin, isAuthor }; 