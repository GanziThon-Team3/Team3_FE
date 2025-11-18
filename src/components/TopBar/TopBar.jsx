import './TopBar.css'
import { useNavigate } from 'react-router-dom'

export default function TopBar({ title }) {
  const navigate = useNavigate()
  const isHome = title === '홈화면' ? true : false
  const arrow = '<'

  const handlePrev = () => {
    navigate(-1)
  }

  return (
    <header className='topbar'>
      {!isHome && (
        <button className='topbar__button-prev' onClick={handlePrev}>
          {arrow}
        </button>
      )}
      <h1 className='topbar__title'>{title}</h1>
    </header>
  )
}
