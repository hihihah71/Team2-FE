import React, { useRef, useState, useEffect } from 'react'
import { Toolbar } from './components/Toolbar'
import { ModernTemplate } from './templates/ModernTemplate'
import { MinimalTemplate } from './templates/MinimalTemplate'
import { CreativeTemplate } from './templates/CreativeTemplate'
import { useCVStore } from './store/cvStore'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { uploadPdfCv, updateCv, cloneCvVersion, getMyCVs, createCv } from '../../features/cvs/cvsService'
import { getMyProfile } from '../../features/profile/profileService'
import { Cloud, CloudCheck, Info } from 'lucide-react'
import type { CvItem } from '../../types/domain'

interface CVBuilderLayoutProps {
  onClose: () => void;
  onSaved: (newCv: any) => void;
  cvsCount: number;
  initialCv?: CvItem;
}

export const CVBuilderLayout: React.FC<CVBuilderLayoutProps> = ({ onClose, onSaved, cvsCount, initialCv }) => {
  const { 
    templateId, setProfile, loadCvData, setCvId, setSlug, setIsPublic, setAppMode,
    cvId, slug, isPublic, profile, themeColor, fontFamily, spacing, sectionsOrder,
    avatarUrl, appMode, hiddenSections, hiddenItems, customSections,
    setIsSaving, isSaving, setMyCvs, myCvs, cvName, setCvName
  } = useCVStore()
  
  const cvPreviewRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    // Initialization
    if (initialCv) {
      if (initialCv.cvData) {
        loadCvData({ ...initialCv.cvData, name: initialCv.name })
      } else {
        // Fallback for legacy PDFs
        getMyProfile().then(p => { if (p) setProfile(p) })
        setCvName(initialCv.name || 'Chưa đặt tên')
      }
      setCvId(initialCv._id)
      setSlug(initialCv.slug || null)
      setIsPublic(initialCv.isPublic || false)
      setAppMode('web') // Default to web if editing an existing SaaS CV
    } else {
      // New CV
      getMyProfile().then(p => { if (p) setProfile(p) })
      setCvId(null)
      setSlug(null)
      setIsPublic(false)
      setAppMode('pdf')
    }
  }, [initialCv])

  // Fetch all CVs for the selector
  useEffect(() => {
    getMyCVs().then(cvs => {
      setMyCvs(cvs || [])
    }).catch(console.error)
  }, [cvId]) // Refresh when current CV changes (e.g. after clone)

  // Auto-Save Effect (Debounce 2 seconds)
  useEffect(() => {
    if (!cvId) return; // Don't auto-save if it hasn't been created yet
    const timeout = setTimeout(async () => {
      try {
        const state = useCVStore.getState()
        const cvData = {
          profile: state.profile,
          templateId: state.templateId,
          themeColor: state.themeColor,
          fontFamily: state.fontFamily,
          spacing: state.spacing,
          avatarUrl: state.avatarUrl,
          sectionsOrder: state.sectionsOrder,
          hiddenSections: state.hiddenSections,
          hiddenItems: state.hiddenItems,
          customSections: state.customSections,
        }
        await updateCv(cvId, { 
          cvData,
          name: state.cvName,
          isPublic: state.isPublic,
          slug: state.slug || undefined 
        })
        console.log('✅ Auto-saved draft smoothly')
      } catch (err) {
        console.error('Auto-save failed', err)
      }
    }, 2000)

    return () => clearTimeout(timeout)
  }, [profile, templateId, themeColor, fontFamily, spacing, sectionsOrder, avatarUrl, isPublic, slug, cvId, hiddenSections, hiddenItems, customSections])

  useEffect(() => {
    const handleResize = () => {
       const wrapperWidth = window.innerWidth - 320; 
       const wrapperHeight = window.innerHeight;
       const scaleH = (wrapperWidth - 80) / 794;
       const scaleV = (wrapperHeight - 80) / 1123;
       const minScale = Math.min(scaleH, scaleV, 1.2); 
       setScale(Math.max(minScale, 0.4));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExport = async () => {
    if (!cvPreviewRef.current) return
    try {
      setIsExporting(true)
      
      const canvas = await html2canvas(cvPreviewRef.current, { 
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      
      const pdf = new jsPDF({ format: 'a4', unit: 'mm' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      // Multi-page capability checks
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      const blob = pdf.output('blob')
      const file = new File([blob], `CV_SaaS_${new Date().getTime()}.pdf`, { type: 'application/pdf' })
      
      // If we already have a cvId, we just update it with the new PDF buffer
      let createdOrUpdated;
      if (cvId) {
         const base64 = await fileToBase64(file)
         createdOrUpdated = await updateCv(cvId, { 
            fileDataBase64: base64,
            fileMimeType: 'application/pdf',
            name: `Bản cập nhật - ${new Date().toISOString().slice(0, 10)}`
         })
      } else {
         createdOrUpdated = await uploadPdfCv(file, {
            name: 'CV Thiết Kế Nâng Cao - ' + new Date().toISOString().slice(0, 10),
            isDefault: cvsCount === 0,
         })
         setCvId(createdOrUpdated._id)
      }

      // Important to save down the cvData synchronously once for new files
      const fullState = useCVStore.getState()
      await updateCv(createdOrUpdated._id, {
         cvData: {
           profile: fullState.profile,
           templateId: fullState.templateId,
           themeColor: fullState.themeColor,
           fontFamily: fullState.fontFamily,
           avatarUrl: fullState.avatarUrl,
           sectionsOrder: fullState.sectionsOrder
         }
      })
      
      onSaved(createdOrUpdated)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi khi tạo PDF.'
      window.alert(message)
    } finally {
      setIsExporting(false)
    }
  }

  // Helper for inline base64 encode
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = String(reader.result || '')
        resolve(result.includes(',') ? result.split(',')[1] : result)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleExportPng = async () => {
    if (!cvPreviewRef.current) return
    try {
      setIsExporting(true)
      const canvas = await html2canvas(cvPreviewRef.current, { scale: 2, useCORS: true, logging: false })
      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `CV_SaaS_Export_${new Date().getTime()}.png`
      link.href = imgData
      link.click()
    } catch (err) {
      window.alert('Lỗi xuất PNG')
    } finally {
      setIsExporting(false)
    }
  }

  const handleCloneVersion = async () => {
    if (!cvId) {
       if (confirm('Bạn cần lưu CV này vào hệ thống trước khi nhân bản. Lưu ngay?')) {
         await handleManualSave();
       }
       return
    }
    try {
       setIsExporting(true)
       const cloned = await cloneCvVersion(cvId, `Bản sao - ${new Date().toLocaleTimeString()}`)
       onSaved(cloned)
       window.alert('Đã nhân bản CV thành công!')
       setCvId(cloned._id)
    } catch (err) {
       window.alert('Lỗi tạo bản sao CV')
    } finally {
       setIsExporting(false)
    }
  }

  const handleManualSave = async () => {
    try {
      setIsSaving(true);
      const state = useCVStore.getState();
      const cvData = {
        profile: state.profile,
        templateId: state.templateId,
        themeColor: state.themeColor,
        fontFamily: state.fontFamily,
        spacing: state.spacing,
        avatarUrl: state.avatarUrl,
        sectionsOrder: state.sectionsOrder,
        hiddenSections: state.hiddenSections,
        hiddenItems: state.hiddenItems,
        customSections: state.customSections,
      };

      if (!cvId) {
        // Create NEW CV Logic
        const newCv = await createCv({
          name: state.cvName || 'CV Thiết Kế Mới',
          isDefault: cvsCount === 0,
          cvData: cvData,
        } as any);
        setCvId(newCv._id);
        onSaved(newCv);
      } else {
        // Update EXISTING CV Logic
        await updateCv(cvId, { 
          cvData,
          name: state.cvName,
          isPublic: state.isPublic,
          slug: state.slug || undefined 
        });
      }
      await new Promise(r => setTimeout(r, 600));
    } catch (err) {
      window.alert('Lỗi lưu CV vào hệ thống');
    } finally {
      setIsSaving(false);
    }
  }

  const handleSwitchCv = (targetCv: CvItem) => {
    if (targetCv._id === cvId) return;
    if (confirm('Bạn có muốn chuyển sang thiết kế CV này?')) {
      if (targetCv.cvData) {
        loadCvData(targetCv.cvData)
      } else {
        getMyProfile().then(p => { if (p) setProfile(p) })
      }
      setCvId(targetCv._id)
      setSlug(targetCv.slug || null)
      setIsPublic(targetCv.isPublic || false)
    }
  }

  const handleCreateNew = () => {
    if (confirm('Bắt đầu tạo một CV mới hoàn toàn?')) {
      setCvId(null)
      setSlug(null)
      setIsPublic(false)
      loadCvData({
        profile: {},
        templateId: 'modern',
        themeColor: '#2563eb',
        fontFamily: '"Inter", sans-serif',
        spacing: 'normal',
        avatarUrl: null,
        sectionsOrder: undefined,
        hiddenSections: [],
        hiddenItems: {},
        customSections: [],
      })
      getMyProfile().then(p => { if (p) setProfile(p) })
    }
  }

  const renderTemplate = () => {
    switch (templateId) {
      case 'modern': return <ModernTemplate ref={cvPreviewRef} />
      case 'minimal': return <MinimalTemplate ref={cvPreviewRef} />
      case 'creative': return <CreativeTemplate ref={cvPreviewRef} />
      default: return <ModernTemplate ref={cvPreviewRef} />
    }
  }

  return (
    <div style={{ 
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', width: '100vw', height: '100vh', 
        backgroundColor: '#e2e8f0', overflow: 'hidden' 
    }}>
      {/* Sidebar Toolbar */}
      <div style={{ width: '320px', flexShrink: 0, height: '100%', zIndex: 10, boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}>
        <Toolbar 
           onExport={handleExport} 
           onExportPng={handleExportPng}
           onCloneVersion={handleCloneVersion}
           onManualSave={handleManualSave}
           onSwitchCv={handleSwitchCv}
           onCreateNew={handleCreateNew}
           isExporting={isExporting} 
           hasCvId={!!cvId}
           isSaving={isSaving}
           myCvs={myCvs}
        />
      </div>

      {/* Main Preview Area */}
      <div style={{ 
        flex: 1, height: '100%', overflow: 'auto', 
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '40px 0', position: 'relative' 
      }}>
        <div style={{ position: 'absolute', top: '16px', right: '24px', display: 'flex', gap: '12px', zIndex: 20 }}>
            <div style={{ padding: '8px 16px', color: '#64748b', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', borderRadius: '30px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
               {isSaving ? <Cloud size={14} className="cv-spinner" /> : <CloudCheck size={14} color="#10b981" />}
               {cvId ? (isSaving ? 'Đang lưu...' : 'Đã đồng bộ hệ thống') : 'Chưa lưu (Bản nháp)'}
            </div>
            {(!cvId && !isSaving) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308', backgroundColor: '#fefce8', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', border: '1px solid #fef08a' }}>
                <Info size={14} /> Bạn nên nhấn "Lưu vào hệ thống" để tránh mất dữ liệu.
              </div>
            )}
            <button 
                onClick={onClose}
                style={{ 
                    backgroundColor: '#fff', color: '#111827', border: '1px solid #cbd5e1', 
                    padding: '8px 16px', borderRadius: '8px', fontWeight: 600, 
                    cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
                }}
            >
                ✕ Đóng Trình Tạo
            </button>
        </div>

        {/* Scaled Wrapper */}
        <div style={appMode === 'pdf' ? { 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transition: 'transform 0.2s',
            marginBottom: '40px',
            backgroundColor: '#ffffff'
        } : {
            width: '100%',
            padding: '24px 40px',
            boxSizing: 'border-box'
        }}>
          {renderTemplate()}
        </div>
      </div>
    </div>
  )
}
