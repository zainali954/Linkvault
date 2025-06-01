import express from 'express'
import { createTag, deleteTag, getTags, updateTag } from '../controllers/tag.controller.js';
import protect from '../middlewares/protect.js';
const router = express.Router();

router.get('/',protect, getTags)
router.post('/',protect, createTag)
router.put('/:id',protect, updateTag)
router.delete('/:id',protect, deleteTag)

export default router;