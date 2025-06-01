import Joi from "joi";

export const updateNameSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
});

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});
