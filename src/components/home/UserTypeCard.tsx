import { Link } from 'react-router-dom'

type UserTypeCardProps = {
  title: string
  description: string
  bullets: string[]
  buttonText: string
  buttonLink?: string
  onButtonClick?: () => void
  variant: 'student' | 'recruiter'
}

const UserTypeCard = ({
  title,
  description,
  bullets,
  buttonText,
  buttonLink,
  onButtonClick,
  variant,
}: UserTypeCardProps) => {
  const isStudent = variant === 'student'

  const background =
    variant === 'student'
      ? 'radial-gradient(circle at top left, rgba(59,130,246,0.24), transparent), #020617'
      : 'radial-gradient(circle at top right, rgba(16,185,129,0.24), transparent), #020617'

  const border =
    variant === 'student'
      ? '1px solid rgba(59,130,246,0.4)'
      : '1px solid rgba(34,197,94,0.4)'

  const buttonBackground = isStudent
    ? 'linear-gradient(135deg, rgba(59,130,246,1), rgba(129,140,248,1))'
    : 'linear-gradient(135deg, rgba(34,197,94,1), rgba(45,212,191,1))'

  const buttonColor = isStudent ? '#f9fafb' : '#022c22'

  return (
    <section
      style={{
        borderRadius: '12px',
        padding: '20px',
        background,
        border,
      }}
    >
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '8px',
        }}
      >
        {title}
      </h2>
      <p style={{ color: '#9ca3af', marginBottom: '16px' }}>{description}</p>
      <ul
        style={{
          marginBottom: '16px',
          paddingLeft: '18px',
          color: '#9ca3af',
          fontSize: '14px',
        }}
      >
        {bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {onButtonClick ? (
        <button
          type="button"
          onClick={onButtonClick}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 18px',
            borderRadius: '999px',
            background: buttonBackground,
            color: buttonColor,
            fontWeight: 600,
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {buttonText}
        </button>
      ) : (
        <Link
          to={buttonLink ?? '#'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 18px',
            borderRadius: '999px',
            background: buttonBackground,
            color: buttonColor,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          {buttonText}
        </Link>
      )}
    </section>
  )
}

export default UserTypeCard

