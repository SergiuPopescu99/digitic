const Coupon = require('../models/couponModel')
const validateMongoDbId = require('../utils/validateMongodb');

const asyncHandler = require('express-async-handler')

const createCoupon = asyncHandler(async (req, res) => {

    try {
        const newCoupon = await Coupon.create(req.body);
        return res.json(newCoupon)
    }
    catch (err) {
        throw new Error(err);
    }

})

const getAllCoupon = asyncHandler(async (req, res) => {

    try {
        const Coupons = await Coupon.find();
        return res.json(Coupons)
    }
    catch (err) {
        throw new Error(err);
    }

})


const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        return res.json(updateCoupon)
    }
    catch (err) {
        throw new Error(err);
    }

})

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        return res.json(deleteCoupon)
    }
    catch (err) {
        throw new Error(err);
    }

})

module.exports = { createCoupon, getAllCoupon, updateCoupon, deleteCoupon };