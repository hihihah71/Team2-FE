import React from 'react';
import './ProfileView.css';

interface ProfileViewProps {
    personalInfo: any;
    skills: string[];
    experiences: any[];
    educations: any[];
    socialLinks: any;
    projects: any[];
    languages: any[];
    certifications: any[];
    activities: any[];
    hobbies: string[];
    isRecruiter: boolean;
    companyInfo: any;
}

const ProfileView: React.FC<ProfileViewProps> = ({
    personalInfo, skills, experiences, educations, socialLinks,
    projects, languages, certifications, activities, hobbies,
    isRecruiter, companyInfo
}) => {
    const displayAvatar = personalInfo.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.fullName)}&background=1e293b&color=f8fafc&size=200`;

    return (
        <div className="pv-container">
            {/* Cover Section */}
            <div
                className="pv-cover"
                style={{ backgroundImage: personalInfo.coverUrl ? `url(${personalInfo.coverUrl})` : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
            >
                <div className="pv-cover-overlay"></div>
            </div>

            <div className="pv-main-content">
                {/* Left Sidebar - Profile Card */}
                <aside className="pv-sidebar">
                    <div className="pv-profile-card">
                        <div className="pv-avatar-wrapper">
                            <img src={displayAvatar} alt="Avatar" className="pv-avatar" />
                        </div>

                        <h1 className="pv-name">{personalInfo.fullName}</h1>
                        <h2 className="pv-role">{personalInfo.role}</h2>

                        <div className="pv-verification-status">
                            {personalInfo.isVerified ? (
                                <div className="pv-verified-badge-inline" title="Tài khoản đã được xác minh chính chủ">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.52 1.58C11.39 0.77 12.61 0.77 13.48 1.58L15.11 3.06C15.42 3.35 15.86 3.49 16.29 3.44L18.49 3.2C19.68 3.07 20.72 3.93 20.89 5.06L21.2 7.15C21.26 7.57 21.49 7.94 21.84 8.16L23.72 9.38C24.73 10.04 25.02 11.36 24.38 12.44L23.23 14.39C23.01 14.77 22.95 15.22 23.07 15.64L23.63 17.72C23.94 18.84 23.23 19.99 22.06 20.37L20.02 21.04C19.61 21.17 19.26 21.45 19.06 21.82L18.06 23.7C17.48 24.77 16.14 25.13 15.02 24.52L13.11 23.47C12.75 23.27 12.3 23.23 11.91 23.35L9.84 23.98C8.75 24.31 7.55 23.66 7.16 22.56L6.5 20.67C6.38 20.31 6.11 20.01 5.76 19.85L3.89 19.01C2.81 18.52 2.37 17.24 2.89 16.16L3.92 14.07C4.12 13.66 4.14 13.18 3.96 12.77L3.06 10.74C2.58 9.65 3.12 8.35 4.22 7.85L6.15 6.96C6.54 6.78 6.84 6.45 6.98 6.06L7.75 4.1C8.16 3.01 9.42 2.45 10.52 3.05L12.48 4.13Z" fill="#3b82f6" />
                                        <path d="M10 16.5L6 12.5L7.41 11.09L10 13.67L16.59 7.09L18 8.5L10 16.5Z" fill="white" />
                                    </svg>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#3b82f6', marginLeft: '6px' }}>Đã xác thực</span>
                                </div>
                            ) : (
                                <div className="pv-unverified-tag" title="Tài khoản chưa xác thực Email">
                                    <span style={{ fontSize: '12px' }}>Chưa xác thực</span>
                                </div>
                            )}
                        </div>

                        <p className="pv-summary">{personalInfo.summary || 'Chưa có thông tin giới thiệu.'}</p>

                        <div className="pv-contact-list">
                            {personalInfo.email && (
                                <div className="pv-contact-item">
                                    <div className="pv-contact-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    </div>
                                    <span>{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo.phone && (
                                <div className="pv-contact-item">
                                    <div className="pv-contact-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    </div>
                                    <span>{personalInfo.phone}</span>
                                </div>
                            )}
                            {personalInfo.address && (
                                <div className="pv-contact-item">
                                    <div className="pv-contact-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    </div>
                                    <span>{personalInfo.address}</span>
                                </div>
                            )}
                            {personalInfo.dob && (
                                <div className="pv-contact-item">
                                    <div className="pv-contact-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    </div>
                                    <span>{new Date(personalInfo.dob).toLocaleDateString('vi-VN')}</span>
                                </div>
                            )}
                        </div>

                        {(socialLinks.github || socialLinks.linkedin || socialLinks.portfolio) && (
                            <div className="pv-social-links">
                                {socialLinks.github && (
                                    <a href={socialLinks.github} target="_blank" rel="noreferrer" className="pv-social-btn" title="GitHub">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                    </a>
                                )}
                                {socialLinks.linkedin && (
                                    <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="pv-social-btn" title="LinkedIn">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                    </a>
                                )}
                                {socialLinks.portfolio && (
                                    <a href={socialLinks.portfolio} target="_blank" rel="noreferrer" className="pv-social-btn" title="Portfolio">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Skills Section */}
                    {skills && skills.length > 0 && (
                        <div className="pv-sidebar-card">
                            <h3 className="pv-card-title">Kỹ năng</h3>
                            <div className="pv-skills-grid">
                                {skills.map(skill => (
                                    <span key={skill} className="pv-skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages Section */}
                    {languages && languages.length > 0 && (
                        <div className="pv-sidebar-card">
                            <h3 className="pv-card-title">Ngoại ngữ</h3>
                            <div className="pv-languages-list">
                                {languages.map(lang => (
                                    <div key={lang.id} className="pv-lang-item">
                                        <span className="pv-lang-name">{lang.name}</span>
                                        <span className="pv-lang-level">{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hobbies Section */}
                    {hobbies && hobbies.length > 0 && (
                        <div className="pv-sidebar-card">
                            <h3 className="pv-card-title">Sở thích</h3>
                            <div className="pv-hobbies-list">
                                {hobbies.map(hobby => (
                                    <span key={hobby} className="pv-hobby-tag">#{hobby}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Right Main Content */}
                <div className="pv-content-area">
                    {/* Company Info for Recruiters */}
                    {isRecruiter && companyInfo && (
                        <section className="pv-section pv-glass-card">
                            <h2 className="pv-section-header">
                                <span className="pv-section-icon">💼</span> Về Công ty
                            </h2>
                            <div className="pv-company-info">
                                <h3 className="pv-company-name">{companyInfo.companyName}</h3>
                                <div className="pv-company-meta">
                                    {companyInfo.website && <a href={companyInfo.website} target="_blank" rel="noreferrer" className="pv-meta-item">🌐 {companyInfo.website}</a>}
                                    {companyInfo.size && <span className="pv-meta-item">👥 {companyInfo.size} nhân viên</span>}
                                    {companyInfo.address && <span className="pv-meta-item">📍 {companyInfo.address}</span>}
                                </div>
                                {companyInfo.description && (
                                    <p className="pv-company-desc">{companyInfo.description}</p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Experience Section */}
                    {experiences && experiences.length > 0 && (
                        <section className="pv-section">
                            <h2 className="pv-section-header">
                                <span className="pv-section-icon">⭐</span> Kinh nghiệm làm việc
                            </h2>
                            <div className="pv-timeline">
                                {experiences.map(exp => (
                                    <div key={exp.id} className="pv-timeline-item">
                                        <div className="pv-timeline-marker"></div>
                                        <div className="pv-timeline-content pv-glass-card">
                                            <div className="pv-timeline-header">
                                                <h3 className="pv-item-title">{exp.title}</h3>
                                                <span className="pv-item-date">{exp.date}</span>
                                            </div>
                                            <div className="pv-item-subtitle">{exp.company}</div>
                                            {exp.desc && (
                                                <div className="pv-item-desc">
                                                    {exp.desc.split('\n').map((line: string, i: number) => (
                                                        <p key={i}>{line}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects Section */}
                    {projects && projects.length > 0 && (
                        <section className="pv-section">
                            <h2 className="pv-section-header">
                                <span className="pv-section-icon">🚀</span> Dự án nổi bật
                            </h2>
                            <div className="pv-timeline">
                                {projects.map(prj => (
                                    <div key={prj.id} className="pv-timeline-item">
                                        <div className="pv-timeline-marker"></div>
                                        <div className="pv-timeline-content pv-glass-card">
                                            <div className="pv-timeline-header">
                                                <h3 className="pv-item-title">{prj.name}</h3>
                                                <span className="pv-item-date">{prj.date}</span>
                                            </div>
                                            <div className="pv-item-subtitle">{prj.role}</div>
                                            {prj.technologies && (
                                                <div className="pv-tech-stack">
                                                    {prj.technologies.split(',').map((tech: string, i: number) => (
                                                        <span key={i} className="pv-tech-tag">{tech.trim()}</span>
                                                    ))}
                                                </div>
                                            )}
                                            {prj.desc && (
                                                <div className="pv-item-desc">
                                                    {prj.desc.split('\n').map((line: string, i: number) => (
                                                        <p key={i}>{line}</p>
                                                    ))}
                                                </div>
                                            )}
                                            {prj.link && (
                                                <a href={prj.link} target="_blank" rel="noreferrer" className="pv-project-link">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                                    Xem chi tiết
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education Section */}
                    {educations && educations.length > 0 && (
                        <section className="pv-section">
                            <h2 className="pv-section-header">
                                <span className="pv-section-icon">🎓</span> Học vấn
                            </h2>
                            <div className="pv-timeline">
                                {educations.map(edu => (
                                    <div key={edu.id} className="pv-timeline-item">
                                        <div className="pv-timeline-marker"></div>
                                        <div className="pv-timeline-content pv-glass-card">
                                            <div className="pv-timeline-header">
                                                <h3 className="pv-item-title">{edu.title}</h3>
                                                <span className="pv-item-date">{edu.date}</span>
                                            </div>
                                            <div className="pv-item-subtitle">{edu.school}</div>
                                            {edu.desc && (
                                                <div className="pv-item-desc">
                                                    {edu.desc.split('\n').map((line: string, i: number) => (
                                                        <p key={i}>{line}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications Section */}
                    {certifications && certifications.length > 0 && (
                        <section className="pv-section">
                            <h2 className="pv-section-header">
                                <span className="pv-section-icon">🏆</span> Chứng chỉ & Giải thưởng
                            </h2>
                            <div className="pv-grid-cards">
                                {certifications.map(cert => (
                                    <div key={cert.id} className="pv-cert-card pv-glass-card">
                                        <div className="pv-cert-icon">🏅</div>
                                        <div className="pv-cert-info">
                                            <h4 className="pv-cert-name">{cert.name}</h4>
                                            <div className="pv-cert-org">{cert.organization}</div>
                                            <div className="pv-cert-date">{cert.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Activities Section */}
                    {activities && activities.length > 0 && (
                        <section className="pv-section">
                            <h2 className="pv-section-header">
                                <span className="pv-section-icon">🤝</span> Hoạt động
                            </h2>
                            <div className="pv-timeline">
                                {activities.map(act => (
                                    <div key={act.id} className="pv-timeline-item">
                                        <div className="pv-timeline-marker"></div>
                                        <div className="pv-timeline-content pv-glass-card">
                                            <div className="pv-timeline-header">
                                                <h3 className="pv-item-title">{act.name}</h3>
                                                <span className="pv-item-date">{act.date}</span>
                                            </div>
                                            <div className="pv-item-subtitle">{act.role}</div>
                                            {act.desc && (
                                                <div className="pv-item-desc">
                                                    {act.desc.split('\n').map((line: string, i: number) => (
                                                        <p key={i}>{line}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ProfileView;
