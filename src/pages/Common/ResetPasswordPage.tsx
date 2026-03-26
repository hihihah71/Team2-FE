import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiPost } from '../../services/httpClient';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setStatus({ type: 'error', msg: 'Mật khẩu xác nhận không khớp' });
    }

    setLoading(true);
    try {
      // This hits your backend reset-password endpoint
      await apiPost('/auth/reset-password', { token, newPassword });
      window.alert('Mật khẩu đã được cập nhật thành công!');
      navigate('/'); 
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Có lỗi xảy ra' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'radial-gradient(circle at top, #1f2937, #020617)',
      padding: '24px'
    }}>
      <div style={{ 
        width: '100%', maxWidth: '420px', backgroundColor: '#020617', 
        borderRadius: '16px', padding: '28px', border: '1px solid rgba(148,163,184,0.35)',
        boxShadow: '0 20px 45px -15px rgba(15,23,42,0.9)', color: '#e5e7eb'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Đặt lại mật khẩu</h2>
        <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: '14px' }}>Nhập mật khẩu mới bên dưới.</p>

        <form onSubmit={handleReset} style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'grid', gap: '6px' }}>
            <label style={{ fontSize: '14px', color: '#d1d5db' }}>Mật khẩu mới</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#020617', color: 'white' }}
            />
          </div>

          <div style={{ display: 'grid', gap: '6px' }}>
            <label style={{ fontSize: '14px', color: '#d1d5db' }}>Xác nhận mật khẩu</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#020617', color: 'white' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            style={{
              marginTop: '8px', padding: '12px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #E2DFD2, #FFFFF0)', 
              color: '#020617', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
          </button>
        </form>

        {status && (
          <p style={{ marginTop: '16px', textAlign: 'center', color: '#ef4444', fontSize: '14px' }}>
            {status.msg}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;