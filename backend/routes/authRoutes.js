const express = require('express')
const {
    register,
    login,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
    getProfile,
    updateProfile,
    getAllUsers,
    updateUserStatus,
    getAdminStats
} = require('../controllers/authController')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

// Public routes
router.post('/auth/register', register)
router.post('/auth/login', login)
router.post('/auth/refresh', refreshToken)
router.post('/auth/forgot-password', forgotPassword)
router.post('/auth/reset-password', resetPassword)
router.get('/auth/verify-email', verifyEmail)

// Protected routes
router.get('/auth/me', authenticateToken, getProfile)
router.put('/auth/profile', authenticateToken, updateProfile)

// Admin routes
router.get('/admin/users', authenticateToken, requireAdmin, getAllUsers)
router.put('/admin/users/:userId/status', authenticateToken, requireAdmin, updateUserStatus)
router.get('/admin/stats', authenticateToken, requireAdmin, getAdminStats)

module.exports = router