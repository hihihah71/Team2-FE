import React, { useState } from 'react'
import { useCVStore } from '../store/cvStore'
import { X, Sparkles, Send, RefreshCw, Languages, Zap, FileText, AlertTriangle, Target } from 'lucide-react'
import { apiPost } from '../../../services/httpClient'
import { API_ENDPOINTS } from '../../../constants/api'
import { validateText } from '../../../utils/inputValidation'

export const AIAssistantDrawer: React.FC = () => {
  const { aiDrawer, closeAiDrawer, updateField, updateCustomSection, profile } = useCVStore()
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  
  // New State for Tailor & Interview Mode
  const [activeTab, setActiveTab] = useState<'quick' | 'tailor' | 'interview'>('quick')
  const [jdText, setJdText] = useState('')
  const [tailorResult, setTailorResult] = useState<{
    score: number;
    missingKeywords: string[];
    tailoredSummary: string;
  } | null>(null)
  
  const [interviewResult, setInterviewResult] = useState<{
    questions: Array<{
      question: string;
      why: string;
      keyPoints: string[];
      sampleAnswer: string;
    }>
  } | null>(null)

  // Mock Practice State
  const [practiceIdx, setPracticeIdx] = useState<number | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [evaluation, setEvaluation] = useState<string | null>(null)

  // Auto-switch tab when context changes from CV
  React.useEffect(() => {
    if (aiDrawer.currentPath) setActiveTab('quick')
  }, [aiDrawer.currentPath])

  if (!aiDrawer.isOpen) return null

  const handleAiAction = async (type: string) => {
    const textToSend = aiDrawer.currentText
    if (!textToSend || textToSend.trim().length < 3) {
      setError('Hãy click vào một đoạn văn bản trên CV để bắt đầu.')
      return
    }
    const textError = validateText(textToSend, { maxWords: 300, maxWordLength: 20 })
    if (textError) {
      setError(`Noi dung CV: ${textError}`)
      return
    }
    if (type && type.trim().length > 20) {
      setError('Yeu cau toi uu khong hop le.')
      return
    }

    setIsLoading(true)
    setError('')
    setResult('')
    
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
      const token = localStorage.getItem('access_token')
      
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.AI_OPTIMIZE}?stream=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: textToSend, type })
      })

      if (!response.ok) throw new Error('Cửa hàng AI đang bận. Thử lại sau!')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader!.read()
        done = doneReading
        const chunk = decoder.decode(value)
        
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.replace('data: ', '').trim()
            if (data === '[DONE]') break
            if (data.startsWith('[ERROR:')) { setError(data); break; }
            try {
              const json = JSON.parse(data)
              const content = json.choices?.[0]?.delta?.content || ""
              setResult(prev => prev + content)
            } catch (e) { }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi gọi AI')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePractice = async () => {
    if (!userAnswer.trim()) return
    const answerError = validateText(userAnswer, { maxWords: 300, maxWordLength: 20 })
    if (answerError) {
      setError(`Cau tra loi: ${answerError}`)
      return
    }
    setIsLoading(true)
    setEvaluation(null)
    try {
      const q = interviewResult!.questions[practiceIdx!]
      const prompt = `Câu hỏi: ${q.question}\nCâu trả lời của tôi: ${userAnswer}\n\nHãy đánh giá câu trả lời này dựa trên JD và kỹ năng cốt lõi. Cho điểm từ 0-100 và góp ý ngắn gọn.`
      
      const response = await apiPost<any>(API_ENDPOINTS.AI_OPTIMIZE, { text: prompt, type: 'evaluate_answer' })
      setEvaluation(response.optimizedText || response.result) 
    } catch (err) {
      setError('Lỗi đánh giá')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTailor = async () => {
    if (!jdText.trim()) {
      setError('Hãy dán JD vào để tôi phân tích.')
      return
    }
    const jdError = validateText(jdText, { maxWords: 400, maxWordLength: 20 })
    if (jdError) {
      setError(`JD: ${jdError}`)
      return
    }
    setIsLoading(true)
    setError('')
    setTailorResult(null)
    
    const cvContent = JSON.stringify({
      summary: (profile as any).summary || '',
      skills: (profile as any).skills || [],
      experience: (profile as any).experiences?.map((exp: any) => `${exp.position} at ${exp.company}: ${exp.description}`).join('; ') || ''
    })

    try {
      const data = await apiPost<any>(API_ENDPOINTS.AI_TAILOR, {
        jobDescription: jdText,
        cvContent: cvContent
      })
      setTailorResult(data)
    } catch (err: any) {
      setError(err.message || 'Lỗi phân tích JD')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInterviewPrep = async () => {
    if (!jdText.trim()) {
      setError('Dán JD vào để tôi dự đoán câu hỏi phỏng vấn.')
      return
    }
    const jdError = validateText(jdText, { maxWords: 400, maxWordLength: 20 })
    if (jdError) {
      setError(`JD: ${jdError}`)
      return
    }
    setIsLoading(true)
    setError('')
    setInterviewResult(null)
    setPracticeIdx(null)
    
    const cvContent = JSON.stringify({
      summary: (profile as any).summary || '',
      skills: (profile as any).skills || [],
      experience: (profile as any).experiences?.map((exp: any) => `${exp.position} at ${exp.company}: ${exp.description}`).join('; ') || ''
    })

    try {
      const data = await apiPost<any>(API_ENDPOINTS.AI_INTERVIEW_PREP, {
        jobDescription: jdText,
        cvContent: cvContent
      })
      setInterviewResult(data)
    } catch (err: any) {
      setError(err.message || 'Lỗi chuẩn bị phỏng vấn')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = (textToApply?: string) => {
    const finalResult = textToApply || result
    if (!finalResult || !aiDrawer.currentPath) return
    
    if (aiDrawer.currentPath.startsWith('custom_')) {
      updateCustomSection(aiDrawer.currentPath, finalResult)
    } else {
      updateField(aiDrawer.currentPath, finalResult)
    }
    setResult('')
    setTailorResult(null)
    closeAiDrawer()
  }

  const hasText = aiDrawer.currentText && aiDrawer.currentText.trim().length > 0
  const getContextLabel = () => {
     if (!aiDrawer.currentPath) return "Chung"
     if (aiDrawer.currentPath.includes('summary')) return "Giới thiệu"
     if (aiDrawer.currentPath.includes('experiences')) return "Kinh nghiệm"
     if (aiDrawer.currentPath.includes('educations')) return "Học vấn"
     if (aiDrawer.currentPath.includes('skills')) return "Kỹ năng"
     return "Phần tự chọn"
  }

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, bottom: 0, width: '420px',
      backgroundColor: '#fff', boxShadow: '-5px 0 25px rgba(0,0,0,0.15)',
      zIndex: 10000, display: 'flex', flexDirection: 'column',
      animation: 'slideIn 0.3s ease-out',
    }}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .tab-btn { padding: 12px; flex: 1; border: none; background: none; font-size: 14px; font-weight: 600; cursor: pointer; color: #64748b; border-bottom: 2px solid transparent; transition: all 0.2s; }
        .tab-btn.active { color: #8b5cf6; border-bottom-color: #8b5cf6; background-color: #f5f3ff; }
        .ai-action-btn:hover { background-color: #f5f3ff !important; border-color: #8b5cf6 !important; color: #7c3aed !important; }
      `}</style>
      
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} color="#8b5cf6" fill="#c4b5fd" />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>AI Career Assistant</h2>
        </div>
        <button onClick={closeAiDrawer} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
        <button className={`tab-btn ${activeTab === 'quick' ? 'active' : ''}`} onClick={() => setActiveTab('quick')}>Tối ưu</button>
        <button className={`tab-btn ${activeTab === 'tailor' ? 'active' : ''}`} onClick={() => setActiveTab('tailor')}>Matcher ✨</button>
        <button className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`} onClick={() => setActiveTab('interview')}>Phỏng vấn 🎯</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {activeTab === 'quick' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
               <label style={labelStyle}>Mục tiêu:</label>
               <span style={{ fontSize: '11px', backgroundColor: '#8b5cf6', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>{getContextLabel()}</span>
            </div>
            <div>
              <div style={hasText ? contextBoxStyle : { ...contextBoxStyle, backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#ef4444' }}>
                {hasText ? aiDrawer.currentText : (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Hãy chọn một vùng văn bản trên CV để sửa nhanh bằng AI.</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="ai-action-btn" onClick={() => handleAiAction('professional')} disabled={!hasText || isLoading} style={actionBtnStyle}><Zap size={14} /> Chuyên nghiệp</button>
              <button className="ai-action-btn" onClick={() => handleAiAction('concise')} disabled={!hasText || isLoading} style={actionBtnStyle}><FileText size={14} /> Rút gọn</button>
              <button className="ai-action-btn" onClick={() => handleAiAction('grammar')} disabled={!hasText || isLoading} style={actionBtnStyle}><RefreshCw size={14} /> Sửa lỗi</button>
              <button className="ai-action-btn" onClick={() => handleAiAction('translate')} disabled={!hasText || isLoading} style={actionBtnStyle}><Languages size={14} /> Dịch Tiếng Anh</button>
            </div>

            <div style={{ position: 'relative' }}>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Yêu cầu riêng (vd: Hãy viết văn phong hài hước...)" style={textareaStyle} disabled={!hasText} />
              <button onClick={() => handleAiAction(prompt)} disabled={isLoading || !prompt.trim() || !hasText} style={sendBtnStyle}><Send size={16} /></button>
            </div>
          </>
        )}

        {activeTab === 'tailor' && (
          <>
            <div>
              <label style={labelStyle}>Mô tả công việc (JD):</label>
              <textarea value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder="Dán yêu cầu tuyển dụng để phân tích độ khớp..." style={{ ...textareaStyle, minHeight: '180px' }} />
              <button onClick={handleTailor} disabled={isLoading || !jdText.trim()} style={{ width: '100%', marginTop: '12px', padding: '14px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)' }}>
                {isLoading ? <RefreshCw size={18} className="spinner" /> : <Sparkles size={18} />} Phân tích Độ khớp CV
              </button>
            </div>

            {tailorResult && (
              <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#475569' }}>Match Score:</span>
                  <div style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: tailorResult.score > 70 ? '#dcfce7' : '#fef9c3', color: tailorResult.score > 70 ? '#16a34a' : '#ca8a04', fontWeight: 700, fontSize: '18px' }}>{tailorResult.score}%</div>
                </div>
                
                <div>
                  <label style={labelStyle}>Từ khóa thiếu:</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {tailorResult.missingKeywords.map(kw => <span key={kw} style={{ padding: '4px 10px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '6px', fontSize: '12px', fontWeight: 500 }}>{kw}</span>)}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Đề xuất Tóm tắt:</label>
                  <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#334155', backgroundColor: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>{tailorResult.tailoredSummary}</div>
                  <button onClick={() => handleApply(tailorResult.tailoredSummary)} style={{ marginTop: '12px', width: '100%', padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>Áp dụng ngay</button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'interview' && (
          <>
            {!interviewResult ? (
              <div>
                <label style={labelStyle}>Mô tả công việc (JD):</label>
                <textarea value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder="Dán JD để tạo bộ câu hỏi phỏng vấn..." style={{ ...textareaStyle, minHeight: '120px' }} />
                <button onClick={handleInterviewPrep} disabled={isLoading || !jdText.trim()} style={{ width: '100%', marginTop: '12px', padding: '14px', backgroundColor: '#ec4899', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {isLoading ? <RefreshCw size={18} className="spinner" /> : <Target size={18} />} Tạo bộ câu hỏi
                </button>
              </div>
            ) : practiceIdx !== null ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button onClick={() => {setPracticeIdx(null); setEvaluation(null); setUserAnswer('')}} style={{ alignSelf: 'flex-start', fontSize: '12px', color: '#64748b', cursor: 'pointer', background: 'none', border: 'none' }}>← Quay lại danh sách</button>
                <div style={{ padding: '16px', backgroundColor: '#fdf2f8', borderRadius: '12px', border: '1px solid #fbcfe8' }}>
                  <div style={{ fontSize: '12px', color: '#db2777', fontWeight: 800, marginBottom: '8px' }}>QUESTION {practiceIdx + 1}:</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{interviewResult.questions[practiceIdx].question}</div>
                </div>
                <div>
                  <label style={labelStyle}>Câu trả lời của bạn:</label>
                  <textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Nhập câu trả lời của bạn tại đây để AI đánh giá..." style={{ ...textareaStyle, minHeight: '150px' }} />
                  <button onClick={handlePractice} disabled={isLoading || !userAnswer.trim()} style={{ width: '100%', marginTop: '12px', padding: '12px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>{isLoading ? 'Đang chấm điểm...' : 'Gửi câu trả lời'}</button>
                </div>
                {evaluation && (
                  <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800, marginBottom: '8px' }}>ĐÁNH GIÁ CỦA AI:</div>
                    <div style={{ fontSize: '14px', color: '#166534', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{evaluation}</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: '14px', fontWeight: 700, color: '#9d174d' }}>Bộ câu hỏi dự đoán:</span>
                   <button onClick={() => setInterviewResult(null)} style={{ fontSize: '12px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>Đổi JD</button>
                </div>
                {interviewResult.questions.map((q, idx) => (
                  <div key={idx} style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#fff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{q.question}</div>
                    <button onClick={() => setPracticeIdx(idx)} style={{ alignSelf: 'flex-start', padding: '6px 14px', backgroundColor: '#fdf2f8', color: '#db2777', border: '1px solid #fbcfe8', borderRadius: '20px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Luyện tập ngay</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Status Area */}
        {(isLoading || error || (result && activeTab === 'quick')) && (
          <div style={{ padding: '15px', borderRadius: '12px', backgroundColor: error ? '#fef2f2' : '#f5f3ff', border: `1px solid ${error ? '#fecaca' : '#ddd6fe'}` }}>
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7c3aed' }}>
                <RefreshCw size={20} className="spinner" /> <span>Đang kết nối AI...</span>
              </div>
            ) : error ? (
              <div style={{ color: '#ef4444', fontSize: '14px' }}>{error}</div>
            ) : (
              <div style={{ fontSize: '14px', color: '#1e293b', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {result}
                <button onClick={() => handleApply()} style={{ marginTop: '12px', width: '100%', padding: '10px', backgroundColor: '#7c3aed', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Áp dụng kết quả</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }
const contextBoxStyle: React.CSSProperties = { padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', fontSize: '14px', border: '1px solid #bbf7d0', minHeight: '60px', lineHeight: 1.5 }
const textareaStyle: React.CSSProperties = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', minHeight: '80px', resize: 'none', boxSizing: 'border-box' }
const actionBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#475569', transition: 'all 0.2s', fontWeight: 500 }
const sendBtnStyle: React.CSSProperties = { position: 'absolute', right: '10px', bottom: '10px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer' }
