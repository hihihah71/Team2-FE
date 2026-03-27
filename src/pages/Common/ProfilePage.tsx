import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../contexts/AuthContext'
import ProfileView from '../../components/Profile/ProfileView'
import VerificationModal from '../../components/auth/VerificationModal'
import './ProfilePage.css'
import '../PageUI.css'
import { DEFAULT_COMPANY_INFO, DEFAULT_PERSONAL_INFO } from '../../constants/profileDefaults'
import { getMyProfile, saveMyProfile, type ProfilePayload } from '../../features/profile/profileService'

const ProfilePage = () => {
  const { user, setUser } = useAuth()
  const location = useLocation()
  const isRecruiter = location.pathname.startsWith('/recruiter')

  const [activeTab, setActiveTab] = useState<'personal' | 'company'>('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [skills, setSkills] = useState(['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Node.js', 'UI/UX Design'])
  const [newSkill, setNewSkill] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [toastClosing, setToastClosing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)

  // 1) Tạo các State chứa dữ liệu Form (giá trị mặc định rỗng, dữ liệu thực tế lấy từ API)
  const [personalInfo, setPersonalInfo] = useState(DEFAULT_PERSONAL_INFO)
  const [companyInfo, setCompanyInfo] = useState(DEFAULT_COMPANY_INFO)

  const [experiences, setExperiences] = useState<any[]>([])
  const [educations, setEducations] = useState<any[]>([])
  const [socialLinks, setSocialLinks] = useState<{ github: string; linkedin: string; portfolio: string }>({
    github: '',
    linkedin: '',
    portfolio: '',
  })
  const [projects, setProjects] = useState<any[]>([])
  const [languages, setLanguages] = useState<any[]>([])
  const [certifications, setCertifications] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])

  const [hobbies, setHobbies] = useState<string[]>([])
  const [newHobby, setNewHobby] = useState('')

  // 2) Load data từ API khi khởi tạo (F5 không mất)
  useEffect(() => {
    document.title = 'Thông tin cá nhân | JS CV'
    getMyProfile()
      .then((data) => {
        if (!data) return
        if (data.personalInfo) {
          setPersonalInfo((prev) => ({ ...prev, ...data.personalInfo }))
        }
        if (data.companyInfo) {
          setCompanyInfo((prev) => ({ ...prev, ...data.companyInfo }))
        }
        if (data.skills) setSkills(data.skills)
        if (data.experiences) setExperiences(data.experiences)
        if (data.educations) setEducations(data.educations)
        if (data.socialLinks) {
          setSocialLinks((prev) => ({
            ...prev,
            ...data.socialLinks,
          }))
        }
        if (data.projects) setProjects(data.projects)
        if (data.languages) setLanguages(data.languages)
        if (data.certifications) setCertifications(data.certifications)
        if (data.activities) setActivities(data.activities)
        if (data.hobbies) setHobbies(data.hobbies)
      })
      .catch((error) => {
        console.error('Không thể tải hồ sơ từ API:', error)
      })
  }, [])

  const showToast = (msg: string) => {
    setToastClosing(false)
    setToastMessage(msg)
    setTimeout(() => {
      setToastClosing(true)
      setTimeout(() => {
        setToastMessage('')
        setToastClosing(false)
      }, 300)
    }, 2700)
  }

  // File Upload Handlers (Avatar/Cover)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (e.g., 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Dung lượng ảnh không được vượt quá 2MB.')
        return
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('Chỉ hỗ trợ định dạng ảnh JPEG, PNG hoặc WebP.')
        return
      }

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
        setPersonalInfo(prev => ({ ...prev, [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: compressedBase64 }))
        showToast(`Đã tải ảnh ${type === 'avatar' ? 'đại diện' : 'bìa'} lên thành công! Bấm Lưu để lưu lại.`)
      } catch (error) {
        console.error('Lỗi khi nén ảnh:', error);
        alert('Có lỗi xảy ra khi xử lý ảnh, vui lòng thử lại ảnh khác!');
      }
    }
  }

  const triggerFileInput = (id: string) => {
    document.getElementById(id)?.click()
  }

  const handleVerifyEmail = () => {
    setIsVerificationModalOpen(true)
  }

  // Personal Form Handlers
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPersonalInfo(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handlePersonalBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^(0|84)(3|5|7|8|9)([0-9]{8})$/
    setErrors(prev => {
      const next = { ...prev }
      if (name === 'fullName') {
        if (!value.trim()) next.fullName = 'Họ tên không được để trống.'
        else delete next.fullName
      }
      if (name === 'email') {
        if (value && !emailRegex.test(value)) next.email = 'Địa chỉ Email không đúng định dạng.'
        else delete next.email
      }
      if (name === 'phone') {
        if (value && !phoneRegex.test(value)) next.phone = 'Số điện thoại không đúng định dạng.'
        else delete next.phone
      }
      return next
    })
  }

  // Company Form Handlers
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCompanyInfo(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Update Experience item text instantly
  const handleExperienceChange = (id: number, field: string, value: string) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp))
  }

  // Update Education item text instantly
  const handleEducationChange = (id: number, field: string, value: string) => {
    setEducations(educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleAddExperience = () => {
    const newId = experiences.length > 0 ? Math.max(...experiences.map(e => e.id)) + 1 : 1
    const newExp = {
      id: newId,
      title: '',
      company: '',
      date: '',
      desc: ''
    }
    setExperiences([...experiences, newExp])
    showToast('Đã thêm 1 mục kinh nghiệm làm việc!')
  }

  const handleRemoveExperience = (id: number) => {
    setExperiences(experiences.filter(e => e.id !== id))
    showToast('Đã xóa 1 mục kinh nghiệm.')
  }

  const handleAddEducation = () => {
    const newId = educations.length > 0 ? Math.max(...educations.map(e => e.id)) + 1 : 1
    const newEdu = {
      id: newId,
      title: '',
      school: '',
      date: '',
      desc: ''
    }
    setEducations([...educations, newEdu])
    showToast('Đã thêm 1 mục học vấn!')
  }

  const handleRemoveEducation = (id: number) => {
    setEducations(educations.filter(e => e.id !== id))
    showToast('Đã xóa 1 mục học vấn.')
  }

  // Social Handlers
  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialLinks(prev => ({ ...prev, [name]: value }))
  }

  // Projects Handlers
  const handleProjectChange = (id: number, field: string, value: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p))
  }
  const handleAddProject = () => {
    const newId = projects.length > 0 ? Math.max(...projects.map(e => e.id)) + 1 : 1
    const newPrj = { id: newId, name: '', date: '', role: '', technologies: '', desc: '', link: '' }
    setProjects([...projects, newPrj])
    showToast('Đã thêm 1 mục dự án!')
  }
  const handleRemoveProject = (id: number) => {
    setProjects(projects.filter(e => e.id !== id))
    showToast('Đã xóa 1 mục dự án.')
  }

  // Languages Handlers
  const handleLanguageChange = (id: number, field: string, value: string) => {
    setLanguages(languages.map(l => l.id === id ? { ...l, [field]: value } : l))
  }
  const handleAddLanguage = () => {
    const newId = languages.length > 0 ? Math.max(...languages.map(e => e.id)) + 1 : 1
    const newLang = { id: newId, name: '', level: '' }
    setLanguages([...languages, newLang])
    showToast('Đã thêm 1 mục ngoại ngữ!')
  }
  const handleRemoveLanguage = (id: number) => {
    setLanguages(languages.filter(e => e.id !== id))
    showToast('Đã xóa 1 mục ngoại ngữ.')
  }

  // Certifications Handlers
  const handleCertChange = (id: number, field: string, value: string) => {
    setCertifications(certifications.map(c => c.id === id ? { ...c, [field]: value } : c))
  }
  const handleAddCert = () => {
    const newId = certifications.length > 0 ? Math.max(...certifications.map(e => e.id)) + 1 : 1
    const newCert = { id: newId, name: '', organization: '', date: '' }
    setCertifications([...certifications, newCert])
    showToast('Đã thêm 1 mục chứng chỉ!')
  }
  const handleRemoveCert = (id: number) => {
    setCertifications(certifications.filter(e => e.id !== id))
    showToast('Đã xóa 1 mục chứng chỉ.')
  }

  // Activities Handlers
  const handleActivityChange = (id: number, field: string, value: string) => {
    setActivities(activities.map(a => a.id === id ? { ...a, [field]: value } : a))
  }
  const handleAddActivity = () => {
    const newId = activities.length > 0 ? Math.max(...activities.map(e => e.id)) + 1 : 1
    const newAct = { id: newId, name: '', role: '', date: '', desc: '' }
    setActivities([...activities, newAct])
    showToast('Đã thêm 1 mục hoạt động!')
  }
  const handleRemoveActivity = (id: number) => {
    setActivities(activities.filter(e => e.id !== id))
    showToast('Đã xóa 1 mục hoạt động.')
  }

  // Hobbies Handlers
  const handleAddHobby = () => {
    if (newHobby.trim() && !hobbies.includes(newHobby.trim())) {
      setHobbies([...hobbies, newHobby.trim()])
      setNewHobby('')
    }
  }

  const handleRemoveHobby = (hobbyToRemove: string) => {
    setHobbies(hobbies.filter(hobby => hobby !== hobbyToRemove))
  }

  const handleResetPersonal = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại dữ liệu hồ sơ theo dữ liệu từ server?')) {
      getMyProfile()
        .then((data) => {
          if (!data) return
          if (data.personalInfo) {
            setPersonalInfo((prev) => ({ ...prev, ...data.personalInfo }))
          } else {
            setPersonalInfo(DEFAULT_PERSONAL_INFO)
          }
          if (data.companyInfo) {
            setCompanyInfo((prev) => ({ ...prev, ...data.companyInfo }))
          } else {
            setCompanyInfo(DEFAULT_COMPANY_INFO)
          }
          setSkills(data.skills ?? [])
          setExperiences(data.experiences ?? [])
          setEducations(data.educations ?? [])
          if (data.socialLinks) {
            setSocialLinks((prev) => ({
              ...prev,
              ...data.socialLinks,
            }))
          } else {
            setSocialLinks({
              github: '',
              linkedin: '',
              portfolio: '',
            })
          }
          setProjects(data.projects ?? [])
          setLanguages(data.languages ?? [])
          setCertifications(data.certifications ?? [])
          setActivities(data.activities ?? [])
          setHobbies(data.hobbies ?? [])
          showToast('Đã khôi phục hồ sơ theo dữ liệu mới nhất từ server.')
        })
        .catch((error) => {
          console.error('Không thể khôi phục hồ sơ từ API:', error)
          alert('Không thể tải lại dữ liệu từ server. Vui lòng thử lại sau.')
        })
    }
  }

  const handleSavePersonal = async () => {
  const newErrors: Record<string, string> = {}
  
  // 1) Validate Name (Bắt buộc cho cả 2)
  if (!personalInfo.fullName?.trim()) {
    newErrors.fullName = 'Họ tên không được để trống.'
  }

  // 2) Chỉ validate Company Name nếu ĐANG ở tab công ty hoặc là Recruiter thực thụ
  // Nếu bạn muốn linh hoạt, có thể bỏ bớt ràng buộc gắt gao này khi demo
  if (isRecruiter && activeTab === 'company' && !companyInfo.companyName?.trim()) {
    newErrors.companyName = 'Vui lòng nhập tên công ty.'
  }

  // ... (giữ nguyên phần validate Phone/Email)

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    showToast('Vui lòng kiểm tra lại các trường đỏ!')
    return
  }

  try {
    // Quan trọng: Đảm bảo payload gửi đi đúng cấu trúc Backend mong đợi
    const payload: ProfilePayload = {
      personalInfo,
      companyInfo,
      skills,
      experiences,
      educations,
      socialLinks,
      projects,
      languages,
      certifications,
      activities,
      hobbies,
    }

    await saveMyProfile(payload)
    showToast('Lưu thông tin thành công!')
    
    // Cập nhật lại user context để UI đồng bộ ngay lập tức
    if (setUser && user) {
      setUser({ ...user, fullName: personalInfo.fullName })
    }
    
    setIsEditing(false) 
  } catch (error) {
    console.error('Lưu thất bại:', error)
    showToast('Lỗi server, không thể lưu!')
  }
}

  const handleCancelCompany = () => showToast('Đã hủy các thay đổi ở hồ sơ công ty.')

  const handleUpdateCompany = () => {
    // Dùng chung API lưu hồ sơ tổng thể
    handleSavePersonal()
  }

  const displayAvatar = personalInfo.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.fullName)}&background=1e293b&color=f8fafc&size=140`

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <div className="profile-container">
          {/* Nút Toggle Edit/View */}
          <div className="profile-toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button
              type="button"
              className={isEditing ? "profile-btn profile-btn-secondary" : "profile-btn profile-btn-primary"}
              onClick={() => setIsEditing(!isEditing)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isEditing ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>
                  Xem Profile Public
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  Chỉnh sửa hồ sơ
                </>
              )}
            </button>
          </div>

          {!isEditing ? (
            <ProfileView
              personalInfo={personalInfo}
              skills={skills}
              experiences={experiences}
              educations={educations}
              socialLinks={socialLinks}
              projects={projects}
              languages={languages}
              certifications={certifications}
              activities={activities}
              hobbies={hobbies}
              isRecruiter={isRecruiter}
              companyInfo={companyInfo}
            />
          ) : (
            <>
              {/* Cover & Header Section */}
              <div className="profile-header-section">
                <div className="profile-cover" style={{ backgroundImage: personalInfo.coverUrl ? `url(${personalInfo.coverUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <input type="file" id="coverUpload" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                  <button type="button" className="profile-cover-action" onClick={() => triggerFileInput('coverUpload')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
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
                      <span>Đổi avatar</span>
                    </div>
                  </div>

                  <div className="profile-user-summary">
                    <h1 className="profile-user-name">{personalInfo.fullName}</h1>
                    <p className="profile-user-role">{personalInfo.role}</p>
                    <Link
                      to={isRecruiter ? ROUTES.RECRUITER_DASHBOARD : ROUTES.STUDENT_DASHBOARD}
                      className="profile-back-link"
                    >
                      ← Về trang Tổng quan
                    </Link>
                  </div>
                </div>
              </div>

              {/* Main Content (Sidebar + Forms) */}
              <div className="profile-content">
                <div className="profile-sidebar">
                  <button
                    type="button"
                    className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Thông tin hồ sơ
                  </button>

                  {isRecruiter && (
                    <button
                      type="button"
                      className={`profile-tab ${activeTab === 'company' ? 'active' : ''}`}
                      onClick={() => setActiveTab('company')}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                      Thông tin công ty
                    </button>
                  )}
                </div>

                <div className="profile-main-area">
                  {activeTab === 'personal' && (
                    <>
                      {/* Thông tin cơ bản */}
                      <div className="profile-section-fade">
                        <h2 className="profile-section-title">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          Thông tin cơ bản
                        </h2>
                        <p className="profile-section-desc">Cập nhật thông tin cá nhân của bạn để hiển thị rõ ràng trên CV ứng tuyển.</p>

                        <div className="profile-form-grid">
                          <div className="profile-form-group">
                            <label className="profile-label">ID Tài khoản <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal', marginLeft: '4px' }}>(Cấp mặc định)</span></label>
                            <input type="text" className="profile-input" value={personalInfo.id} readOnly style={{ backgroundColor: 'rgba(255,255,255,0.02)', color: '#94a3b8', cursor: 'not-allowed' }} title="ID không thể thay đổi" />
                          </div>

                          <div className="profile-form-group">
                            <label className="profile-label">Họ và tên</label>
                            <input 
                              type="text" 
                              name="fullName" 
                              className={`profile-input ${errors.fullName ? 'profile-input-error' : ''}`} 
                              value={personalInfo.fullName} 
                              onChange={handlePersonalChange}
                              onBlur={handlePersonalBlur}
                              placeholder="Nhập họ tên của bạn..." 
                              maxLength={50}
                              style={errors.fullName ? { borderColor: '#ef4444' } : {}}
                            />
                            {errors.fullName && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.fullName}</span>}
                          </div>

                          <div className="profile-form-group">
                            <label className="profile-label">Vị trí ứng tuyển / Chuyên môn</label>
                            <input type="text" name="role" className="profile-input" value={personalInfo.role} onChange={handlePersonalChange} placeholder="Ví dụ: Backend Developer..." maxLength={100} />
                          </div>

                          <div className="profile-form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label className="profile-label">Trạng thái xác thực</label>
                            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                              {personalInfo.isVerified ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 500, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: '6px', width: '100%', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                  Đã xác thực
                                </div>
                              ) : (
                                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 500, backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px', flex: 1, fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
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
                            <input type="date" name="dob" className="profile-input" value={personalInfo.dob} onChange={handlePersonalChange} />
                          </div>

                          <div className="profile-form-group">
                            <label className="profile-label">Số điện thoại</label>
                            <input 
                              type="text" 
                              name="phone" 
                              className={`profile-input ${errors.phone ? 'profile-input-error' : ''}`} 
                              value={personalInfo.phone} 
                              onChange={handlePersonalChange}
                              onBlur={handlePersonalBlur}
                              placeholder="Nhập số điện thoại..." 
                              maxLength={15}
                              style={errors.phone ? { borderColor: '#ef4444' } : {}}
                            />
                            {errors.phone && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</span>}
                          </div>

                          <div className="profile-form-group full-width">
                            <label className="profile-label">Địa chỉ Email</label>
                            <input 
                              type="text" 
                              name="email" 
                              className={`profile-input ${errors.email ? 'profile-input-error' : ''}`} 
                              value={personalInfo.email} 
                              onChange={handlePersonalChange}
                              onBlur={handlePersonalBlur}
                              placeholder="Email liên hệ..." 
                              maxLength={100}
                              style={errors.email ? { borderColor: '#ef4444' } : {}}
                            />
                            {errors.email && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</span>}
                          </div>

                          <div className="profile-form-group full-width">
                            <label className="profile-label">Nơi ở hiện tại / Địa chỉ</label>
                            <input type="text" name="address" className="profile-input" value={personalInfo.address} onChange={handlePersonalChange} placeholder="Nhập địa chỉ..." maxLength={200} />
                          </div>

                          <div className="profile-form-group full-width">
                            <label className="profile-label">Giới thiệu ngắn về bản thân (Summary)</label>
                            <textarea name="summary" className="profile-input profile-textarea" placeholder="Viết vài dòng giới thiệu sự nghiệp..." value={personalInfo.summary} onChange={handlePersonalChange} maxLength={2000}></textarea>
                          </div>
                        </div>
                      </div>

                      {/* Các khối CV chi tiết chỉ dùng cho student */}
                      {!isRecruiter && (
                        <>
                          {/* Liên kết mạng xã hội */}
                          <div className="profile-section-fade">
                            <h2 className="profile-section-title">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                              Liên kết mạng xã hội / Portfolio
                            </h2>
                            <p className="profile-section-desc">Cung cấp các liên kết để nhà tuyển dụng xem thêm về dự án, mã nguồn và hồ sơ trực tuyến của bạn.</p>
                            <div className="profile-form-grid">
                              <div className="profile-form-group">
                                <label className="profile-label">GitHub</label>
                                <input type="url" name="github" className="profile-input" value={socialLinks.github} onChange={handleSocialChange} placeholder="https://github.com/..." />
                              </div>
                              <div className="profile-form-group">
                                <label className="profile-label">LinkedIn</label>
                                <input type="url" name="linkedin" className="profile-input" value={socialLinks.linkedin} onChange={handleSocialChange} placeholder="https://linkedin.com/in/..." />
                              </div>
                              <div className="profile-form-group full-width">
                                <label className="profile-label">Website rêng / Portfolio (Nếu có)</label>
                                <input type="url" name="portfolio" className="profile-input" value={socialLinks.portfolio} onChange={handleSocialChange} placeholder="https://..." />
                              </div>
                            </div>
                          </div>

                          {/* Kỹ năng */}
                          <div className="profile-section-fade">
                            <h2 className="profile-section-title">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                              Kỹ năng chuyên môn
                            </h2>
                            <p className="profile-section-desc">Thêm các kỹ năng bạn có để nhà tuyển dụng dễ dàng đánh giá sự phù hợp.</p>

                            <div className="profile-form-group full-width">
                              <div className="profile-skill-input-wrapper">
                                <input
                                  type="text"
                                  className="profile-input"
                                  placeholder="Thêm kỹ năng mới (ví dụ: JavaScript, Figma...)"
                                  value={newSkill}
                                  onChange={(e) => setNewSkill(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                                />
                                <button type="button" className="profile-btn profile-btn-primary" onClick={handleAddSkill}>Thêm</button>
                              </div>
                              <div className="profile-skills-wrapper">
                                {skills.map((skill) => (
                                  <div className="profile-skill-tag" key={skill}>
                                    {skill}
                                    <span className="profile-skill-remove" onClick={() => handleRemoveSkill(skill)}>
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Kinh nghiệm làm việc */}
                          <div className="profile-section-fade">
                            <h2 className="profile-section-title">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                              Kinh nghiệm làm việc
                            </h2>
                            <p className="profile-section-desc">Kể tên những công ty hoặc dự án nổi bật mà bạn từng tham gia.</p>

                            <div className="profile-timeline-list">
                              {experiences.map(exp => (
                                <div className="profile-timeline-item" key={exp.id}>
                                  <div className="profile-timeline-dot"></div>
                                  <div className="profile-timeline-header">
                                    <div style={{ flex: 1, marginRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      <input
                                        type="text"
                                        className="profile-input"
                                        style={{ padding: '6px 12px', fontSize: '16px', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.02)' }}
                                        value={exp.title}
                                        placeholder="Tên vị trí (VD: Frontend Engineer)"
                                        onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                                      />
                                      <input
                                        type="text"
                                        className="profile-input"
                                        style={{ padding: '6px 12px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.02)' }}
                                        value={exp.company}
                                        placeholder="Tên công ty"
                                        onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                      />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                      <input
                                        type="text"
                                        className="profile-input"
                                        style={{ padding: '6px 12px', width: '130px', backgroundColor: 'rgba(255,255,255,0.02)' }}
                                        value={exp.date}
                                        placeholder="Thời gian..."
                                        onChange={(e) => handleExperienceChange(exp.id, 'date', e.target.value)}
                                      />
                                      <button
                                        type="button"
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', display: 'flex' }}
                                        onClick={() => handleRemoveExperience(exp.id)}
                                        title="Xóa"
                                      >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="profile-timeline-desc">
                                    <textarea
                                      className="profile-input profile-textarea"
                                      style={{ minHeight: '80px', marginTop: '8px', backgroundColor: 'rgba(255,255,255,0.02)' }}
                                      value={exp.desc}
                                      placeholder="Mô tả công việc của bạn..."
                                      onChange={(e) => handleExperienceChange(exp.id, 'desc', e.target.value)}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button type="button" className="profile-timeline-add" onClick={handleAddExperience}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                              Thêm kinh nghiệm
                            </button>
                          </div>

                          {/* Dự án cá nhân */}
                          <div className="profile-section-fade">
                            <h2 className="profile-section-title">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                              Dự án nổi bật
                            </h2>
                            <p className="profile-section-desc">Các dự án cá nhân hoặc open source mà bạn đã thực hiện.</p>
                            <div className="profile-timeline-list">
                              {projects.map(prj => (
                                <div className="profile-timeline-item" key={prj.id}>
                                  <div className="profile-timeline-dot"></div>
                                  <div className="profile-timeline-header">
                                    <div style={{ flex: 1, marginRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      <input type="text" className="profile-input" style={{ padding: '6px 12px', fontSize: '16px', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.02)' }} value={prj.name} placeholder="Tên dự án (VD: E-commerce Website)" onChange={(e) => handleProjectChange(prj.id, 'name', e.target.value)} maxLength={100} />
                                      <input type="text" className="profile-input" style={{ padding: '6px 12px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.02)' }} value={prj.role} placeholder="Vai trò của bạn (VD: Fullstack Developer)" onChange={(e) => handleProjectChange(prj.id, 'role', e.target.value)} maxLength={100} />
                                      <input type="text" className="profile-input" style={{ padding: '6px 12px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.02)' }} value={prj.technologies} placeholder="Công nghệ sử dụng (VD: React, Node.js)" onChange={(e) => handleProjectChange(prj.id, 'technologies', e.target.value)} maxLength={200} />
                                      <input type="url" className="profile-input" style={{ padding: '6px 12px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.02)' }} value={prj.link} placeholder="Link demo hoặc Source Code" onChange={(e) => handleProjectChange(prj.id, 'link', e.target.value)} maxLength={500} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, alignSelf: 'flex-start' }}>
                                      <input type="text" className="profile-input" style={{ padding: '6px 12px', width: '130px', backgroundColor: 'rgba(255,255,255,0.02)' }} value={prj.date} placeholder="Thời gian..." onChange={(e) => handleProjectChange(prj.id, 'date', e.target.value)} maxLength={50} />
                                      <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', display: 'flex' }} onClick={() => handleRemoveProject(prj.id)} title="Xóa"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                    </div>
                                  </div>
                                  <div className="profile-timeline-desc">
                                    <textarea className="profile-input profile-textarea" style={{ minHeight: '80px', marginTop: '8px', backgroundColor: 'rgba(255,255,255,0.02)' }} value={prj.desc} placeholder="Mô tả chi tiết dự án và đóng góp của bạn..." onChange={(e) => handleProjectChange(prj.id, 'desc', e.target.value)} />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button type="button" className="profile-timeline-add" onClick={handleAddProject}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Thêm dự án</button>
                          </div>

                          {/* Học vấn */}
                          <div className="profile-section-fade">
                            <h2 className="profile-section-title">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                              Học vấn
                            </h2>
                            <p className="profile-section-desc">Bạn đã học ở đâu, chuyên ngành cơ bản của bạn là gì?</p>

                            <div className="profile-timeline-list">
                              {educations.map(edu => (
                                <div className="profile-timeline-item" key={edu.id}>
                                  <div className="profile-timeline-dot"></div>
                                  <div className="profile-timeline-header">
                                    <div style={{ flex: 1, marginRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      <input
                                        type="text"
                                        className="profile-input"
                                        style={{ padding: '6px 12px', fontSize: '16px', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.02)' }}
                                        value={edu.title}
                                        placeholder="Bằng cấp / Trình độ"
                                        onChange={(e) => handleEducationChange(edu.id, 'title', e.target.value)}
                                        maxLength={100}
                                      />
                                      <input
                                        type="text"
                                        className="profile-input"
                                        style={{ padding: '6px 12px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.02)' }}
                                        value={edu.school}
                                        placeholder="Tên trường / Cơ sở"
                                        onChange={(e) => handleEducationChange(edu.id, 'school', e.target.value)}
                                        maxLength={100}
                                      />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                      <input
                                        type="text"
                                        className="profile-input"
                                        style={{ padding: '6px 12px', width: '130px', backgroundColor: 'rgba(255,255,255,0.02)' }}
                                        value={edu.date}
                                        placeholder="Thời gian..."
                                        onChange={(e) => handleEducationChange(edu.id, 'date', e.target.value)}
                                        maxLength={50}
                                      />
                                      <button
                                        type="button"
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', display: 'flex' }}
                                        onClick={() => handleRemoveEducation(edu.id)}
                                        title="Xóa"
                                      >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="profile-timeline-desc">
                                    <textarea
                                      className="profile-input profile-textarea"
                                      style={{ minHeight: '80px', marginTop: '8px', backgroundColor: 'rgba(255,255,255,0.02)' }}
                                      value={edu.desc}
                                      placeholder="Mô tả quá trình học tập..."
                                      onChange={(e) => handleEducationChange(edu.id, 'desc', e.target.value)}
                                      maxLength={1000}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button type="button" className="profile-timeline-add" onClick={handleAddEducation}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                              Thêm học vấn
                            </button>
                          </div>

                          {/* Ngoại ngữ */}
                          <div className="profile-section-fade">
                            <h2 className="profile-section-title">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                              Ngoại ngữ
                            </h2>
                            <p className="profile-section-desc">Các ngôn ngữ bạn có thể sử dụng (Tiếng Anh, Tiếng Nhật...).</p>
                            <div className="profile-timeline-list">
                              {languages.map(lang => (
                                <div className="profile-timeline-item" key={lang.id}>
                                  <div className="profile-timeline-dot"></div>
                                  <div className="profile-timeline-header">
                                    <div style={{ flex: 1, marginRight: '16px', display: 'flex', gap: '8px' }}>
                                      <input type="text" className="profile-input" style={{ padding: '6px 12px', fontSize: '15px', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.02)', flex: 1 }} value={lang.name} placeholder="Ngôn ngữ (VD: Tiếng Anh)" onChange={(e) => handleLanguageChange(lang.id, 'name', e.target.value)} maxLength={50} />
                                      <input type="text" className="profile-input" style={{ padding: '6px 12px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.02)', flex: 1 }} value={lang.level} placeholder="Trình độ (VD: IELTS 7.0, Giao tiếp tốt)" onChange={(e) => handleLanguageChange(lang.id, 'level', e.target.value)} maxLength={50} />
                                    </div>
                                    <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', display: 'flex' }} onClick={() => handleRemoveLanguage(lang.id)} title="Xóa"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button type="button" className="profile-timeline-add" onClick={handleAddLanguage}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Thêm ngoại ngữ</button>
                          </div>

                          {/* Chứng chỉ & Giải thưởng */}
                          <div className="profile-section-fade">
                            <h2 className="profile-section-title">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                              Chứng chỉ & Giải thưởng
                            </h2>
                            <div className="profile-timeline-list">
                              {certifications.map(cert => (
                                <div className="profile-timeline-item" key={cert.id}>
                                  <div className="profile-timeline-dot"></div>
                                  <div className="profile-timeline-header">
                                    <div style={{ flex: 1, marginRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      <input type="text" className="profile-input" style={{ padding: '6px 12px', fontSize: '15px', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.02)' }} value={cert.name} placeholder="Tên chứng chỉ / giải thưởng" onChange={(e) => handleCertChange(cert.id, 'name', e.target.value)} maxLength={150} />
                                      <input type="text" className="profile-input" style={{ padding: '6px 12px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.02)' }} value={cert.organization} placeholder="Tổ chức cấp" onChange={(e) => handleCertChange(cert.id, 'organization', e.target.value)} maxLength={150} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, alignSelf: 'flex-start' }}>
                                      <input type="text" className="profile-input" style={{ padding: '6px 12px', width: '130px', backgroundColor: 'rgba(255,255,255,0.02)' }} value={cert.date} placeholder="Thời gian (VD: 08/2023)" onChange={(e) => handleCertChange(cert.id, 'date', e.target.value)} maxLength={50} />
                                      <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', display: 'flex' }} onClick={() => handleRemoveCert(cert.id)} title="Xóa"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button type="button" className="profile-timeline-add" onClick={handleAddCert}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Thêm chứng chỉ</button>
                          </div>

                          {/* Hoạt động ngoại khóa */}
                          <div className="profile-section-fade">
                            <h2 className="profile-section-title">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                              Hoạt động
                            </h2>
                            <div className="profile-timeline-list">
                              {activities.map(act => (
                                <div className="profile-timeline-item" key={act.id}>
                                  <div className="profile-timeline-dot"></div>
                                  <div className="profile-timeline-header">
                                    <div style={{ flex: 1, marginRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      <input type="text" className="profile-input" style={{ padding: '6px 12px', fontSize: '15px', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.02)' }} value={act.name} placeholder="Tên câu lạc bộ / Hoạt động" onChange={(e) => handleActivityChange(act.id, 'name', e.target.value)} maxLength={150} />
                                      <input type="text" className="profile-input" style={{ padding: '6px 12px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.02)' }} value={act.role} placeholder="Vai trò" onChange={(e) => handleActivityChange(act.id, 'role', e.target.value)} maxLength={100} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, alignSelf: 'flex-start' }}>
                                      <input type="text" className="profile-input" style={{ padding: '6px 12px', width: '130px', backgroundColor: 'rgba(255,255,255,0.02)' }} value={act.date} placeholder="Thời gian..." onChange={(e) => handleActivityChange(act.id, 'date', e.target.value)} maxLength={50} />
                                      <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', display: 'flex' }} onClick={() => handleRemoveActivity(act.id)} title="Xóa"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                    </div>
                                  </div>
                                  <div className="profile-timeline-desc">
                                    <textarea className="profile-input profile-textarea" style={{ minHeight: '60px', marginTop: '8px', backgroundColor: 'rgba(255,255,255,0.02)' }} value={act.desc} placeholder="Mô tả các hoạt động của bạn..." onChange={(e) => handleActivityChange(act.id, 'desc', e.target.value)} maxLength={1000} />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button type="button" className="profile-timeline-add" onClick={handleAddActivity}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Thêm hoạt động</button>
                          </div>

                          {/* Sở thích */}
                          <div className="profile-section-fade">
                            <h2 className="profile-section-title">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                              Sở thích / Mối quan tâm
                            </h2>
                            <div className="profile-form-group full-width">
                              <div className="profile-skill-input-wrapper">
                                <input type="text" className="profile-input" placeholder="Thêm sở thích (VD: Chạy bộ, Esports...)" value={newHobby} onChange={(e) => setNewHobby(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddHobby()} maxLength={50} />
                                <button type="button" className="profile-btn profile-btn-primary" onClick={handleAddHobby}>Thêm</button>
                              </div>
                              <div className="profile-skills-wrapper">
                                {hobbies.map((hobby) => (
                                  <div className="profile-skill-tag" style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }} key={hobby}>
                                    {hobby}
                                    <span className="profile-skill-remove" onClick={() => handleRemoveHobby(hobby)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Nút lưu */}
                      <div className="profile-form-actions">
                        <button type="button" className="profile-btn profile-btn-secondary" onClick={handleResetPersonal}>Khôi phục mặc định</button>
                        <button type="button" className="profile-btn profile-btn-primary" onClick={handleSavePersonal}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                          Lưu thay đổi CV
                        </button>
                      </div>
                    </>
                  )}

                  {isRecruiter && activeTab === 'company' && (
                    <div className="profile-section-fade">
                      <h2 className="profile-section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                        Hồ sơ công ty
                      </h2>
                      <p className="profile-section-desc">Cập nhật thông tin công ty để giúp ứng viên hiểu rõ hơn về tổ chức của bạn.</p>

                      <div className="profile-form-grid">
                        <div className="profile-form-group full-width">
                          <label className="profile-label">Tên công ty</label>
                          <input 
                            type="text" 
                            name="companyName" 
                            className={`profile-input ${errors.companyName ? 'profile-input-error' : ''}`} 
                            value={companyInfo.companyName} 
                            onChange={handleCompanyChange} 
                            placeholder="Tên công ty..." 
                            maxLength={100}
                            style={errors.companyName ? { borderColor: '#ef4444' } : {}}
                          />
                          {errors.companyName && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.companyName}</span>}
                        </div>

                        <div className="profile-form-group">
                          <label className="profile-label">Website</label>
                          <input type="url" name="website" className="profile-input" value={companyInfo.website} onChange={handleCompanyChange} placeholder="https://..." maxLength={200} />
                        </div>

                        <div className="profile-form-group">
                          <label className="profile-label">Quy mô nhân sự</label>
                          <select name="size" className="profile-input" value={companyInfo.size} onChange={handleCompanyChange}>
                            <option value="1-50">1 - 50 nhân viên</option>
                            <option value="51-200">51 - 200 nhân viên</option>
                            <option value="201-500">201 - 500 nhân viên</option>
                            <option value="500+">Hơn 500 nhân viên</option>
                          </select>
                        </div>

                        <div className="profile-form-group full-width">
                          <label className="profile-label">Địa chỉ trụ sở</label>
                          <input type="text" name="address" className="profile-input" value={companyInfo.address} onChange={handleCompanyChange} placeholder="Nhập địa chỉ..." maxLength={300} />
                        </div>

                        <div className="profile-form-group full-width">
                          <label className="profile-label">Giới thiệu công ty</label>
                          <textarea name="description" className="profile-input profile-textarea" value={companyInfo.description} onChange={handleCompanyChange} placeholder="Mô tả về lịch sử, văn hóa, môi trường làm việc của công ty..." maxLength={5000}></textarea>
                        </div>
                      </div>

                      <div className="profile-form-actions">
                        <button type="button" className="profile-btn profile-btn-secondary" onClick={handleCancelCompany}>Hủy bỏ</button>
                        <button type="button" className="profile-btn profile-btn-primary" onClick={handleUpdateCompany}>Cập nhật hồ sơ</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {toastMessage && (
            <div className={`profile-toast ${toastClosing ? 'profile-toast--closing' : ''}`}>
              {toastMessage}
            </div>
          )}
        </div>
        <VerificationModal 
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          onVerified={() => {
            setPersonalInfo(prev => ({ ...prev, isVerified: true }))
            if (user) {
              setUser({ ...user, isVerified: true })
            }
            showToast('Tài khoản đã được xác thực thành công!')
          }}
          email={personalInfo.email}
        />
      </div>
    </div>
  )
}

export default ProfilePage