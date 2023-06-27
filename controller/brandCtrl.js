const expressAsyncHandler = require('express-async-handler');
const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodb');
const createBrand = asyncHandler(async (req, res) => {
    try {

        const newBrand = await Brand.create(req.body);
        return res.json(newBrand)


    }
    catch (err) {
        throw new Error(err);
    }
})
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true })
        return res.json(updatedBrand)


    }
    catch (err) {
        throw new Error(err);
    }
})
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {

        const deletedBrand = await Brand.findByIdAndDelete(id)
        return res.json(deletedBrand)


    }
    catch (err) {
        throw new Error(err);
    }
})
const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const getBrand = await Brand.findById(id)
        return res.json(getBrand)


    }
    catch (err) {
        throw new Error(err);
    }
})
const getAllBrand = asyncHandler(async (req, res) => {

    try {

        const getBrand = await Brand.find({})
        return res.json(getBrand)


    }
    catch (err) {
        throw new Error(err);
    }
})


module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand };