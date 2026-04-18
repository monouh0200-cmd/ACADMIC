import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// Sentry: تحميل اختياري — لن يؤثر على بدء التطبيق أبداً
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn:              import.meta.env.VITE_SENTRY_DSN,
      environment:      import.meta.env.MODE,
      tracesSampleRate: 0.1,
    })
  }).catch(() => { /* Sentry غير متاح — لا مشكلة */ })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
