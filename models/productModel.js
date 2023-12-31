const mongoose = require('mongoose')


let productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0,
        select: false
    },
    images: [],
    color: [],
    tags: [],
    ratings: [{
        star: Number,
        comment: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }],
    totalratings: {
        type: Number,
        default: 0
    }

}, { timestamps: true })


module.exports = mongoose.model("Product", productSchema);