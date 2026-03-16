import { Link } from 'react-router-dom'

type PageHeaderProps = {
  title: string
  subtitle?: string
  backTo?: string
  backLabel?: string
}

export const PageHeader = ({
  title,
  subtitle,
  backTo,
  backLabel = 'Quay lại',
}: PageHeaderProps) => {
  return (
    <>
      {backTo && (
        <Link to={backTo} className="page-ui__back-link">
          ← {backLabel}
        </Link>
      )}
      <header className="page-ui__header">
        <h1 className="page-ui__title">{title}</h1>
        {subtitle && <p className="page-ui__subtitle">{subtitle}</p>}
      </header>
    </>
  )
}
