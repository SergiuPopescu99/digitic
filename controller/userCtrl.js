const { generetareToken } = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodb');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailCtrl');
const crypto = require('crypto');
const { use } = require('../routes/authRoute');
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
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findOneAndUpdate(findUser.id, { refreshToken: refreshToken }, { new: true })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 });
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
// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) throw new Error("No refresh token");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No refresh token present in db!")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token!")

        } else {
            const accesssToken = generetareToken(user?._id)
            return res.json({ accesssToken })
        }

    })
})

//log out functionality 
const logout = asyncHandler(async (req, res, next) => {

    const cookie = req.cookies;
    if (!cookie.refreshToken) return next(new Error("No refresh token"));
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', { httpOnly: true, secure: true });
        return res.status(403).send("You need to be logged in in order to log out!")
    }
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    res.status(200).send("Logout successful!");

})

//get all users

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        return res.json(getUsers)
    } catch (err) {
        throw new Error(err);
    }

});
const getSingleUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const findUser = await User.findById(id);
        if (findUser) {
            return res.json(findUser);
        }
        else {
            res.status(404);
            res.json("User not found!")
        }
    }
    catch (err) {
        throw new Error(err);
    }
});
const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const deletedUser = await User.findByIdAndDelete(id);
        if (deletedUser) {
            return res.json(deletedUser);
        }
        else {
            res.status(404);
            res.json("User not found!")
        }
    }
    catch (err) {
        throw new Error(err);
    }
});
const updateUser = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        const newUserData =
        {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile
        }
        const findUser = await User.findByIdAndUpdate(id, newUserData, { new: true });
        if (findUser) {
            return res.json(findUser);
        }
        else {
            res.status(404);
            res.json("User not found!")
        }
    }
    catch (err) {
        throw new Error(err);
    }
});
const blockUser = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const blockedUser = await User.findByIdAndUpdate(id, {
            isBlocked: true
        }, { new: true })

        return res.json(blockedUser)
    }
    catch (err) {
        throw new Error(err);
    }

});
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const unblockedUser = await User.findByIdAndUpdate(id, {
            isBlocked: false
        }, { new: true })
        return res.json("user unblocked!")
    }
    catch (err) {
        throw new Error(err);
    }



});
const updatePassword = asyncHandler(async (req, res) => {
    console.log(req.user)
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        return res.json(updatePassword);
    } else {
        return res.json(user);
    }




});
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not  found with this email!");

    }
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi please follow this link to reset your password. The link is valid 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click here </a>`
        const data = {
            to: email,
            subject: "Forgot Password Link",
            html: resetURL,
            text: `Hello, ${user.firstname}`
        };
        await sendEmail(data);
        return res.json(token);
    }
    catch (err) {
        throw new Error(err);
    }
})
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = await crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })
    if (!user) {
        throw new Error("Token invalid or expired!")
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return res.json(user);
})

module.exports = { createUser, loginUserCtrl, getAllUsers, getSingleUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword }