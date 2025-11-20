import { Icon } from '../Icon/Icon'
import './TopBar.css'
import { useNavigate } from 'react-router-dom'

export default function TopBar({ title }) {
  const navigate = useNavigate()

  const handlePrev = () => {
    navigate(-1)
  }

  return (
    <header className='topbar'>
      <Icon
        name='topbar-button-prev'
        width={38}
        height={35}
        className='topbar__button-prev'
        onClick={handlePrev}
      />
      <h1 className='topbar__title'>{title}</h1>
    </header>
  )
}
