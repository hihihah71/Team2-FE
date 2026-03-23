import React from 'react';
import { useFormContext } from 'react-hook-form';
import { User, CheckCircle, XCircle } from 'lucide-react';
import type { ProfileFormData } from '../../types/profile';

// Optional: For Phase 4 we will integrate TipTap here. For now, regular textarea is used.
interface Props {
    onShowToast: (msg: string) => void;
}

export const BasicInfoForm: React.FC<Props> = ({ onShowToast }) => {
    const { register, watch, setValue, formState: { errors } } = useFormContext<ProfileFormData>();

    const isVerified = watch('personalInfo.isVerified');
    const email = watch('personalInfo.email');

    const handleVerifyEmail = () => {
        if (window.confirm(`Hệ thống sẽ gửi email xác thực đến địa chỉ: ${email}\nBạn có muốn thực hiện xác thực ngay?`)) {
            onShowToast('Đang gửi email xác thực...');
            setTimeout(() => {
                setValue('personalInfo.isVerified', true, { shouldDirty: true });
                onShowToast('Tài khoản đã được xác thực thành công qua Email!');
            }, 1500);
        }
    };

    return (
        <div className="profile-section-fade">
            <h2 className="profile-section-title">
                <User size={20} />
                Thông tin cơ bản
            </h2>
            <p className="profile-section-desc">Cập nhật thông tin cá nhân của bạn để hiển thị rõ ràng trên CV ứng tuyển.</p>

            <div className="profile-form-grid">
                <div className="profile-form-group">
                    <label className="profile-label">ID Tài khoản <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal', marginLeft: '4px' }}>(Cấp mặc định)</span></label>
                    <input
                        type="text"
                        className="profile-input"
                        {...register('personalInfo.id')}
                        readOnly
                        style={{ backgroundColor: 'rgba(255,255,255,0.02)', color: '#94a3b8', cursor: 'not-allowed' }}
                        title="ID không thể thay đổi"
                    />
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Họ và tên <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="text" className="profile-input" {...register('personalInfo.fullName')} placeholder="Nhập họ tên của bạn..." />
                    {errors.personalInfo?.fullName && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.personalInfo.fullName.message}</span>}
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Vị trí ứng tuyển / Chuyên môn <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="text" className="profile-input" {...register('personalInfo.role')} placeholder="Ví dụ: Backend Developer..." />
                    {errors.personalInfo?.role && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.personalInfo.role.message}</span>}
                </div>

                <div className="profile-form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                    <label className="profile-label">Trạng thái xác thực</label>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        {isVerified ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 500, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: '6px', width: '100%', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <CheckCircle size={18} />
                                Đã xác thực
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 500, backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px', flex: 1, fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    <XCircle size={16} />
                                    Chưa xác thực
                                </div>
                                <button type="button" className="profile-btn profile-btn-secondary" style={{ whiteSpace: 'nowrap', borderColor: '#ef4444', color: '#ef4444', padding: '0 12px' }} onClick={handleVerifyEmail} title="Duyệt Gmail để xác thực tài khoản">
                                    Duyệt Gmail
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Ngày sinh</label>
                    <input type="date" className="profile-input" {...register('personalInfo.dob')} />
                </div>

                <div className="profile-form-group">
                    <label className="profile-label">Số điện thoại</label>
                    <input type="tel" className="profile-input" {...register('personalInfo.phone')} placeholder="Nhập số điện thoại..." />
                    {errors.personalInfo?.phone && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.personalInfo.phone.message}</span>}
                </div>

                <div className="profile-form-group full-width">
                    <label className="profile-label">Địa chỉ Email <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="email" className="profile-input" {...register('personalInfo.email')} placeholder="Email liên hệ..." />
                    {errors.personalInfo?.email && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errors.personalInfo.email.message}</span>}
                </div>

                <div className="profile-form-group full-width">
                    <label className="profile-label">Nơi ở hiện tại / Địa chỉ</label>
                    <input type="text" className="profile-input" {...register('personalInfo.address')} placeholder="Nhập địa chỉ..." />
                </div>

                <div className="profile-form-group full-width">
                    <label className="profile-label">Giới thiệu ngắn về bản thân (Summary)</label>
                    <textarea className="profile-input profile-textarea" {...register('personalInfo.summary')} placeholder="Viết vài dòng giới thiệu sự nghiệp..."></textarea>
                </div>
            </div>
        </div>
    );
};
