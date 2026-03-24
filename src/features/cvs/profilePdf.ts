import { jsPDF } from 'jspdf'
import type { ProfilePayload } from '../profile/profileService'

const MARGIN_MM = 14

function addParagraph(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeightMm: number,
): number {
  const lines = doc.splitTextToSize(text, maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineHeightMm
}

/**
 * Tạo PDF xem trước từ dữ liệu hồ sơ (ứng dụng nộp CV từ "Hồ sơ cá nhân").
 */
export function buildProfilePdfBlob(profile: Partial<ProfilePayload> | null | undefined): Blob {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' })
  const pi = (profile?.personalInfo || {}) as Record<string, unknown>
  const pageW = doc.internal.pageSize.getWidth() - MARGIN_MM * 2
  let y = 20

  doc.setFontSize(18)
  doc.text(String(pi.fullName || 'Hồ sơ cá nhân'), MARGIN_MM, y)
  y += 10

  doc.setFontSize(10)
  const meta = [pi.email, pi.phone, pi.address].filter(Boolean).map(String)
  if (meta.length) {
    y = addParagraph(doc, meta.join(' · '), MARGIN_MM, y, pageW, 5)
    y += 4
  }

  const summary = String(pi.summary || '').trim()
  if (summary) {
    doc.setFontSize(12)
    doc.text('Giới thiệu', MARGIN_MM, y)
    y += 6
    doc.setFontSize(10)
    y = addParagraph(doc, summary, MARGIN_MM, y, pageW, 5)
    y += 6
  }

  const skills = profile?.skills?.filter(Boolean) ?? []
  if (skills.length) {
    doc.setFontSize(12)
    doc.text('Kỹ năng', MARGIN_MM, y)
    y += 6
    doc.setFontSize(10)
    y = addParagraph(doc, skills.join(', '), MARGIN_MM, y, pageW, 5)
    y += 6
  }

  const experiences = (profile?.experiences || []) as Array<Record<string, unknown>>
  if (experiences.length) {
    doc.setFontSize(12)
    doc.text('Kinh nghiệm', MARGIN_MM, y)
    y += 8
    doc.setFontSize(10)
    for (const exp of experiences) {
      if (y > 275) {
        doc.addPage()
        y = 20
      }
      const title = String(exp.title || '')
      const company = String(exp.company || '')
      const date = String(exp.date || '')
      const head = [title, company].filter(Boolean).join(' — ')
      const line = date ? `${head} (${date})` : head
      if (line.trim()) {
        y = addParagraph(doc, line, MARGIN_MM, y, pageW, 5)
        y += 2
      }
      const desc = String(exp.desc || '').trim()
      if (desc) {
        y = addParagraph(doc, desc, MARGIN_MM, y, pageW, 4.5)
        y += 4
      }
    }
  }

  return doc.output('blob')
}
