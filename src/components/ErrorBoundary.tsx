import { Component, ReactNode } from 'react'
import * as Sentry from '@sentry/react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { logger } from '../lib/logger'

interface Props  { children: ReactNode }
interface State  { hasError: boolean; eventId: string | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, eventId: null }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Sentry + structured log في نفس الوقت
    const eventId = Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
    this.setState({ eventId })
    logger.error('ui_crash', { error, componentStack: info.componentStack, sentryEventId: eventId })
  }

  handleReload = () => window.location.reload()
  handleHome   = () => { window.location.href = '/dashboard' }

  handleReport = () => {
    if (this.state.eventId) {
      Sentry.showReportDialog({ eventId: this.state.eventId })
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'var(--bg-app, #f8fafc)' }}
        dir="rtl"
      >
        <div className="max-w-sm w-full bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden text-center">
          <div className="bg-red-50 p-10">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black text-slate-800 mb-2">حدث خطأ غير متوقع</h1>
            <p className="text-slate-500 text-sm">
              حدث عطل في هذا الجزء من التطبيق. تم تسجيل المشكلة تلقائياً.
            </p>
            {this.state.eventId && (
              <p className="mt-2 text-xs text-slate-400 font-mono">
                ID: {this.state.eventId.slice(0, 8)}
              </p>
            )}
          </div>
          <div className="p-6 space-y-2">
            <button
              onClick={this.handleReload}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-xl font-bold"
            >
              <RefreshCw className="w-4 h-4" /> إعادة تحميل
            </button>
            <button
              onClick={this.handleHome}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm"
            >
              <Home className="w-4 h-4" /> لوحة التحكم
            </button>
            {this.state.eventId && (
              <button
                onClick={this.handleReport}
                className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                الإبلاغ عن المشكلة
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
}
