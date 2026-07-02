const nodemailer = require('nodemailer')

const isEmailConfigured = () => {
    return process.env.EMAIL_USER &&
        process.env.EMAIL_USER !== 'your-email@gmail.com' &&
        process.env.EMAIL_PASSWORD &&
        process.env.EMAIL_PASSWORD !== 'your-app-password'
}

const getTransporter = () => {
    if (!isEmailConfigured()) return null
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })
}

const sendVerificationEmail = async (email, token) => {
    if (!isEmailConfigured()) {
        console.log(`[EMAIL SKIP] Verifikasi untuk ${email} — token: ${token}`)
        console.log(`[EMAIL SKIP] Isi EMAIL_USER & EMAIL_PASSWORD di .env untuk kirim email sungguhan`)
        return { skipped: true }
    }

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
    const transporter = getTransporter()

    const mailOptions = {
        from: `"KONI Pusat" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '✅ Verifikasi Email - KONI Pusat',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #CC0000;">🏆 Selamat Datang di KONI Pusat!</h2>
            <p>Terima kasih telah mendaftar. Silakan klik tombol di bawah untuk memverifikasi email Anda:</p>
            <a href="${verificationUrl}" style="display:inline-block; background:#CC0000; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; margin: 16px 0;">
                Verifikasi Email
            </a>
            <p style="color:#888; font-size:12px;">Link ini akan kadaluarsa dalam 24 jam. Jika Anda tidak mendaftar, abaikan email ini.</p>
        </div>
        `
    }

    return await transporter.sendMail(mailOptions)
}

const sendPasswordResetEmail = async (email, token) => {
    if (!isEmailConfigured()) {
        console.log(`[EMAIL SKIP] Reset password untuk ${email} — token: ${token}`)
        console.log(`[EMAIL SKIP] Isi EMAIL_USER & EMAIL_PASSWORD di .env untuk kirim email sungguhan`)
        return { skipped: true }
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
    const transporter = getTransporter()

    const mailOptions = {
        from: `"KONI Pusat" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 Reset Password - KONI Pusat',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #CC0000;">🔐 Reset Password</h2>
            <p>Kami menerima permintaan reset password untuk akun Anda. Klik tombol di bawah:</p>
            <a href="${resetUrl}" style="display:inline-block; background:#CC0000; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; margin: 16px 0;">
                Reset Password
            </a>
            <p style="color:#888; font-size:12px;">Link ini akan kadaluarsa dalam 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.</p>
        </div>
        `
    }

    return await transporter.sendMail(mailOptions)
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
}
