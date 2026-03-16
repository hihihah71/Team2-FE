import type { ApplicationStatus, JobStatus } from '../../types/domain'

type StatusBadgeProps = {
  status: ApplicationStatus | JobStatus | string
}

const statusStyleMap: Record<string, { color: string; border: string; bg: string }> = {
  pending: { color: '#93c5fd', border: 'rgba(59,130,246,0.5)', bg: 'rgba(59,130,246,0.12)' },
  shortlisted: { color: '#34d399', border: 'rgba(52,211,153,0.5)', bg: 'rgba(52,211,153,0.12)' },
  interview: { color: '#c084fc', border: 'rgba(192,132,252,0.5)', bg: 'rgba(192,132,252,0.12)' },
  rejected: { color: '#f87171', border: 'rgba(248,113,113,0.5)', bg: 'rgba(248,113,113,0.12)' },
  offered: { color: '#22c55e', border: 'rgba(34,197,94,0.5)', bg: 'rgba(34,197,94,0.12)' },
  open: { color: '#34d399', border: 'rgba(52,211,153,0.5)', bg: 'rgba(52,211,153,0.12)' },
  draft: { color: '#cbd5e1', border: 'rgba(148,163,184,0.5)', bg: 'rgba(148,163,184,0.12)' },
  closed: { color: '#f87171', border: 'rgba(248,113,113,0.5)', bg: 'rgba(248,113,113,0.12)' },
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const style = statusStyleMap[status] || {
    color: '#cbd5e1',
    border: 'rgba(148,163,184,0.5)',
    bg: 'rgba(148,163,184,0.12)',
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
        fontSize: '12px',
        padding: '4px 8px',
        borderRadius: '999px',
        border: `1px solid ${style.border}`,
        color: style.color,
        backgroundColor: style.bg,
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  )
}
