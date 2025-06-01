import Tag from "../models/tag.model.js";
import Link from "../models/link.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find({user:req.user._id})
    apiResponse.success(res, "fetched", tags, 200)
})

export const createTag = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const userId = req.user._id

    const existing = await Tag.findOne({ name });
    if (existing) {
        return apiResponse.error(res, 'Tag already exists', null, 409);
    }

    const newTag = new Tag({ name, user:userId });
    await newTag.save();
    apiResponse.error(res, 'Tag created successfully', Tag, 201);
})

export const updateTag = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user._id; // ideally from req.user._id

    if (!name || name.trim() === "") {
        throw new apiError(400, "Tag name is required");
    }

    const tag = await Tag.findOne({ _id: id, user: userId });

    if (!tag) {
        throw new apiError(404, "Tag not found");
    }

    tag.name = name;
    await tag.save();

    apiResponse.success(res, "Tag updated successfully", tag, 200);
});



export const deleteTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const deleted = await Tag.findOne({ _id: id, user: userId });

  if (!deleted) {
    throw new apiError(404, 'Tag not found');
  }

  //  Remove the tag from all links that have it
  await Link.updateMany(
    { user: userId, tags: id },
    { $pull: { tags: id } }
  );

  //  Delete the tag
  await deleted.deleteOne();

  apiResponse.success(res, 'Tag deleted successfully', deleted, 200);
});