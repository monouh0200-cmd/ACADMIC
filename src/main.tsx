import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// تسجيل أخطاء عالمية للتشخيص
window.addEventListener('error', (e) => {
  console.error('💥 Global Error:', e.message, 'at', e.filename + ':' + e.lineno)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('💥 Unhandled Promise:', e.reason)
})

console.log('🚀 App starting...')
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? '✓ Loaded' : '✗ Missing')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
