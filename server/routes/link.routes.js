import express from 'express'
import { createLink, deleteLink, getLinks, toggleFavorite, updateLink } from '../controllers/link.controller.js';
import protect from '../middlewares/protect.js';
const router = express.Router();


router.post('/',protect, createLink)
router.get('/',protect, getLinks)
router.delete('/:id',protect, deleteLink)
router.patch('/:id',protect, toggleFavorite)
router.put('/:id',protect, updateLink)



export default router;