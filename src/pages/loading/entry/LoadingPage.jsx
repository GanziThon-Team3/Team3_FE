import { Icon } from '../../../components/Icon/Icon'
import './LoadingPage.css'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function LoadingPage() {
  // 3초 후 자동으로 페이지 넘김
  const LOADING_DELAY = 3000

  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/result`)
    }, LOADING_DELAY)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className='loading__container'>
      <div className='loading__loader--container'>
        <div class='loading__loader'></div>
      </div>
      <div className='loading__text'>
        <p className='loading__text--AI'>AI가 분석하고 있어요</p>
        <p className='loading__text--wait'>잠시만 기다려주세요!</p>
      </div>
      <Icon
        name='logo-background-light'
        width={630}
        height={630}
        className='loading__container loading__background--logo'
      />
    </div>
  )
}

export default LoadingPage
