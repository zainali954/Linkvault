// ─── Imports ──────────────────────────────────────────────
import { JSDOM } from 'jsdom';
import Category from "../models/category.model.js";
import Tag from "../models/tag.model.js";
import Link from "../models/link.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createLinkSchema } from "../validators/validator.js";

// ─── Controllers ──────────────────────────────────────────

export const createLink = asyncHandler(async (req, res) => {
    const { error } = createLinkSchema.validate(req.body);
    if (error) {
        const cleanMessage = error.details[0].message.replace(/"/g, '');
        throw new apiError(400, cleanMessage);
    }

    const { title, url, favicon, description, category, tags = [] } = req.body;
    const user = req.user._id;

    let categoryId = category;
    if (category) {
        if (typeof category !== "string" || category.length !== 24) {
            throw new apiError(400, "Invalid category ID");
        }
    } else {
        let uncategorized = await Category.findOne({ name: "Uncategorized", user });
        if (!uncategorized) {
            uncategorized = await Category.create({ name: "Uncategorized", user });
        }
        categoryId = uncategorized._id;
    }

    if (!Array.isArray(tags)) {
        throw new apiError(400, "Tags must be an array of IDs");
    }
    for (const tag of tags) {
        if (typeof tag !== "string" || tag.length !== 24) {
            throw new apiError(400, "One or more tag IDs are invalid");
        }
    }

    const newLink = await Link.create({
        title,
        url,
        favicon,
        description,
        category: categoryId,
        tags,
        user,
    });

    return apiResponse.success(res, "Link created successfully", newLink, 201);
});


export const getLinks = asyncHandler(async (req, res) => {
  const { category, tags, favorite, search, page = 1, limit = 12 } = req.query;
  const filter = {
    user: req.user._id, 
  };

  // Category filter by slug
  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });
    if (!categoryDoc) return apiResponse.success(res, "No links found", [], 200);
    filter.category = categoryDoc._id;
  }

  // Tags filter by slug
  if (tags) {
    const tagSlugs = tags.split(',');
    const tagDocs = await Tag.find({ slug: { $in: tagSlugs } });
    const tagIds = tagDocs.map(tag => tag._id);
    if (tagIds.length === 0) return apiResponse.success(res, "No links found", [], 200);
    filter.tags = { $in: tagIds };
  }

  // Favorite filter
  if (favorite === "true") filter.isFavorite = true;
  else if (favorite === "false") filter.isFavorite = false;

  // Search filter (title OR description)
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const pageNum = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (pageNum - 1) * pageSize;

  const total = await Link.countDocuments(filter);

  const links = await Link.find(filter)
    .populate('category')
    .populate('tags')
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 });

  apiResponse.success(res, "Fetched", links, 200);
});



export const deleteLink = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const deleted = await Link.findOne({ _id: id, user: userId });
    if (!deleted) throw new apiError(404, 'Link not found');

    await deleted.deleteOne();
    apiResponse.success(res, 'Link deleted successfully', deleted, 200);
});

export const updateLink = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { error } = createLinkSchema.validate(req.body);
    if (error) {
        const cleanMessage = error.details[0].message.replace(/"/g, '');
        throw new apiError(400, cleanMessage);
    }

    const { title, url, favicon, description, category, tags = [] } = req.body;
    const user = req.user._id;

    const existingLink = await Link.findOne({ _id: id, user });
    if (!existingLink) throw new apiError(404, "Link not found");

    existingLink.title = title;
    existingLink.url = url;
    existingLink.favicon = favicon;
    existingLink.description = description;
    existingLink.category = category;
    existingLink.tags = tags;

    await existingLink.save();

    return apiResponse.success(res, "Link updated successfully", existingLink, 200);
});

export const toggleFavorite = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const link = await Link.findById(id);
    if (!link) throw new apiError(404, "Link not found");

    link.isFavorite = !link.isFavorite;
    await link.save();

    return apiResponse.success(res, "Favorite status updated", link, 200);
});
