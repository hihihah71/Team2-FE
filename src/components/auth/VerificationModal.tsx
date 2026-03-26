import React, { useState, useEffect } from 'react';
import { apiPost } from '../../services/httpClient';
import { API_ENDPOINTS } from '../../constants/api';
import OTPInput from './OTPInput';
import { Mail, CheckCircle, AlertCircle, X } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  email: string;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onVerified, email }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      handleRequestOTP();
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleRequestOTP = async () => {
    try {
      setLoading(true);
      setError(null);
      await apiPost(API_ENDPOINTS.AUTH_REQUEST_VERIFICATION, {});
      setResendCountdown(60);
    } catch (err: any) {
      setError(err.message || 'Không thể gửi mã xác thực.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiPost(API_ENDPOINTS.AUTH_VERIFY_ACCOUNT, { code });
      setSuccess(true);
      setTimeout(() => {
        onVerified();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Xác thực thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid rgba(148,163,184,0.1)',
        borderRadius: '24px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
          }}
        >
          <X size={24} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: 'rgba(34,197,94,0.1)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <CheckCircle size={48} color="#22c55e" />
            </div>
            <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '8px' }}>Xác thực thành công!</h2>
            <p style={{ color: '#94a3b8' }}>Bạn có thể tiếp tục ứng tuyển ngay bây giờ.</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: 'rgba(37,99,235,0.1)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Mail size={32} color="#2563eb" />
              </div>
              <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Xác thực tài khoản</h2>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
                Vui lòng nhập mã 6 số được gửi tới <br />
                <span style={{ color: '#fff', fontWeight: '600' }}>{email}</span>
              </p>
            </div>

            <OTPInput onComplete={handleVerify} disabled={loading} />

            {error && (
              <div style={{ 
                marginTop: '16px', 
                padding: '12px', 
                borderRadius: '12px', 
                backgroundColor: 'rgba(239,68,68,0.1)', 
                color: '#ef4444',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>Không nhận được mã?</p>
              <button
                onClick={handleRequestOTP}
                disabled={loading || resendCountdown > 0}
                style={{
                  background: 'none',
                  border: 'none',
                  color: resendCountdown > 0 ? '#475569' : '#2563eb',
                  fontWeight: '600',
                  cursor: resendCountdown > 0 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                }}
              >
                {resendCountdown > 0 ? `Gửi lại mã (${resendCountdown}s)` : 'Gửi lại mã'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationModal;
