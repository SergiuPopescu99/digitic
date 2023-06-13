const { generetareToken } = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler');
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    console.log(email)
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        //Create a new user 
        const newUser = new User(req.body);
        await newUser.save();
        return res.json(newUser);
    }
    else {
        //User already exists
        throw new Error('user already exists!')
    }

})

const loginUserCtrl = asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    const findUser = await User.findOne({ email: email });
    if (findUser && findUser.isPasswordMatched(password)) {
        return res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generetareToken(findUser?._id)
        });
    } else {
        throw new Error("invalid credentials!")
    }


})
module.exports = { createUser, loginUserCtrl }