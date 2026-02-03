import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './store/AuthContext.jsx'
// Clear corrupted localStorage on app start
import './utils/clearCorruptedStorage.js'

createRoot(document.getElementById('root')).render(
  // Temporarily disable StrictMode to debug infinite loop
  // <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  // </StrictMode>,
)
