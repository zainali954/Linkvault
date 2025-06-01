import Session from "../models/session.model.js"
import User from "../models/user.model.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { updateNameSchema, updatePasswordSchema } from "../validators/user.validator.js"

export const updateName = asyncHandler(async(req, res)=>{
    const { error } = updateNameSchema.validate(req.body)
    if (error) {
        const cleanMessage = error.details[0].message.replace(/"/g, '');
        throw new apiError(400, cleanMessage);
    }

    const {name} = req.body

    const user = await User.findById(req.user._id); 

    if (!user) {
        throw new apiError(404, "User not found")
    }

    user.name = name;
    await user.save();
    apiResponse.success(res, "Name updated successfully", user, 200)
})

export const updatePassword=asyncHandler(async(req, res)=>{
    const { error } = updatePasswordSchema.validate(req.body)
    if (error) {
        const cleanMessage = error.details[0].message.replace(/"/g, '');
        throw new apiError(400, cleanMessage);
    }
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new apiError(404, "User not found")
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        throw new apiError(400, "Current password is incorrect")
    }
    user.password = newPassword
    await user.save();

     await Session.updateMany({user:user._id}, {isValid : false} )

    apiResponse.success(res, "Password updated successfully", null, 200)
})