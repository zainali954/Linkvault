import express from 'express'
import protect from '../middlewares/protect.js';
import { updateName, updatePassword } from '../controllers/user.controller.js';
const router = express.Router()

router.patch('/update-name', protect, updateName);
router.patch('/update-password', protect, updatePassword);

export default router;