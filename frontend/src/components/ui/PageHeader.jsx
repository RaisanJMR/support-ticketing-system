import { BackButton } from '../BackButton'

function PageHeader({ title, subtitle, back, actions }) {
  return (
    <header className='page-header'>
      {back && <BackButton url={back.to} label={back.label} />}
      <div className='page-header-row'>
        <div className='page-header-text'>
          <h1 className='page-title'>{title}</h1>
          {subtitle && <p className='page-subtitle'>{subtitle}</p>}
        </div>
        {actions && <div className='page-header-actions'>{actions}</div>}
      </div>
    </header>
  )
}

export default PageHeader
