import './NotFoundPage.css'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'

function NotFoundPage() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/`)
  }

  return (
    <>
      <div className='notfound__container'>
        <div className='notfound__error'>
          Not Found 404
          <br />
          처음부터 다시해주세요!
        </div>
      </div>
      <Button content='처음으로 가기' onClick={handleClick} />
    </>
  )
}
export default NotFoundPage
