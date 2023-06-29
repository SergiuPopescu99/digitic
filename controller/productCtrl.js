const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler')
const slugify = require('slugify');
const User = require('../models/userModel');
const validateMongoDbId = require('../utils/validateMongodb');
const cloudinaryUploadImg = require('../utils/cloudinary')
const fs = require('fs')
const createProduct = asyncHandler(async (req, res) => {


    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);

    }
    catch (err) {
        throw new Error(err);
    }
})

const getProduct = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const findProduct = await Product.findById(id);
        if (findProduct) {
            return res.status(200).json(findProduct)
        }
        res.status(404).send(`Product with id-${id} not found!`)
    }
    catch (err) {
        throw new Error(err);
    }
})

const getProducts = asyncHandler(async (req, res) => {
    console.log(req.query)
    try {
        const queryObject = { ...req.query };
        console.log(queryObject)
        const excludeFields = ["page", "sort", "limit", "fields"]
        excludeFields.map((e) => delete queryObject[e])

        let queryStr = JSON.stringify(queryObject)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(queryStr)
        let query = Product.find(JSON.parse(queryStr));
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ")
            query = query.sort(sortBy);

        } else {
            query = query.sort('-createdAt');
        }

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v')
        }

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;

        if (req.query.page) {
            const prodCount = await Product.countDocuments();
            if (skip > prodCount) throw new Error("This page doesnt exist")
        }
        query = query.skip(skip).limit(limit);

        const product = await query;
        return res.json(product);


    }
    catch (err) {
        throw new Error(err);
    }

})

const updateProduct = asyncHandler(async (req, res) => {

    try {
        const { id } = req.params;
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);

        }
        const updateProdcut = await Product.findOneAndUpdate({ id }, req.body, { new: true })
        res.json(updateProdcut)
    }
    catch (err) {
        throw new Error(err);
    }

})
const deleteProduct = asyncHandler(async (req, res) => {

    try {
        const { id } = req.params;

        const deleteProdcut = await Product.findOneAndDelete({ id })
        res.status(200).json(`Deleted product : ${deleteProdcut}`)
    }
    catch (err) {
        throw new Error(err);
    }

})
const addToWishlist = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        if (!user) { throw new Error('404 User not found!') }
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId)
        if (alreadyAdded) {

            let userA = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: prodId }
            }, { new: true })
            return res.json(userA)
        }
        else {
            let userP = await User.findByIdAndUpdate(_id, {
                $push: { wishlist: prodId }
            }, { new: true })
            return res.json(userP)
        }
    }
    catch (err) {
        throw new Error(err);
    }
})

const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, prodId } = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === _id.toString())
        if (alreadyRated) {
            const updateRating = await Product.updateOne({
                ratings: { $elemMatch: alreadyRated },
            }, {
                $set: { "ratings.$.star": star, "ratings.$.comment": comment }
            },
                {
                    new: true
                })

        }
        else {
            const rateProduct = await Product.findByIdAndUpdate(prodId, { $push: { ratings: { star: star, comment: comment, postedBy: _id } } }, { new: true })

        }
        const getallratings = await Product.findById(prodId);
        const totalRating = getallratings.ratings.length;

        let ratingsum = getallratings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0)
        let actualRating = Math.round(ratingsum / totalRating);
        let finalProd = await Product.findByIdAndUpdate(prodId, { $set: { totalratings: actualRating } }, { new: true })
        return res.json(finalProd);
    }
    catch (err) {
        throw new Error(err);
    }

})
const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => { return cloudinaryUploadImg(path, "images"); }
        const urls = [];
        const files = req.files;
        for (const file of files) {
            console.log(file)
            const { path } = file;
            const { url } = await uploader(path);
            urls.push(url);
            fs.unlinkSync(path)
        }
        const product = await Product.findByIdAndUpdate(id, { images: urls.map((file) => { return file }) }, { new: true })
        return res.json(product);
    }
    catch (err) {
        throw new Error(err)
    }
})
module.exports = { createProduct, getProduct, getProducts, updateProduct, deleteProduct, addToWishlist, rating, uploadImages };