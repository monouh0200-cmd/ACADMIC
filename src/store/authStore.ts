import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  profile: null, // تهيئة بـ null لتجنب undefined
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password })
      if (authErr) throw authErr

      const { data: rows, error: profileErr } = await supabase
        .from('profiles')
        .select('id, username, role, status, specialization, subscription_type, subscription_expires_at')
        .eq('id', data.user.id)
        .limit(1)

      const profile = rows?.[0] || null

      if (!profile || profile.status !== 'approved') {
        await supabase.auth.signOut()
        set({ isLoading: false })
        return { success: false, message: profile?.status === 'pending' ? 'حسابك قيد المراجعة' : 'الرجاء تفعيل الحساب' }
      }

      set({ user: data.user, profile, isLoading: false })
      return { success: true, message: '✅ تم تسجيل الدخول' }
    } catch (err: any) {
      set({ isLoading: false, error: err.message })
      return { success: false, message: err.message }
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null, error: null, isLoading: false })
  },

  checkSession: async () => {
    set({ isLoading: true })
    try {
      const {  { session }, error: sessionErr } = await supabase.auth.getSession()
      
      if (sessionErr || !session) {
        set({ user: null, profile: null, isLoading: false })
        return
      }

      const {  rows } = await supabase
        .from('profiles')
        .select('id, username, role, status, specialization, subscription_type, subscription_expires_at')
        .eq('id', session.user.id)
        .limit(1)

      const profile = rows?.[0] || null
      set({ user: session.user, profile, isLoading: false })
    } catch (e) {
      console.error('Session check failed:', e)
      set({ user: null, profile: null, isLoading: false })
    }
  }
}))
