import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  error: null,

  clearStore: () => set({ user: null, profile: null, error: null, isLoading: false }),

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      await supabase.auth.signOut()
      
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password })
      if (authErr) throw authErr

      const { data: rows, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()

      if (profileErr) throw profileErr
      const profile = rows ?? null

      if (!profile || profile.status !== 'approved') {
        await supabase.auth.signOut()
        return { success: false, message: profile ? 'حسابك قيد المراجعة' : 'الرجاء تفعيل الحساب' }
      }

      set({ user: data.user, profile, isLoading: false })
      return { success: true, message: '✅ تم تسجيل الدخول بنجاح' }
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
    try {
      set({ isLoading: true })
      const { data: { session }, error: sessionErr } = await supabase.auth.getSession()
      
      if (sessionErr || !session) {
        set({ user: null, profile: null, isLoading: false })
        return
      }

      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (profileErr || !profile) {
        await supabase.auth.signOut()
        set({ user: null, profile: null, isLoading: false })
        return
      }

      // ✅ تحديث الاشتراك محلياً فقط — الـ DB trigger يتولى التحديث الفعلي
      // (لا نستدعي .update() من العميل لأن الـ trigger يمنعه)
      let currentProfile = profile
      if (
        profile.subscription_expires_at &&
        new Date(profile.subscription_expires_at) < new Date() &&
        profile.subscription_type === 'premium'
      ) {
        currentProfile = {
          ...profile,
          subscription_type: 'free',
          payment_coupon: null,
          subscription_expires_at: null,
        }
      }

      set({ user: session.user, profile: currentProfile, isLoading: false })
    } catch (e) {
      set({ user: null, profile: null, isLoading: false })
    }
  }
}))
