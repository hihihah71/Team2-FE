import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import type { ProfileFormData } from '../../types/profile';

interface Props {
    isRecruiter: boolean;
    onShowToast: (msg: string) => void;
}

export const AvatarAndCover: React.FC<Props> = ({ isRecruiter, onShowToast }) => {
    const { watch, setValue } = useFormContext<ProfileFormData>();

    const coverUrl = watch('personalInfo.coverUrl');
    const avatarUrl = watch('personalInfo.avatarUrl');
    const fullName = watch('personalInfo.fullName');
    const role = watch('personalInfo.role');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const maxWidth = type === 'avatar' ? 400 : 1200;
                const maxHeight = type === 'avatar' ? 400 : 800;

                const compressImage = (fileToCompress: File, mWidth: number, mHeight: number, quality: number): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(fileToCompress);
                        reader.onload = (event) => {
                            const img = new Image();
                            img.src = event.target?.result as string;
                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                let width = img.width;
                                let height = img.height;

                                if (width > height) {
                                    if (width > mWidth) {
                                        height = Math.round((height * mWidth) / width);
                                        width = mWidth;
                                    }
                                } else {
                                    if (height > mHeight) {
                                        width = Math.round((width * mHeight) / height);
                                        height = mHeight;
                                    }
                                }

                                canvas.width = width;
                                canvas.height = height;

                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                    ctx.drawImage(img, 0, 0, width, height);
                                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                                    resolve(compressedBase64);
                                } else {
                                    resolve(event.target?.result as string);
                                }
                            };
                            img.onerror = (error) => reject(error);
                        };
                        reader.onerror = (error) => reject(error);
                    });
                };

                const compressedBase64 = await compressImage(file, maxWidth, maxHeight, 0.7);
                setValue(type === 'avatar' ? 'personalInfo.avatarUrl' : 'personalInfo.coverUrl', compressedBase64, { shouldDirty: true });
                onShowToast(`Đã tải ảnh ${type === 'avatar' ? 'đại diện' : 'bìa'} lên thành công!`);
            } catch (error) {
                console.error('Lỗi khi nén ảnh:', error);
                alert('Có lỗi xảy ra khi xử lý ảnh, vui lòng thử lại!');
            }
        }
    };

    const triggerFileInput = (id: string) => {
        document.getElementById(id)?.click();
    };

    const displayAvatar = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=1e293b&color=f8fafc&size=140`;

    return (
        <div className="profile-header-section">
            <div
                className="profile-cover"
                style={{
                    backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <input type="file" id="coverUpload" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                <button type="button" className="profile-cover-action" onClick={() => triggerFileInput('coverUpload')}>
                    <ImageIcon size={16} />
                    Đổi ảnh bìa
                </button>
            </div>

            <div className="profile-info-bar">
                <div className="profile-avatar-wrapper">
                    <input type="file" id="avatarUpload" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                    <img
                        src={displayAvatar}
                        alt="Avatar"
                        className="profile-avatar-img"
                    />
                    <div className="profile-avatar-overlay" onClick={() => triggerFileInput('avatarUpload')}>
                        <Camera size={24} style={{ marginBottom: 4 }} />
                        <span>Đổi avatar</span>
                    </div>
                </div>

                <div className="profile-user-summary">
                    <h1 className="profile-user-name">{fullName || 'Chưa cập nhật tên'}</h1>
                    <p className="profile-user-role">{role || 'Vai trò/Vị trí ứng tuyển'}</p>
                    <Link
                        to={isRecruiter ? ROUTES.RECRUITER_DASHBOARD : ROUTES.STUDENT_DASHBOARD}
                        className="profile-back-link"
                    >
                        ← Về trang Tổng quan
                    </Link>
                </div>
            </div>
        </div>
    );
};
