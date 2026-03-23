import React, { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { X, Plus } from 'lucide-react';
import type { ProfileFormData } from '../../types/profile';

interface Props {
    fieldName: 'skills' | 'languages';
    title: string;
    desc: string;
    icon: React.ReactNode;
}

const levels = ['Cơ bản', 'Trung bình', 'Khá', 'Chuyên gia'];

export const SkillsManager: React.FC<Props> = ({ fieldName, title, desc, icon }) => {
    const { control } = useFormContext<ProfileFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: fieldName
    });

    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState(levels[1]); // Default to Trung bình

    const handleAdd = () => {
        if (newSkillName.trim()) {
            // Check for duplicates
            const isDuplicate = fields.some(f => f.name.toLowerCase() === newSkillName.trim().toLowerCase());
            if (!isDuplicate) {
                append({ name: newSkillName.trim(), level: newSkillLevel });
                setNewSkillName('');
            } else {
                alert(`${newSkillName} đã tồn tại trong danh sách!`);
            }
        }
    };

    return (
        <div className="profile-section-fade">
            <h2 className="profile-section-title">
                {icon}
                {title}
            </h2>
            <p className="profile-section-desc">{desc}</p>

            <div className="profile-form-group full-width">
                <label className="profile-label">Thêm mới</label>
                <div className="profile-skill-input-wrapper" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        className="profile-input"
                        style={{ flex: 1, minWidth: '200px' }}
                        placeholder={`Thêm ${fieldName === 'skills' ? 'kỹ năng' : 'ngoại ngữ'} mới...`}
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
                    />
                    <select
                        className="profile-input"
                        style={{ width: '150px' }}
                        value={newSkillLevel}
                        onChange={(e) => setNewSkillLevel(e.target.value)}
                    >
                        {levels.map(l => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                    <button
                        type="button"
                        className="profile-btn profile-btn-primary"
                        onClick={handleAdd}
                        style={{ padding: '0 16px' }}
                    >
                        <Plus size={18} /> Thêm
                    </button>
                </div>

                <div className="profile-skills-wrapper" style={{ marginTop: '16px' }}>
                    {fields.length === 0 && (
                        <div style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>
                            Chưa có dữ liệu nào.
                        </div>
                    )}
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="profile-skill-tag"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '14px' }}>{field.name}</span>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{field.level}</span>
                            </div>
                            <button
                                type="button"
                                className="profile-skill-remove"
                                onClick={() => remove(index)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', marginLeft: '4px' }}
                                title="Xóa"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
