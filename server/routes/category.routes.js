import express from 'express'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controllers/category.controller.js';
import protect from '../middlewares/protect.js';
const router = express.Router();


router.get('/',protect, getCategories)
router.post('/',protect, createCategory)
router.delete('/:id',protect, deleteCategory)
router.put('/:id',protect, updateCategory)


export default router;