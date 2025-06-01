import Category from "../models/category.model.js";
import Link from "../models/link.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user._id })
    apiResponse.success(res, "fetched", categories, 200)
})

export const createCategory = asyncHandler(async (req, res) => {

    const { name } = req.body;
    const userId = req.user._id

    const existing = await Category.findOne({ name });
    if (existing) {
        return apiResponse.error(res, 'Category already exists', null, 409);
    }

    const category = new Category({ name, user: userId });
    await category.save();

    apiResponse.success(res, 'Category created successfully', category, 201);
})

export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user._id; // ideally from req.user._id

    if (!name || name.trim() === "") {
        throw new apiError(400, "Category name is required");
    }

    const category = await Category.findOne({ _id: id, user: userId });

    if (!category) {
        throw new apiError(404, "Category not found");
    }

    category.name = name;
    await category.save();

    apiResponse.success(res, "Category updated successfully", category, 200);
});


export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const deleted = await Category.findOne({ _id: id, user: userId });

    if (!deleted) {
        throw new apiError(404, 'Category not found');
    }
    if (deleted.name.toLowerCase() === "uncategorized") {
        throw new apiError(400, 'Cannot delete the default Uncategorized category');
    }


    // 1. Check if 'Uncategorized' category exists for this user
    let uncategorized = await Category.findOne({ name: "Uncategorized", user: userId });

    // 2. If not, create it
    if (!uncategorized) {
        uncategorized = await Category.create({
            name: "Uncategorized",
            user: userId
        });
    }

    // 3. Update all links having this category to point to 'Uncategorized'
    await Link.updateMany(
        { category: deleted._id },
        { $set: { category: uncategorized._id } }
    );

    // 4. Delete the original category
    await deleted.deleteOne();

    apiResponse.success(res, 'Category deleted and links moved to Uncategorized', deleted, 200);
});
