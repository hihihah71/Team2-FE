import { forwardRef } from 'react'
import { useCVStore } from '../store/cvStore'
import { EditableText } from '../components/EditableText'
import { SectionWrapper } from '../components/SectionWrapper'
import { Mail, Phone, MapPin } from 'lucide-react'

export const MinimalTemplate = forwardRef<HTMLDivElement>((_, ref) => {
  const { profile, updateField, themeColor, fontFamily, avatarUrl, sectionsOrder, appMode, spacing, customSections, updateCustomSection } = useCVStore()
  
  const personal = (profile.personalInfo || {}) as Record<string, any>
  const skills = profile.skills || []
  const experiences = (profile.experiences || []) as any[]
  const educations = (profile.educations || []) as any[]
  const projects = (profile.projects || []) as any[]

  const sectionMb = spacing === 'compact' ? '16px' : spacing === 'spacious' ? '40px' : '24px'
  const itemGap = spacing === 'compact' ? '8px' : spacing === 'spacious' ? '24px' : '16px'

  const renderSection = (id: string) => {
    if (id.startsWith('custom_')) {
      const cs = customSections.find((s) => s.id === id)
      if (!cs) return null
      return (
        <SectionWrapper key={id} sectionId={id} title={cs.title}>
          <div style={{ marginBottom: sectionMb }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: themeColor, textTransform: 'uppercase', borderBottom: `1px solid ${themeColor}`, paddingBottom: '4px', marginBottom: '12px', letterSpacing: '1px' }}>{ cs.title.toUpperCase() }</h3>
            <EditableText value={cs.content} onChange={(val) => updateCustomSection(id, val)} path={id} multiline richText style={{ fontSize: '13.5px', color: '#1f2937', lineHeight: 1.6 }} />
          </div>
        </SectionWrapper>
      )
    }
    switch (id) {
      case 'summary':
        return personal.summary ? (
          <SectionWrapper key={id} sectionId={id} title="Tóm tắt">
            <div style={{ marginBottom: sectionMb }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: themeColor, textTransform: 'uppercase', borderBottom: `1px solid ${themeColor}`, paddingBottom: '4px', marginBottom: '12px', letterSpacing: '1px' }}>TÓM TẮT</h3>
              <EditableText value={personal.summary} onChange={(val) => updateField('personalInfo.summary', val)} path="personalInfo.summary" multiline richText style={{ fontSize: '13.5px', color: '#1f2937', lineHeight: 1.6, display: 'block' }} />
            </div>
          </SectionWrapper>
        ) : null;
      case 'experience':
        return experiences.length > 0 ? (
          <SectionWrapper key={id} sectionId={id} title="Kinh nghiệm">
            <div style={{ marginBottom: sectionMb }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: themeColor, textTransform: 'uppercase', borderBottom: `1px solid ${themeColor}`, paddingBottom: '4px', marginBottom: itemGap, letterSpacing: '1px' }}>KINH NGHIỆM LÀM VIỆC</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: itemGap }}>
                {experiences.map((exp, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14.5px', color: '#111827' }}><EditableText value={exp.title} onChange={(val) => updateField(`experiences.${i}.title`, val)} path={`experiences.${i}.title`} /></div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}><EditableText value={exp.date} onChange={(val) => updateField(`experiences.${i}.date`, val)} path={`experiences.${i}.date`} /></div>
                    </div>
                    <div style={{ fontSize: '14px', fontStyle: 'italic', color: '#374151', marginBottom: '6px' }}><EditableText value={exp.company} onChange={(val) => updateField(`experiences.${i}.company`, val)} path={`experiences.${i}.company`} /></div>
                    <EditableText value={exp.desc} onChange={(val) => updateField(`experiences.${i}.desc`, val)} path={`experiences.${i}.desc`} multiline richText style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: 1.5, display: 'block', paddingLeft: '12px', borderLeft: '2px solid #e5e7eb' }} />
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        ) : null;
      case 'education':
        return educations.length > 0 ? (
          <SectionWrapper key={id} sectionId={id} title="Học vấn">
            <div style={{ marginBottom: sectionMb }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: themeColor, textTransform: 'uppercase', borderBottom: `1px solid ${themeColor}`, paddingBottom: '4px', marginBottom: itemGap, letterSpacing: '1px' }}>HỌC VẤN</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: itemGap }}>
                {educations.map((edu, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14.5px', color: '#111827' }}><EditableText value={edu.school} onChange={v => updateField(`educations.${i}.school`, v)} path={`educations.${i}.school`} /></div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}><EditableText value={edu.date} onChange={v => updateField(`educations.${i}.date`, v)} path={`educations.${i}.date`} /></div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}><EditableText value={edu.title} onChange={v => updateField(`educations.${i}.title`, v)} path={`educations.${i}.title`} /></div>
                    {edu.desc && <EditableText value={edu.desc} onChange={v => updateField(`educations.${i}.desc`, v)} path={`educations.${i}.desc`} multiline richText style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: 1.5, display: 'block' }} />}
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        ) : null;
      case 'projects':
        return projects.length > 0 ? (
          <SectionWrapper key={id} sectionId={id} title="Dự án">
            <div style={{ marginBottom: sectionMb }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: themeColor, textTransform: 'uppercase', borderBottom: `1px solid ${themeColor}`, paddingBottom: '4px', marginBottom: itemGap, letterSpacing: '1px' }}>DỰ ÁN NỔI BẬT</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: itemGap }}>
                {projects.map((proj, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14.5px', color: '#111827' }}><EditableText value={proj.name} onChange={v => updateField(`projects.${i}.name`, v)} path={`projects.${i}.name`} /></div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}><EditableText value={proj.date} onChange={v => updateField(`projects.${i}.date`, v)} path={`projects.${i}.date`} /></div>
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#374151', marginBottom: '6px' }}>Vai trò: <EditableText value={proj.role} onChange={v => updateField(`projects.${i}.role`, v)} path={`projects.${i}.role`} style={{ fontStyle: 'italic' }} /></div>
                    <EditableText value={proj.desc} onChange={v => updateField(`projects.${i}.desc`, v)} path={`projects.${i}.desc`} multiline richText style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: 1.5, display: 'block' }} />
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        ) : null;
      case 'skills':
        return skills.length > 0 ? (
          <SectionWrapper key={id} sectionId={id} title="Kỹ năng">
            <div style={{ marginBottom: sectionMb }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: themeColor, textTransform: 'uppercase', borderBottom: `1px solid ${themeColor}`, paddingBottom: '4px', marginBottom: '12px', letterSpacing: '1px' }}>KỸ NĂNG</h3>
              <p style={{ fontSize: '13.5px', lineHeight: 1.6, margin: 0, color: '#1f2937' }}>{skills.join(' • ')}</p>
            </div>
          </SectionWrapper>
        ) : null;
      default: return null;
    }
  }

  return (
    <div 
      ref={ref}
      style={appMode === 'pdf' ? {
        width: '794px',
        minHeight: '1123px',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        color: '#1f2937',
        fontFamily,
        boxSizing: 'border-box',
        overflow: 'hidden',
        padding: '48px 56px'
      } : {
        width: '100%',
        maxWidth: '900px',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        color: '#1f2937',
        fontFamily,
        boxSizing: 'border-box',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        margin: '0 auto',
        padding: '48px 56px'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', gap: '32px', borderBottom: `2px solid ${themeColor}`, paddingBottom: '24px', marginBottom: '24px' }}>
        
        {avatarUrl && (
          <div style={{ width: '110px', height: '110px', flexShrink: 0, overflow: 'hidden', borderRadius: '8px' }}>
            <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '1px', color: '#111827' }}>
            <EditableText value={personal.fullName} onChange={v => updateField('personalInfo.fullName', v)} path="personalInfo.fullName" placeholder="Tên Ứng Viên" />
          </h1>
          <h2 style={{ fontSize: '16px', color: themeColor, fontWeight: 500, margin: '0 0 16px 0', textTransform: 'uppercase' }}>
            <EditableText value={personal.role} onChange={v => updateField('personalInfo.role', v)} path="personalInfo.role" placeholder="Chức Danh" />
          </h2>

          {/* Contact info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color={themeColor} />
              <EditableText value={personal.email} onChange={v => updateField('personalInfo.email', v)} path="personalInfo.email" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} color={themeColor} />
              <EditableText value={personal.phone} onChange={v => updateField('personalInfo.phone', v)} path="personalInfo.phone" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', gridColumn: '1 / -1' }}>
              <MapPin size={14} color={themeColor} />
              <EditableText value={personal.address} onChange={v => updateField('personalInfo.address', v)} path="personalInfo.address" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {sectionsOrder.map(sectionId => renderSection(sectionId))}
      </div>
    </div>
  )
})
