const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler')
const slugify = require('slugify');
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


module.exports = { createProduct, getProduct, getProducts, updateProduct, deleteProduct };