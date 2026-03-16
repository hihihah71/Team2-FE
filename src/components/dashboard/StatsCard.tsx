type StatsCardProps = {
  label: string
  value: string | number
  accent?: 'blue' | 'green' | 'purple'
}

const accentColorMap = {
  blue: '#60a5fa',
  green: '#34d399',
  purple: '#a78bfa',
}

export const StatsCard = ({ label, value, accent = 'blue' }: StatsCardProps) => {
  return (
    <div className="page-ui__kpi-card">
      <p className="page-ui__kpi-label">{label}</p>
      <p className="page-ui__kpi-value" style={{ color: accentColorMap[accent] }}>
        {value}
      </p>
    </div>
  )
}
