import { useState } from 'react'
import './App.css'
import NotificationPage from './NotificationPage'

function App() {
  const [secretCode, setSecretCode] = useState('')
  const [accessGranted, setAccessGranted] = useState(false)

  function handleSecret() {
    if (secretCode == import.meta.env.VITE_SECRET_KEY) {
      setAccessGranted(true)
    }
  }
  return (
    <div className="App">
      {!accessGranted ?
        <form onSubmit={handleSecret}>
          <input type="password" placeholder='enter code' value={secretCode} onChange={(e) => setSecretCode(e.target.value)} />
          <button type='submit'>Enter</button>
        </form>
        :
        <NotificationPage />
      }

    </div>
  )
}

export default App
