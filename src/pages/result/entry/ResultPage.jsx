import { useNavigate } from 'react-router-dom'
import Button from '../../../components/Button/Button'

function ResultPage() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/upload`)
  }
  return (
    <>
      <div>결과창입니다.</div>
      <Button content='결과보기' onClick={handleClick} />
    </>
  )
}

export default ResultPage
