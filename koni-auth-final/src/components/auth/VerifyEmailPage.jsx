import { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { COLORS } from '../../data/constants';

function VerifyEmailPage() {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Token verifikasi tidak ditemukan');
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('Email berhasil diverifikasi! Anda sekarang dapat login.');
        setTimeout(() => {
          window.location.href = '/'; // Navigate to home page
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Verifikasi gagal');
      }
    };

    verifyEmail();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: COLORS.gradient,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        {status === 'verifying' && (
          <>
            <div style={{
              width: '48px',
              height: '48px',
              border: `4px solid ${COLORS.primary}20`,
              borderTop: `4px solid ${COLORS.primary}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <h2 style={{ color: COLORS.text, marginBottom: '10px' }}>
              Memverifikasi Email...
            </h2>
            <p style={{ color: COLORS.textSecondary }}>
              Mohon tunggu sebentar
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              background: COLORS.success,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'white',
              fontSize: '32px'
            }}>
              ✓
            </div>
            <h2 style={{ color: COLORS.success, marginBottom: '10px' }}>
              Verifikasi Berhasil!
            </h2>
            <p style={{ color: COLORS.textSecondary }}>
              {message}
            </p>
            <p style={{ color: COLORS.textSecondary, fontSize: '14px', marginTop: '10px' }}>
              Anda akan diarahkan ke halaman login dalam 3 detik...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              background: COLORS.error,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'white',
              fontSize: '32px'
            }}>
              ✕
            </div>
            <h2 style={{ color: COLORS.error, marginBottom: '10px' }}>
              Verifikasi Gagal
            </h2>
            <p style={{ color: COLORS.textSecondary }}>
              {message}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                background: COLORS.primary,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '20px',
                fontSize: '16px'
              }}
            >
              Kembali ke Beranda
            </button>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default VerifyEmailPage;