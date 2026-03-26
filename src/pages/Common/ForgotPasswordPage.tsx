import React, { useState } from 'react';
import { sendForgotPasswordEmail } from '../../services/httpClient';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendForgotPasswordEmail(email);
      setStatus({ type: 'success', msg: 'Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi!' });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Có lỗi xảy ra' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#FFFFF0', // Ivory/Cream background
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #E2DFD2' // Bone border
      }}>
        <h2 style={{ color: '#4A4A4A', marginBottom: '1rem', textAlign: 'center' }}>Quên mật khẩu</h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Nhập email của bạn để nhận liên kết thay đổi mật khẩu.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email của bạn"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '1rem',
              borderRadius: '8px',
              border: '1px solid #E2DFD2',
              backgroundColor: '#FAFAFA',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#E2DFD2', // Bone color button
              color: '#4A4A4A',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: '0.3s'
            }}
          >
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </form>

        {status && (
          <p style={{ 
            marginTop: '1rem', 
            textAlign: 'center', 
            color: status.type === 'success' ? '#2ecc71' : '#e74c3c',
            fontSize: '0.85rem'
          }}>
            {status.msg}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;