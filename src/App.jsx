import './App.css'
import { Link } from 'react-router-dom'

function App() {

  return (
    <>
      <div>
        <h1>Main Page</h1>
        <Link to={"login"}> Login Page </Link>
        <Link to={"register"}> Register Page</Link>
      </div>
    </>
  )
}

export default App
