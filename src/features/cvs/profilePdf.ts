import { jsPDF } from 'jspdf'
import type { ProfilePayload } from '../profile/profileService'

function toText(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function toStringList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)) : []
}

export function buildProfilePdfBlob(profile: Partial<ProfilePayload>) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const left = 40
  const right = pageWidth - 40
  const lineHeight = 18
  let y = 46

  const personalInfo = (profile.personalInfo || {}) as Record<string, unknown>
  const fullName = toText(personalInfo.fullName) || 'Ung vien'
  const email = toText(personalInfo.email)
  const phone = toText(personalInfo.phone)
  const address = toText(personalInfo.address)
  const summary = toText(personalInfo.summary)

  const skills = toStringList(profile.skills)
  const experiences = Array.isArray(profile.experiences)
    ? profile.experiences
    : []
  const educations = Array.isArray(profile.educations) ? profile.educations : []
  const projects = Array.isArray(profile.projects) ? profile.projects : []

  const drawSectionTitle = (title: string) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(title, left, y)
    y += lineHeight
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
  }

  const drawWrapped = (text: string) => {
    const lines = doc.splitTextToSize(text || '-', right - left)
    lines.forEach((line: string) => {
      if (y > 790) {
        doc.addPage()
        y = 46
      }
      doc.text(line, left, y)
      y += 15
    })
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(fullName, left, y)
  y += 24
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  drawWrapped([email, phone, address].filter(Boolean).join(' | ') || '-')
  y += 8

  drawSectionTitle('Summary')
  drawWrapped(summary || 'Chua cap nhat')
  y += 8

  drawSectionTitle('Skills')
  drawWrapped(skills.length ? skills.join(', ') : 'Chua cap nhat')
  y += 8

  drawSectionTitle('Experience')
  experiences.forEach((exp) => {
    const item = exp as Record<string, unknown>
    const line = `${toText(item.title)} - ${toText(item.company)} (${toText(item.date)})`
    drawWrapped(line.trim() || '-')
    drawWrapped(toText(item.desc) || '')
    y += 6
  })
  if (!experiences.length) drawWrapped('Chua cap nhat')
  y += 8

  drawSectionTitle('Education')
  educations.forEach((edu) => {
    const item = edu as Record<string, unknown>
    const line = `${toText(item.title)} - ${toText(item.school)} (${toText(item.date)})`
    drawWrapped(line.trim() || '-')
    drawWrapped(toText(item.desc) || '')
    y += 6
  })
  if (!educations.length) drawWrapped('Chua cap nhat')
  y += 8

  drawSectionTitle('Projects')
  projects.forEach((project) => {
    const item = project as Record<string, unknown>
    drawWrapped(`${toText(item.name)} (${toText(item.date)})`)
    drawWrapped(toText(item.desc) || '')
    y += 6
  })
  if (!projects.length) drawWrapped('Chua cap nhat')

  return doc.output('blob')
}

export function buildProfilePdfFile(profile: Partial<ProfilePayload>, fileName = 'CV_Profile_Auto.pdf') {
  const blob = buildProfilePdfBlob(profile)
  return new File([blob], fileName, { type: 'application/pdf' })
}
