const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler')
const createProduct = asyncHandler(async (req, res) => {

    try {
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


module.exports = { createProduct, getProduct };