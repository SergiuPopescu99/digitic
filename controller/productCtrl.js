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
        const { sort, ...body } = req.query;
        const excludeFields = ["page", "limit", "fields"]
        excludeFields.map((e) => delete body[e])
        console.log(body)
        let queryStr = JSON.stringify(body)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(queryStr)
        const query = Product.find(JSON.parse(queryStr));

        if (sort && body) {

            const sortedProducts = await query.sort({ [sort]: -1 })
            return res.json(sortedProducts);
        }
        else if (sort) {
            const sortedProducts = await Product.find().sort({ [sort]: -1 })
            return res.json(sortedProducts);
        }
        else if (body) {
            const sortedProducts = await query;
            return res.json(sortedProducts);
        }
        const getAllProducts = await Product.find();
        return res.json(getAllProducts);

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