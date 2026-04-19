import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { profile, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', marginTop: '40px' }}>
      <h1 style={{ color: '#16a34a', marginBottom: '10px' }}>مرحباً، {profile?.username || 'مستخدم'}</h1>
      <p style={{ fontSize: '16px', color: '#555', marginBottom: '10px' }}>
        {/* ✅ علامة ??. مهمة جداً هنا */}
        الدور: <strong>{profile?.role}</strong> | الحالة: 
        <strong style={{color: profile?.subscription_type === 'premium' ? '#16a34a' : '#666'}}>
          {profile?.subscription_type === 'premium' ? '⭐ بريميوم' : '🆓 مجاني'}
        </strong>
      </p>
      {profile?.subscription_type === 'premium' && profile?.subscription_expires_at && (
        <p style={{ fontSize: '14px', color: '#f59e0b', marginBottom: '20px' }}>ينتهي في: {new Date(profile.subscription_expires_at).toLocaleDateString('ar-EG')}</p>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
        {profile?.role === 'super_admin' && (
          <>
            <button onClick={() => navigate('/admin/users')} style={{ padding: '10px 20px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>👥 إدارة المستخدمين</button>
            <button onClick={() => navigate('/admin/premium')} style={{ padding: '10px 20px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>💳 إدارة القسائم والمحتوى</button>
          </>
        )}
        {profile?.role === 'instructor' && (
          <button onClick={() => navigate('/instructor/courses')} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>📚 إدارة دوراتي</button>
        )}
        {profile?.role === 'student' && (
          <button onClick={() => navigate('/student/courses')} style={{ padding: '10px 20px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>📖 تصفح الدورات</button>
        )}
        {profile?.role === 'student' && profile?.subscription_type !== 'premium' && (
          <button onClick={() => navigate('/student/redeem')} style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>🎟️ تفعيل قسيمة</button>
        )}
        <button onClick={() => navigate('/instructor/profile')} style={{ padding: '10px 20px', backgroundColor: '#6b7280', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>⚙️ الإعدادات</button>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>🚪 خروج</button>
      </div>
    </div>
  )
}
