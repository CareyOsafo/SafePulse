import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      loading: true,

      setSession: (session) => set({ session, loading: false }),

      initialize: async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error || !session) {
            set({ session: null, loading: false });
            return;
          }

          // Verify the session is still usable by attempting a refresh
          const { data: { session: refreshed }, error: refreshError } =
            await supabase.auth.refreshSession();

          if (refreshError || !refreshed) {
            // Refresh token is invalid — clear everything
            await supabase.auth.signOut();
            set({ session: null, loading: false });
            return;
          }

          set({ session: refreshed, loading: false });
        } catch {
          set({ session: null, loading: false });
        }

        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_OUT') {
            set({ session: null });
          } else if (session) {
            set({ session });
          }
        });
      },

      signOut: async () => {
        await supabase.auth.signOut();
        set({ session: null });
      },
    }),
    {
      name: 'safepulse-auth',
      partialize: (state) => ({ session: state.session }),
    },
  ),
);

// Initialize on import
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}
