import { forwardRef } from 'react'
import { useCVStore } from '../store/cvStore'
import { EditableText } from '../components/EditableText'
import { SectionWrapper } from '../components/SectionWrapper'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, FolderDot } from 'lucide-react'

export const ModernTemplate = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    profile, updateField, themeColor, fontFamily, spacing,
    avatarUrl, sectionsOrder, customSections,
    updateCustomSection, appMode,
  } = useCVStore()

  const personal = (profile.personalInfo || {}) as Record<string, any>
  const skills = profile.skills || []
  const experiences = (profile.experiences || []) as any[]
  const educations = (profile.educations || []) as any[]
  const projects = (profile.projects || []) as any[]
  const certifications = (profile.certifications || []) as any[]

  const sidebarBg = '#1e293b'

  const itemGap = spacing === 'compact' ? '8px' : spacing === 'spacious' ? '24px' : '16px'
  const sectionMb = spacing === 'compact' ? '16px' : spacing === 'spacious' ? '40px' : '28px'

  const SectionHeader = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: itemGap }}>
      <div style={{ backgroundColor: `${themeColor}20`, padding: '6px', borderRadius: '8px', color: themeColor }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </h3>
    </div>
  )

  const renderSection = (id: string) => {
    if (id.startsWith('custom_')) {
      const cs = customSections.find((s) => s.id === id)
      if (!cs) return null
      return (
        <SectionWrapper key={id} sectionId={id} title={cs.title}>
          <div style={{ marginBottom: sectionMb }}>
            <SectionHeader icon="📝" label={cs.title} />
            <EditableText
              value={cs.content}
              onChange={(val) => updateCustomSection(id, val)}
              path={id}
              multiline
              richText
              style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: 1.7 }}
            />
          </div>
        </SectionWrapper>
      )
    }

    switch (id) {
      case 'summary':
        return personal.summary ? (
          <SectionWrapper key={id} sectionId={id} title="Giới thiệu">
            <div style={{ marginBottom: sectionMb }}>
              <SectionHeader
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                label="Giới thiệu bản thân"
              />
              <EditableText
                value={personal.summary}
                onChange={(val) => updateField('personalInfo.summary', val)}
                path="personalInfo.summary"
                multiline
                richText
                style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: 1.7, display: 'block' }}
              />
            </div>
          </SectionWrapper>
        ) : null

      case 'experience':
        return experiences.length > 0 ? (
          <SectionWrapper key={id} sectionId={id} title="Kinh nghiệm">
            <div style={{ marginBottom: sectionMb }}>
              <SectionHeader icon={<Briefcase size={18} />} label="Kinh nghiệm làm việc" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: itemGap }}>
                {experiences.map((exp, i) => (
                  <div key={i} style={{ paddingLeft: '12px', borderLeft: `3px solid ${themeColor}30` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <EditableText value={exp.title} onChange={(val) => updateField(`experiences.${i}.title`, val)} path={`experiences.${i}.title`} style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937' }} />
                      <EditableText value={exp.date} onChange={(val) => updateField(`experiences.${i}.date`, val)} path={`experiences.${i}.date`} style={{ fontSize: '11.5px', color: themeColor, fontWeight: 600, backgroundColor: `${themeColor}15`, padding: '2px 8px', borderRadius: '12px', whiteSpace: 'nowrap' }} />
                    </div>
                    <EditableText value={exp.company} onChange={(val) => updateField(`experiences.${i}.company`, val)} path={`experiences.${i}.company`} style={{ fontSize: '13px', fontStyle: 'italic', color: '#4b5563', marginBottom: '6px' }} />
                    <EditableText value={exp.desc} onChange={(val) => updateField(`experiences.${i}.desc`, val)} path={`experiences.${i}.desc`} multiline richText style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.6 }} />
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        ) : null

      case 'education':
        return educations.length > 0 ? (
          <SectionWrapper key={id} sectionId={id} title="Học vấn">
            <div style={{ marginBottom: sectionMb }}>
              <SectionHeader icon={<GraduationCap size={18} />} label="Học vấn" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: itemGap }}>
                {educations.map((edu, i) => (
                  <div key={i} style={{ paddingLeft: '12px', borderLeft: `3px solid ${themeColor}30` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <EditableText value={edu.title} onChange={v => updateField(`educations.${i}.title`, v)} path={`educations.${i}.title`} style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937' }} />
                      <EditableText value={edu.date} onChange={v => updateField(`educations.${i}.date`, v)} path={`educations.${i}.date`} style={{ fontSize: '11.5px', color: themeColor, fontWeight: 600, backgroundColor: `${themeColor}15`, padding: '2px 8px', borderRadius: '12px', whiteSpace: 'nowrap' }} />
                    </div>
                    <EditableText value={edu.school} onChange={v => updateField(`educations.${i}.school`, v)} path={`educations.${i}.school`} style={{ fontSize: '13px', fontStyle: 'italic', color: '#4b5563', marginBottom: '6px' }} />
                    <EditableText value={edu.desc} onChange={v => updateField(`educations.${i}.desc`, v)} path={`educations.${i}.desc`} multiline richText style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.6 }} />
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        ) : null

      case 'projects':
        return projects.length > 0 ? (
          <SectionWrapper key={id} sectionId={id} title="Dự án">
            <div style={{ marginBottom: sectionMb }}>
              <SectionHeader icon={<FolderDot size={18} />} label="Dự án nổi bật" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: itemGap }}>
                {projects.map((proj, i) => (
                  <div key={i} style={{ paddingLeft: '12px', borderLeft: `3px solid ${themeColor}30` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <EditableText value={proj.name} onChange={v => updateField(`projects.${i}.name`, v)} path={`projects.${i}.name`} style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937' }} />
                      <EditableText value={proj.date} onChange={v => updateField(`projects.${i}.date`, v)} path={`projects.${i}.date`} style={{ fontSize: '11.5px', color: themeColor, fontWeight: 600, backgroundColor: `${themeColor}15`, padding: '2px 8px', borderRadius: '12px', whiteSpace: 'nowrap' }} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: themeColor, marginBottom: '4px' }}>
                      Vai trò: <EditableText value={proj.role} onChange={v => updateField(`projects.${i}.role`, v)} path={`projects.${i}.role`} />
                    </div>
                    <EditableText value={proj.desc} onChange={v => updateField(`projects.${i}.desc`, v)} path={`projects.${i}.desc`} multiline richText style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.6 }} />
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        ) : null

      case 'certifications':
        return certifications.length > 0 ? (
          <SectionWrapper key={id} sectionId={id} title="Chứng chỉ">
            <div style={{ marginBottom: sectionMb }}>
              <SectionHeader icon={<Award size={18} />} label="Chứng chỉ" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {certifications.map((cert, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <EditableText value={cert.name} onChange={v => updateField(`certifications.${i}.name`, v)} path={`certifications.${i}.name`} style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }} />
                      <EditableText value={cert.organization} onChange={v => updateField(`certifications.${i}.organization`, v)} path={`certifications.${i}.organization`} style={{ fontSize: '12px', fontStyle: 'italic', color: '#6b7280' }} />
                    </div>
                    <EditableText value={cert.date} onChange={v => updateField(`certifications.${i}.date`, v)} path={`certifications.${i}.date`} style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }} />
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        ) : null

      default: return null
    }
  }

  return (
    <div
      ref={ref}
      style={appMode === 'pdf' ? {
        width: '794px', minHeight: '1123px', backgroundColor: '#ffffff',
        display: 'flex', flexDirection: 'row', color: '#1f2937', fontFamily, boxSizing: 'border-box', overflow: 'hidden'
      } : {
        width: '100%', maxWidth: '1000px', minHeight: '100vh', backgroundColor: '#ffffff',
        display: 'flex', flexDirection: 'row', color: '#1f2937', fontFamily, boxSizing: 'border-box',
        boxShadow: '0 4px 28px rgba(0,0,0,0.1)', borderRadius: '16px', overflow: 'hidden', margin: '0 auto'
      }}
    >
      {/* Sidebar */}
      <div style={{
        width: '34%', backgroundColor: sidebarBg, color: '#ffffff',
        padding: spacing === 'compact' ? '24px 18px' : spacing === 'spacious' ? '44px 30px' : '32px 24px',
        display: 'flex', flexDirection: 'column', gap: '24px',
      }}>
        {avatarUrl && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
            <div style={{ width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden', border: `4px solid ${themeColor}`, backgroundColor: '#fff' }}>
              <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '21px', fontWeight: 800, margin: '0 0 6px', lineHeight: 1.2 }}>
            <EditableText value={personal.fullName} onChange={v => updateField('personalInfo.fullName', v)} path="personalInfo.fullName" placeholder="Tên Ứng Viên" />
          </h1>
          <h2 style={{ fontSize: '13px', color: themeColor, fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            <EditableText value={personal.role} onChange={v => updateField('personalInfo.role', v)} path="personalInfo.role" placeholder="Chức Danh" />
          </h2>
        </div>

        <div style={{ height: '2px', backgroundColor: themeColor, opacity: 0.7 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 800, borderBottom: `2px solid ${themeColor}`, paddingBottom: '4px', margin: '0 0 4px', display: 'inline-block', letterSpacing: '0.08em' }}>LIÊN HỆ</h3>
          {[
            { icon: <Mail size={14} color={themeColor} />, field: 'email', placeholder: 'Email' },
            { icon: <Phone size={14} color={themeColor} />, field: 'phone', placeholder: 'Số điện thoại' },
            { icon: <MapPin size={14} color={themeColor} style={{ marginTop: '2px', flexShrink: 0 }} />, field: 'address', placeholder: 'Địa chỉ', multiline: true },
          ].map(({ icon, field, placeholder, multiline }) => (
            <div key={field} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              {icon}
              <EditableText
                value={(personal as any)[field]}
                onChange={v => updateField(`personalInfo.${field}`, v)}
                path={`personalInfo.${field}`}
                placeholder={placeholder}
                multiline={multiline}
                style={{ lineHeight: 1.45, fontSize: '13px' }}
              />
            </div>
          ))}
        </div>

        {skills.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, borderBottom: `2px solid ${themeColor}`, paddingBottom: '4px', margin: '0 0 4px', display: 'inline-block', letterSpacing: '0.08em' }}>KỸ NĂNG</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.map((skill: string, i: number) => (
                <span key={i} style={{ backgroundColor: themeColor, color: '#fff', padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{
        width: '66%',
        padding: spacing === 'compact' ? '24px 28px' : spacing === 'spacious' ? '48px 48px' : '36px 36px',
        display: 'flex', flexDirection: 'column',
      }}>
        {sectionsOrder.map((sectionId) => renderSection(sectionId))}
      </div>
    </div>
  )
})
