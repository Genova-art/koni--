import api from './api'

const normalizeUser = (user = {}) => {
    const displayName = user.name || user.nama || 'Pengguna KONI'
    return {
        ...user,
        name: displayName,
        nama: displayName,
        role: user.role || 'Atlet',
        status: user.status || 'Aktif',
        avatar: user.avatar || '👤',
        bergabung: user.bergabung || (user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear())
    }
}

export const authService = {
    async register(userData) {
        const payload = {
            ...userData,
            name: userData.name || userData.nama
        }
        delete payload.nama
        delete payload.confirm

        const response = await api.post('/auth/register', payload)
        return response.data
    },

    async login(credentials) {
        const response = await api.post('/auth/login', credentials)
        const { accessToken, refreshToken, user } = response.data

        // Store tokens
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        return { user: normalizeUser(user) }
    },

    async logout() {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    },

    async getProfile() {
        const response = await api.get('/auth/me')
        return normalizeUser(response.data.user)
    },

    async updateProfile(userData) {
        const response = await api.put('/auth/profile', userData)
        return normalizeUser(response.data.user)
    },

    async forgotPassword(email) {
        const response = await api.post('/auth/forgot-password', { email })
        return response.data
    },

    async resetPassword(token, newPassword) {
        const response = await api.post('/auth/reset-password', {
            token,
            newPassword
        })
        return response.data
    },

    async verifyEmail(token) {
        const response = await api.get(`/auth/verify-email?token=${token}`)
        return response.data
    },

    isAuthenticated() {
        return !!localStorage.getItem('accessToken')
    },

    getCurrentUser() {
        const token = localStorage.getItem('accessToken')
        if (!token) return null

        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            return {
                id: payload.id,
                email: payload.email,
                role: payload.role
            }
        } catch {
            return null
        }
    },

    // Admin functions
    async getAllUsers(params = {}) {
        const response = await api.get('/admin/users', { params })
        return response.data
    },

    async updateUserStatus(userId, status) {
        const response = await api.put(`/admin/users/${userId}/status`, { status })
        return response.data
    },

    async getAdminStats() {
        const response = await api.get('/admin/stats')
        return response.data
    }
}
