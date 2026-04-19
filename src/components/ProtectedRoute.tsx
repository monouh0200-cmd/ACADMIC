import { useAuthStore } from '../store/authStore'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, profile, isLoading } = useAuthStore()

  // 1. إظهار تحميل أثناء التحقق من الجلسة
  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>جاري التحقق من الجلسة...</div>
  }

  // 2. إذا لم يكن هناك مستخدم، توجيه للدخول
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 3. إذا كان البروفايل غير موجود (لم يتم تحميله)، ننتظر أو نعيد التوجيه
  if (!profile) {
    return <Navigate to="/login" replace />
  }

  // 4. التحقق من حالة الحساب (مقبول أو قيد المراجعة)
  if (profile.status !== 'approved') {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>⚠️ حسابك قيد المراجعة من قبل المشرف.</div>
  }

  return children
}
