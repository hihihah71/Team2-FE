import { forwardRef } from 'react'
import { useCVStore } from '../store/cvStore'
import { EditableText } from '../components/EditableText'
import { SectionWrapper } from '../components/SectionWrapper'
import { Mail, Phone, MapPin } from 'lucide-react'

export const CreativeTemplate = forwardRef<HTMLDivElement>((_, ref) => {
  const { 
    profile, updateField, themeColor, fontFamily, avatarUrl, 
    sectionsOrder, appMode, spacing, hiddenSections, hiddenItems, customSections 
  } = useCVStore()
  
  const personal = (profile.personalInfo || {}) as Record<string, any>
  const skills = profile.skills || []
  const experiences = (profile.experiences || []) as any[]
  const educations = (profile.educations || []) as any[]
  const projects = (profile.projects || []) as any[]

  const headerTextColor = '#ffffff'

  // Spacing values
  const marginMap = {
    compact: { section: '16px', item: '12px' },
    normal: { section: '28px', item: '20px' },
    spacious: { section: '44px', item: '32px' }
  }
  const m = marginMap[spacing]

  const renderSection = (id: string) => {
    if (hiddenSections.includes(id)) return null;

    // Check if it's a custom section
    const custom = customSections.find(s => s.id === id)
    if (custom) {
      return (
        <SectionWrapper key={id} sectionId={id} title={custom.title}>
          <div style={{ marginBottom: m.section }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: themeColor, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '20px', height: '4px', backgroundColor: themeColor, marginRight: '8px', display: 'inline-block' }}></span>
              {custom.title}
            </h3>
            <EditableText 
              value={custom.content} 
              onChange={(val) => useCVStore.getState().updateCustomSection(id, val)}
              path={id}
              multiline
              richText
              style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, display: 'block' }}
            />
          </div>
        </SectionWrapper>
      )
    }

    switch (id) {
      case 'summary':
        return personal.summary ? (
          <SectionWrapper key={id} sectionId={id} title="Giới Thiệu">
            <div style={{ marginBottom: m.section }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: themeColor, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '4px', backgroundColor: themeColor, marginRight: '8px', display: 'inline-block' }}></span>
                Giới Thiệu
              </h3>
              <EditableText 
                value={personal.summary} 
                onChange={(val) => updateField('personalInfo.summary', val)}
                path="personalInfo.summary"
                multiline
                richText
                style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, display: 'block' }}
              />
            </div>
          </SectionWrapper>
        ) : null;
      case 'experience':
        return experiences.length > 0 ? (
          <SectionWrapper key={id} sectionId={id} title="Kinh Nghiệm">
            <div style={{ marginBottom: m.section }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: themeColor, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '4px', backgroundColor: themeColor, marginRight: '8px', display: 'inline-block' }}></span>
                Kinh Nghiệm Phụ Trách
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: m.item }}>
                {experiences.map((exp, i) => {
                  if (hiddenItems[id]?.includes(i)) return null;
                  return (
                    <SectionWrapper key={i} sectionId={id} itemIndex={i}>
                      <div style={{ display: 'flex', position: 'relative' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: themeColor, position: 'absolute', left: '-26px', top: '4px', border: '3px solid #fff', boxShadow: `0 0 0 1px ${themeColor}` }}></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
                            <EditableText value={exp.title} onChange={(val) => updateField(`experiences.${i}.title`, val)} path={`experiences.${i}.title`} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', color: themeColor, fontWeight: 600 }}>
                              <EditableText value={exp.company} onChange={(val) => updateField(`experiences.${i}.company`, val)} path={`experiences.${i}.company`} />
                            </span>
                            <span style={{ fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>
                              <EditableText value={exp.date} onChange={(val) => updateField(`experiences.${i}.date`, val)} path={`experiences.${i}.date`} />
                            </span>
                          </div>
                          <EditableText 
                            value={exp.desc} 
                            onChange={(val) => updateField(`experiences.${i}.desc`, val)}
                            path={`experiences.${i}.desc`}
                            multiline
                            richText
                            style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: 1.5, display: 'block' }}
                          />
                        </div>
                      </div>
                    </SectionWrapper>
                  )
                })}
              </div>
            </div>
          </SectionWrapper>
        ) : null;
      case 'education':
        return educations.length > 0 ? (
          <SectionWrapper key={id} sectionId={id} title="Học Vấn">
            <div style={{ marginBottom: m.section }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: themeColor, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '4px', backgroundColor: themeColor, marginRight: '8px', display: 'inline-block' }}></span>
                Học Vấn & Bằng Cấp
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: m.item }}>
                {educations.map((edu, i) => {
                  if (hiddenItems[id]?.includes(i)) return null;
                  return (
                    <SectionWrapper key={i} sectionId={id} itemIndex={i}>
                      <div style={{ display: 'flex', position: 'relative' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: themeColor, position: 'absolute', left: '-26px', top: '4px', border: '3px solid #fff', boxShadow: `0 0 0 1px ${themeColor}` }}></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
                            <EditableText value={edu.school} onChange={v => updateField(`educations.${i}.school`, v)} path={`educations.${i}.school`} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '14px', color: '#4b5563', fontStyle: 'italic' }}>
                              <EditableText value={edu.title} onChange={v => updateField(`educations.${i}.title`, v)} path={`educations.${i}.title`} />
                            </span>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                              <EditableText value={edu.date} onChange={v => updateField(`educations.${i}.date`, v)} path={`educations.${i}.date`} />
                            </span>
                          </div>
                          {edu.desc && (
                            <EditableText value={edu.desc} onChange={v => updateField(`educations.${i}.desc`, v)} path={`educations.${i}.desc`} multiline richText style={{ fontSize: '13.5px', color: '#6b7280', display: 'block' }} />
                          )}
                        </div>
                      </div>
                    </SectionWrapper>
                  )
                })}
              </div>
            </div>
          </SectionWrapper>
        ) : null;
      case 'projects':
        return projects.length > 0 ? (
          <SectionWrapper key={id} sectionId={id} title="Dự Án">
            <div style={{ marginBottom: m.section }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: themeColor, textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '4px', backgroundColor: themeColor, marginRight: '8px', display: 'inline-block' }}></span>
                Dự Án Đã Làm
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {projects.map((proj, i) => {
                  if (hiddenItems[id]?.includes(i)) return null;
                  return (
                    <SectionWrapper key={i} sectionId={id} itemIndex={i}>
                      <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: `4px solid ${themeColor}` }}>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>
                          <EditableText value={proj.name} onChange={v => updateField(`projects.${i}.name`, v)} path={`projects.${i}.name`} />
                        </div>
                        <div style={{ fontSize: '12px', color: themeColor, fontWeight: 600, marginBottom: '8px' }}>
                          <EditableText value={proj.role} onChange={v => updateField(`projects.${i}.role`, v)} path={`projects.${i}.role`} />
                        </div>
                        <EditableText value={proj.desc} onChange={v => updateField(`projects.${i}.desc`, v)} path={`projects.${i}.desc`} multiline richText style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, display: 'block' }} />
                      </div>
                    </SectionWrapper>
                  )
                })}
              </div>
            </div>
          </SectionWrapper>
        ) : null;
      case 'skills':
        return skills.length > 0 ? (
          <SectionWrapper key={id} sectionId={id} title="Kỹ Năng">
            <div style={{ marginBottom: m.section }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: themeColor, textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '4px', backgroundColor: themeColor, marginRight: '8px', display: 'inline-block' }}></span>
                Kỹ Năng Kỹ Thuật
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((skill: string, i: number) => (
                  <span key={i} style={{ padding: '6px 12px', backgroundColor: 'transparent', border: `1px solid ${themeColor}`, color: themeColor, borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>
                    {skill}
                  </span>
                ))}
              </div>
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
      } : {
        width: '100%',
        maxWidth: '1000px',
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
      }}
    >
      {/* Creative Header */}
      <div style={{ 
        backgroundColor: themeColor, 
        padding: '48px 40px', 
        color: headerTextColor,
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        transition: 'background-color 0.3s ease'
      }}>
        {avatarUrl && (
          <div style={{ width: '140px', height: '140px', flexShrink: 0, borderRadius: '24px', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '38px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <EditableText value={personal.fullName} onChange={v => updateField('personalInfo.fullName', v)} path="personalInfo.fullName" placeholder="HỌ VÀ TÊN ỨNG VIÊN" />
          </h1>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 16px 0', opacity: 0.9, letterSpacing: '2px', textTransform: 'uppercase' }}>
            <EditableText value={personal.role} onChange={v => updateField('personalInfo.role', v)} path="personalInfo.role" placeholder="VỊ TRÍ ỨNG TUYỂN" />
          </h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', opacity: 0.9 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={16} /> <EditableText value={personal.email} onChange={v => updateField('personalInfo.email', v)} path="personalInfo.email" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} /> <EditableText value={personal.phone} onChange={v => updateField('personalInfo.phone', v)} path="personalInfo.phone" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> <EditableText value={personal.address} onChange={v => updateField('personalInfo.address', v)} path="personalInfo.address" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px 40px 40px 60px', position: 'relative', flex: 1 }}>
        <div style={{ position: 'absolute', left: '65px', top: '40px', bottom: '40px', width: '2px', backgroundColor: '#e2e8f0', zIndex: 0 }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {(sectionsOrder || []).map(sectionId => renderSection(sectionId))}
        </div>
      </div>
    </div>
  )
})
