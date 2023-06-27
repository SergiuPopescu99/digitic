const expressAsyncHandler = require('express-async-handler');
const Category = require('../models/blogCatModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodb');
const createCatgory = asyncHandler(async (req, res) => {
    try {

        const newCategory = await Category.create(req.body);
        return res.json(newCategory)


    }
    catch (err) {
        throw new Error(err);
    }
})
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true })
        return res.json(updatedCategory)


    }
    catch (err) {
        throw new Error(err);
    }
})
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {

        const deletedCategory = await Category.findByIdAndDelete(id)
        return res.json(deletedCategory)


    }
    catch (err) {
        throw new Error(err);
    }
})
const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const getCategory = await Category.findById(id)
        return res.json(getCategory)


    }
    catch (err) {
        throw new Error(err);
    }
})
const getAllCategory = asyncHandler(async (req, res) => {

    try {

        const getCategory = await Category.find({})
        return res.json(getCategory)


    }
    catch (err) {
        throw new Error(err);
    }
})


module.exports = { createCatgory, updateCategory, deleteCategory, getCategory, getAllCategory };