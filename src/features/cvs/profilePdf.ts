import { jsPDF } from 'jspdf'
import type { ProfilePayload } from '../profile/profileService'

function toText(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function toStringList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)) : []
}

const COLORS = {
  primary: [55, 65, 81] as [number, number, number],
  accent: [79, 70, 229] as [number, number, number],
  accentLight: [99, 102, 241] as [number, number, number],
  text: [31, 41, 55] as [number, number, number],
  muted: [107, 114, 128] as [number, number, number],
  light: [156, 163, 175] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  sidebar: [30, 27, 75] as [number, number, number],
  sidebarText: [199, 210, 254] as [number, number, number],
  sidebarHeading: [255, 255, 255] as [number, number, number],
  skillBg: [67, 56, 202] as [number, number, number],
  divider: [229, 231, 235] as [number, number, number],
}

const PAGE_W = 595.28
const PAGE_H = 841.89
const SIDEBAR_W = 190
const MAIN_LEFT = SIDEBAR_W + 28
const MAIN_RIGHT = PAGE_W - 32
const MAIN_W = MAIN_RIGHT - MAIN_LEFT

export function buildProfilePdfBlob(profile: Partial<ProfilePayload>) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  const personalInfo = (profile.personalInfo || {}) as Record<string, unknown>
  const fullName = toText(personalInfo.fullName) || 'Ung vien'
  const email = toText(personalInfo.email)
  const phone = toText(personalInfo.phone)
  const address = toText(personalInfo.address)
  const role = toText(personalInfo.role)
  const summary = toText(personalInfo.summary)

  const skills = toStringList(profile.skills)
  const experiences = Array.isArray(profile.experiences) ? profile.experiences : []
  const educations = Array.isArray(profile.educations) ? profile.educations : []
  const projects = Array.isArray(profile.projects) ? profile.projects : []
  const languages = Array.isArray(profile.languages) ? profile.languages : []
  const certifications = Array.isArray(profile.certifications) ? profile.certifications : []
  const hobbies = toStringList(profile.hobbies)
  const socialLinks = (profile.socialLinks || {}) as Record<string, string>

  let sidebarY = 0
  let mainY = 0
  let currentPage = 1

  const checkPageBreak = (needed: number) => {
    if (mainY + needed > PAGE_H - 40) {
      doc.addPage()
      currentPage++
      drawSidebarBg()
      mainY = 36
      sidebarY = 36
    }
  }

  const drawSidebarBg = () => {
    doc.setFillColor(...COLORS.sidebar)
    doc.rect(0, 0, SIDEBAR_W, PAGE_H, 'F')
  }

  // ────── Sidebar background ──────
  drawSidebarBg()

  // ────── Sidebar: Header area (name + role) ──────
  const sLeft = 20
  const sRight = SIDEBAR_W - 16
  const sWidth = sRight - sLeft
  sidebarY = 40

  // Accent bar top
  doc.setFillColor(...COLORS.accentLight)
  doc.rect(0, 0, SIDEBAR_W, 6, 'F')

  // Name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.setTextColor(...COLORS.sidebarHeading)
  const nameLines = doc.splitTextToSize(fullName, sWidth)
  nameLines.forEach((line: string) => {
    doc.text(line, sLeft, sidebarY)
    sidebarY += 20
  })
  sidebarY += 2

  // Role
  if (role) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...COLORS.accentLight)
    const roleLines = doc.splitTextToSize(role.toUpperCase(), sWidth)
    roleLines.forEach((line: string) => {
      doc.text(line, sLeft, sidebarY)
      sidebarY += 12
    })
  }
  sidebarY += 14

  // Divider
  const drawSidebarDivider = () => {
    doc.setDrawColor(80, 70, 180)
    doc.setLineWidth(0.5)
    doc.line(sLeft, sidebarY, sRight, sidebarY)
    sidebarY += 12
  }

  const drawSidebarSection = (title: string) => {
    drawSidebarDivider()
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...COLORS.sidebarHeading)
    doc.text(title.toUpperCase(), sLeft, sidebarY)
    sidebarY += 14
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...COLORS.sidebarText)
  }

  const drawSidebarText = (text: string) => {
    const lines = doc.splitTextToSize(text, sWidth)
    lines.forEach((line: string) => {
      if (sidebarY > PAGE_H - 30) return
      doc.text(line, sLeft, sidebarY)
      sidebarY += 12
    })
  }

  // ────── Sidebar: Contact ──────
  drawSidebarSection('Lien he')
  if (email) {
    doc.setFontSize(7.5)
    doc.setTextColor(...COLORS.light)
    doc.text('EMAIL', sLeft, sidebarY)
    sidebarY += 10
    doc.setFontSize(8.5)
    doc.setTextColor(...COLORS.sidebarText)
    drawSidebarText(email)
    sidebarY += 4
  }
  if (phone) {
    doc.setFontSize(7.5)
    doc.setTextColor(...COLORS.light)
    doc.text('DIEN THOAI', sLeft, sidebarY)
    sidebarY += 10
    doc.setFontSize(8.5)
    doc.setTextColor(...COLORS.sidebarText)
    doc.text(phone, sLeft, sidebarY)
    sidebarY += 14
  }
  if (address) {
    doc.setFontSize(7.5)
    doc.setTextColor(...COLORS.light)
    doc.text('DIA CHI', sLeft, sidebarY)
    sidebarY += 10
    doc.setFontSize(8.5)
    doc.setTextColor(...COLORS.sidebarText)
    drawSidebarText(address)
    sidebarY += 4
  }
  sidebarY += 4

  // ────── Sidebar: Skills ──────
  if (skills.length) {
    drawSidebarSection('Ky nang')
    skills.forEach((skill) => {
      if (sidebarY > PAGE_H - 30) return
      doc.setFillColor(...COLORS.skillBg)
      const tw = doc.getTextWidth(skill) + 12
      doc.roundedRect(sLeft, sidebarY - 8, Math.min(tw, sWidth), 14, 3, 3, 'F')
      doc.setFontSize(7.5)
      doc.setTextColor(...COLORS.white)
      doc.text(skill, sLeft + 6, sidebarY)
      sidebarY += 18
    })
    sidebarY += 4
  }

  // ────── Sidebar: Languages ──────
  if (languages.length) {
    drawSidebarSection('Ngoai ngu')
    languages.forEach((lang) => {
      if (sidebarY > PAGE_H - 30) return
      const item = lang as Record<string, unknown>
      const name = toText(item.name)
      const level = toText(item.level)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.setTextColor(...COLORS.sidebarHeading)
      doc.text(name, sLeft, sidebarY)
      sidebarY += 11
      if (level) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...COLORS.sidebarText)
        doc.text(level, sLeft, sidebarY)
        sidebarY += 11
      }
      sidebarY += 4
    })
  }

  // ────── Sidebar: Links ──────
  const links = [
    socialLinks.github && `GitHub: ${socialLinks.github}`,
    socialLinks.linkedin && `LinkedIn: ${socialLinks.linkedin}`,
    socialLinks.portfolio && `Web: ${socialLinks.portfolio}`,
  ].filter(Boolean) as string[]

  if (links.length) {
    drawSidebarSection('Lien ket')
    doc.setFontSize(7.5)
    links.forEach((link) => {
      if (sidebarY > PAGE_H - 30) return
      doc.setTextColor(...COLORS.accentLight)
      const lines = doc.splitTextToSize(link, sWidth)
      lines.forEach((line: string) => {
        doc.text(line, sLeft, sidebarY)
        sidebarY += 10
      })
      sidebarY += 4
    })
  }

  // ────── Sidebar: Hobbies ──────
  if (hobbies.length) {
    drawSidebarSection('So thich')
    doc.setFontSize(8.5)
    doc.setTextColor(...COLORS.sidebarText)
    drawSidebarText(hobbies.join(', '))
  }

  // ══════════════════════════════════════
  // ────── Main content area ──────
  // ══════════════════════════════════════
  mainY = 40

  // Accent bar across top of main area
  doc.setFillColor(...COLORS.accentLight)
  doc.rect(SIDEBAR_W, 0, PAGE_W - SIDEBAR_W, 6, 'F')

  const drawMainSection = (title: string) => {
    checkPageBreak(36)
    // Section title with accent underline
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...COLORS.accent)
    doc.text(title.toUpperCase(), MAIN_LEFT, mainY)
    mainY += 4
    doc.setDrawColor(...COLORS.accentLight)
    doc.setLineWidth(1.5)
    doc.line(MAIN_LEFT, mainY, MAIN_LEFT + 40, mainY)
    doc.setDrawColor(...COLORS.divider)
    doc.setLineWidth(0.3)
    doc.line(MAIN_LEFT + 42, mainY, MAIN_RIGHT, mainY)
    mainY += 14
  }

  const drawMainText = (text: string, fontSize = 9.5, color = COLORS.text) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(fontSize)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, MAIN_W)
    lines.forEach((line: string) => {
      checkPageBreak(14)
      doc.text(line, MAIN_LEFT, mainY)
      mainY += 13
    })
  }

  // ────── Summary ──────
  if (summary) {
    drawMainSection('Gioi thieu')
    drawMainText(summary, 9.5, COLORS.muted)
    mainY += 10
  }

  // ────── Experience ──────
  if (experiences.length) {
    drawMainSection('Kinh nghiem lam viec')
    experiences.forEach((exp) => {
      const item = exp as Record<string, unknown>
      const title = toText(item.title)
      const company = toText(item.company)
      const date = toText(item.date)
      const desc = toText(item.desc)

      checkPageBreak(40)

      // Title row
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(...COLORS.text)
      doc.text(title || '-', MAIN_LEFT, mainY)

      // Date on the right
      if (date) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...COLORS.accentLight)
        doc.text(date, MAIN_RIGHT, mainY, { align: 'right' })
      }
      mainY += 14

      // Company
      if (company) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(9)
        doc.setTextColor(...COLORS.muted)
        doc.text(company, MAIN_LEFT, mainY)
        mainY += 13
      }

      // Description
      if (desc) {
        drawMainText(desc, 9, COLORS.muted)
      }
      mainY += 8
    })
  }

  // ────── Education ──────
  if (educations.length) {
    drawMainSection('Hoc van')
    educations.forEach((edu) => {
      const item = edu as Record<string, unknown>
      const title = toText(item.title)
      const school = toText(item.school)
      const date = toText(item.date)
      const desc = toText(item.desc)

      checkPageBreak(36)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(...COLORS.text)
      doc.text(title || '-', MAIN_LEFT, mainY)

      if (date) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...COLORS.accentLight)
        doc.text(date, MAIN_RIGHT, mainY, { align: 'right' })
      }
      mainY += 14

      if (school) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(9)
        doc.setTextColor(...COLORS.muted)
        doc.text(school, MAIN_LEFT, mainY)
        mainY += 13
      }

      if (desc) {
        drawMainText(desc, 9, COLORS.muted)
      }
      mainY += 8
    })
  }

  // ────── Projects ──────
  if (projects.length) {
    drawMainSection('Du an noi bat')
    projects.forEach((project) => {
      const item = project as Record<string, unknown>
      const name = toText(item.name)
      const date = toText(item.date)
      const roleStr = toText(item.role)
      const tech = toText(item.technologies)
      const desc = toText(item.desc)
      const link = toText(item.link)

      checkPageBreak(36)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(...COLORS.text)
      doc.text(name || '-', MAIN_LEFT, mainY)

      if (date) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...COLORS.accentLight)
        doc.text(date, MAIN_RIGHT, mainY, { align: 'right' })
      }
      mainY += 14

      if (roleStr) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(9)
        doc.setTextColor(...COLORS.muted)
        doc.text(roleStr, MAIN_LEFT, mainY)
        mainY += 13
      }

      if (tech) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...COLORS.accentLight)
        doc.text(`Tech: ${tech}`, MAIN_LEFT, mainY)
        mainY += 12
      }

      if (desc) {
        drawMainText(desc, 9, COLORS.muted)
      }

      if (link) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...COLORS.accentLight)
        doc.text(link, MAIN_LEFT, mainY)
        mainY += 12
      }
      mainY += 8
    })
  }

  // ────── Certifications ──────
  if (certifications.length) {
    drawMainSection('Chung chi & Giai thuong')
    certifications.forEach((cert) => {
      const item = cert as Record<string, unknown>
      const name = toText(item.name)
      const org = toText(item.organization)
      const date = toText(item.date)

      checkPageBreak(24)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(...COLORS.text)
      doc.text(name || '-', MAIN_LEFT, mainY)

      if (date) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...COLORS.accentLight)
        doc.text(date, MAIN_RIGHT, mainY, { align: 'right' })
      }
      mainY += 13

      if (org) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(8.5)
        doc.setTextColor(...COLORS.muted)
        doc.text(org, MAIN_LEFT, mainY)
        mainY += 13
      }
      mainY += 4
    })
  }

  return doc.output('blob')
}

export function buildProfilePdfFile(profile: Partial<ProfilePayload>, fileName = 'CV_Profile_Auto.pdf') {
  const blob = buildProfilePdfBlob(profile)
  return new File([blob], fileName, { type: 'application/pdf' })
}
