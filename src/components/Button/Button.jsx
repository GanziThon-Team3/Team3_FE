import './Button.css'
import { useNavigate } from 'react-router-dom'

export default function Button({ content, direction }) {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate({ direction })
  }

  return <button onClick={handleClick}>{content}</button>
}
