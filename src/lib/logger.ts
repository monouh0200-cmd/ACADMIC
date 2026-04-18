// src/lib/logger.ts
// ─────────────────────────────────────────────────────────────────────────────
// Structured logging + Sentry integration
//
// الاستخدام:
//   import { logger } from '@/lib/logger'
//   logger.error('login_failed', { email, reason: err.message })
//   logger.info('enrollment_success', { courseId })
// ─────────────────────────────────────────────────────────────────────────────

import * as Sentry from '@sentry/react'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type LogContext = Record<string, unknown>

function formatEntry(level: LogLevel, event: string, ctx?: LogContext) {
  return {
    ts:    new Date().toISOString(),
    level,
    event,
    ...ctx,
  }
}

function log(level: LogLevel, event: string, ctx?: LogContext) {
  const entry = formatEntry(level, event, ctx)

  // console output (structured JSON — سهل قراءته في Vercel/Netlify logs)
  const fn = level === 'error' ? console.error
           : level === 'warn'  ? console.warn
           : console.log

  fn(JSON.stringify(entry))

  // Sentry: ارسل الأخطاء والتحذيرات فقط
  if (level === 'error') {
    Sentry.captureException(
      ctx?.error instanceof Error ? ctx.error : new Error(event),
      { extra: ctx }
    )
  } else if (level === 'warn') {
    Sentry.captureMessage(event, { level: 'warning', extra: ctx })
  }
}

export const logger = {
  debug: (event: string, ctx?: LogContext) => log('debug', event, ctx),
  info:  (event: string, ctx?: LogContext) => log('info',  event, ctx),
  warn:  (event: string, ctx?: LogContext) => log('warn',  event, ctx),
  error: (event: string, ctx?: LogContext) => log('error', event, ctx),
}
