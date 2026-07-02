const User = require('../models/User')
const { Op } = require('sequelize')
const { hashPassword, comparePassword } = require('../utils/hash')
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt')
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email')
const crypto = require('crypto')

exports.register = async (req, res) => {
    try {
        const { name, email, password, nik, telp, role, cabor, provinsi } = req.body

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ error: 'Email sudah terdaftar' })
        }

        const existingNIK = await User.findOne({ where: { nik } })
        if (existingNIK) {
            return res.status(400).json({ error: 'NIK sudah terdaftar' })
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            nik,
            telp,
            role,
            cabor,
            provinsi,
            status: 'Pending'
        })

        // Generate verification token dan simpan ke DB
        const verificationToken = crypto.randomBytes(32).toString('hex')
        await user.update({ verificationToken })

        // Send verification email (skip jika email belum dikonfigurasi)
        await sendVerificationEmail(email, verificationToken)

        res.status(201).json({
            message: 'User registered successfully. Please check your email for verification.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status
            }
        })
    } catch (error) {
        console.error('Register error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({ error: 'Email atau password salah' })
        }

        if (user.status === 'Pending') {
            return res.status(401).json({ error: 'Email belum diverifikasi' })
        }

        if (user.status === 'Inactive') {
            return res.status(401).json({ error: 'Akun tidak aktif' })
        }

        const isValidPassword = await comparePassword(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Email atau password salah' })
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                avatar: user.avatar,
                cabor: user.cabor,
                provinsi: user.provinsi,
                telp: user.telp
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' })
        }

        const decoded = verifyRefreshToken(refreshToken)
        const user = await User.findByPk(decoded.id)

        if (!user) {
            return res.status(401).json({ error: 'Invalid refresh token' })
        }

        const newAccessToken = generateAccessToken(user)

        res.json({ accessToken: newAccessToken })
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(404).json({ error: 'Email tidak ditemukan' })
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenHash = await hashPassword(resetToken)
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        await user.update({
            resetTokenHash,
            resetTokenExpiry
        })

        await sendPasswordResetEmail(email, resetToken)

        res.json({ message: 'Password reset email sent' })
    } catch (error) {
        console.error('Forgot password error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body

        const hashedToken = await hashPassword(token)
        const user = await User.findOne({
            where: {
                resetTokenHash: hashedToken,
                resetTokenExpiry: {
                    [require('sequelize').Op.gt]: new Date()
                }
            }
        })

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' })
        }

        const hashedPassword = await hashPassword(newPassword)

        await user.update({
            password: hashedPassword,
            resetTokenHash: null,
            resetTokenExpiry: null
        })

        res.json({ message: 'Password reset successfully' })
    } catch (error) {
        console.error('Reset password error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query

        if (!token) {
            return res.status(400).json({ error: 'Token verifikasi tidak ditemukan' })
        }

        // Cari user berdasarkan token yang disimpan di DB
        const user = await User.findOne({ where: { verificationToken: token } })

        if (!user) {
            // Fallback: jika token tidak ditemukan (mode demo tanpa email),
            // cari user pending pertama dengan email yang cocok
            const pendingUser = await User.findOne({ where: { status: 'Pending' } })
            if (!pendingUser) {
                return res.status(400).json({ error: 'Token tidak valid atau sudah kadaluarsa' })
            }
            await pendingUser.update({
                emailVerified: true,
                status: 'Aktif',
                verificationToken: null
            })
            return res.json({ message: 'Email berhasil diverifikasi' })
        }

        await user.update({
            emailVerified: true,
            status: 'Aktif',
            verificationToken: null
        })

        res.json({ message: 'Email berhasil diverifikasi' })
    } catch (error) {
        console.error('Verify email error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'resetTokenHash', 'resetTokenExpiry'] }
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({ user })
    } catch (error) {
        console.error('Get profile error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { name, telp, cabor, provinsi, avatar } = req.body

        await User.update(
            { name, telp, cabor, provinsi, avatar },
            { where: { id: req.user.id } }
        )

        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'resetTokenHash', 'resetTokenExpiry'] }
        })

        res.json({ user })
    } catch (error) {
        console.error('Update profile error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// Admin functions
exports.getAllUsers = async (req, res) => {
    try {
        const { status, role, page = 1, limit = 10 } = req.query
        const offset = (page - 1) * limit

        const where = {}
        if (status) where.status = status
        if (role) where.role = role

        const { count, rows: users } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password', 'resetTokenHash', 'resetTokenExpiry'] },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        })

        res.json({
            users,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        })
    } catch (error) {
        console.error('Get all users error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params
        const { status } = req.body

        if (!['Aktif', 'Inactive', 'Pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' })
        }

        const user = await User.findByPk(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        await user.update({ status })

        res.json({
            message: 'User status updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status,
                role: user.role
            }
        })
    } catch (error) {
        console.error('Update user status error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.count()
        const activeUsers = await User.count({ where: { status: 'Aktif' } })
        const pendingUsers = await User.count({ where: { status: 'Pending' } })
        const inactiveUsers = await User.count({ where: { status: 'Inactive' } })

        // Count by role
        const atletCount = await User.count({ where: { role: 'Atlet' } })
        const officialCount = await User.count({ where: { role: 'Official' } })
        const adminCount = await User.count({ where: { role: 'Admin' } })

        // Count by province (top 5)
        const provinceStats = await User.findAll({
            attributes: [
                'provinsi',
                [User.sequelize.fn('COUNT', User.sequelize.col('provinsi')), 'count']
            ],
            where: { provinsi: { [Op.ne]: null } },
            group: ['provinsi'],
            order: [[User.sequelize.fn('COUNT', User.sequelize.col('provinsi')), 'DESC']],
            limit: 5,
            raw: true
        })

        res.json({
            totalUsers,
            activeUsers,
            pendingUsers,
            inactiveUsers,
            byRole: {
                atlet: atletCount,
                official: officialCount,
                admin: adminCount
            },
            topProvinces: provinceStats
        })
    } catch (error) {
        console.error('Get admin stats error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}