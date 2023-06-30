const expressAsyncHandler = require('express-async-handler');
const Color = require('../models/colorModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodb');
const createColor = asyncHandler(async (req, res) => {
    try {

        const newColor = await Color.create(req.body);
        return res.json(newColor)


    }
    catch (err) {
        throw new Error(err);
    }
})
const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const updatedColor = await Color.findByIdAndUpdate(id, req.body, { new: true })
        return res.json(updatedColor)


    }
    catch (err) {
        throw new Error(err);
    }
})
const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {

        const deletedColor = await Color.findByIdAndDelete(id)
        return res.json(deletedColor)


    }
    catch (err) {
        throw new Error(err);
    }
})
const getColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const getColor = await Color.findById(id)
        return res.json(getColor)


    }
    catch (err) {
        throw new Error(err);
    }
})
const getAllColor = asyncHandler(async (req, res) => {

    try {

        const getColor = await Color.find({})
        return res.json(getColor)


    }
    catch (err) {
        throw new Error(err);
    }
})


module.exports = { createColor, updateColor, deleteColor, getColor, getAllColor };