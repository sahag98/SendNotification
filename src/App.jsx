import { useState } from 'react'
import './App.css'
import NotificationPage from './NotificationPage'

function App() {
  const [secretCode, setSecretCode] = useState('')
  const [accessGranted, setAccessGranted] = useState(false)

  return (
    <div className="App">
      {secretCode != import.meta.env.VITE_SECRET_KEY ?
        <form>
          <input type="password" placeholder='enter code' value={secretCode} onChange={(e) => setSecretCode(e.target.value)} />
        </form>
        :
        <NotificationPage />
      }

    </div>
  )
}

export default App
