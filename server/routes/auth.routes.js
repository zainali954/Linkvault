import {signup, login, googleLogin, logout, verifyEmail, resendEmail, forgotPassword, resetPassword, refreshToken, getSessions, deleteAllSessions, logoutOtherSessions} from '../controllers/auth.controller.js'
import express from 'express'
import protect from '../middlewares/protect.js';
const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/google', googleLogin)
router.post('/verify', verifyEmail)
router.post('/resend-verification-email', resendEmail)
router.post('/logout', logout)
router.post("/refresh", refreshToken)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

router.get("/sessions", protect, getSessions)
router.delete('/sessions', protect, deleteAllSessions)
router.post('/logout-others', protect, logoutOtherSessions)


export default router;