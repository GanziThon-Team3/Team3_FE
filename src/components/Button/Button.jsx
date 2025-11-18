import './Button.css'

export default function Button({ content, onClick }) {
  return <button onClick={onClick}>{content}</button>
}
