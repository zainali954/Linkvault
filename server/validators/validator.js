import Joi from "joi";
import mongoose from "mongoose";

// Helper to validate ObjectId
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const createLinkSchema = Joi.object({
    title: Joi.string().trim().required(),
    url: Joi.string().trim().required(),
    favicon: Joi.string().trim().allow(""),
    description: Joi.string().trim().allow(""),
    category: Joi.string().trim().allow(null),
    tags: Joi.array().items(Joi.string().trim()),
})

export const createCategorySchema = Joi.object({
    name: Joi.string().trim().required(),
})

export const createTagSchema = Joi.object({
    name: Joi.string().trim().required(),
})

