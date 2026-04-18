import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// ── Sentry — تفعّل فقط في production ─────────────────────────────────────
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn:              import.meta.env.VITE_SENTRY_DSN,
    environment:      import.meta.env.MODE,
    tracesSampleRate: 0.2,   // 20% من الـ transactions للـ performance monitoring
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText:   true,   // يخفي النصوص لحماية الخصوصية
        blockAllMedia: true,
      }),
    ],
  })
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
