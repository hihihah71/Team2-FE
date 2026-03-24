import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicCv } from '../../features/cvs/cvsService'
import { useCVStore } from '../../features/cv-builder/store/cvStore'
import { ModernTemplate } from '../../features/cv-builder/templates/ModernTemplate'
import { MinimalTemplate } from '../../features/cv-builder/templates/MinimalTemplate'
import { CreativeTemplate } from '../../features/cv-builder/templates/CreativeTemplate'

const PublicCVPage = () => {
    const { slug } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { loadCvData, setAppMode, setIsReadOnly, templateId } = useCVStore()

    useEffect(() => {
        setIsReadOnly(true)
        setAppMode('web')

        if (slug) {
            getPublicCv(slug)
                .then(cvItem => {
                   if (cvItem.cvData) {
                       loadCvData(cvItem.cvData)
                   }
                })
                .catch(() => {
                   setError('Hồ sơ tĩnh không tồn tại hoặc đã bị tắt chia sẻ Public.')
                })
                .finally(() => {
                   setLoading(false)
                })
        }
        
        return () => {
            setIsReadOnly(false) // Cleanup for when entering the builder again
        }
    }, [slug, setIsReadOnly, setAppMode, loadCvData])

    if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#64748b' }}>Đang tải Web CV...</div>
    if (error) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '18px', fontWeight: 500 }}>{error}</div>

    const renderTemplate = () => {
        switch (templateId) {
            case 'modern': return <ModernTemplate />
            case 'minimal': return <MinimalTemplate />
            case 'creative': return <CreativeTemplate />
            default: return <ModernTemplate />
        }
    }

    return (
        <div style={{ padding: '60px 0', minHeight: '100vh', backgroundColor: '#e2e8f0', overflow: 'auto' }}>
           <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 20px', boxSizing: 'border-box' }}>
               {renderTemplate()}
           </div>
        </div>
    )
}

export default PublicCVPage
