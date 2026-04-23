import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getAccessToken = async (): Promise<string | null> => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  // Proactively refresh if token expires within 60s
  const expiresAt = session.expires_at ?? 0;
  if (expiresAt * 1000 - Date.now() < 60_000) {
    const { data: { session: refreshed }, error: refreshError } =
      await supabase.auth.refreshSession();

    if (refreshError || !refreshed) {
      await supabase.auth.signOut();
      return null;
    }

    return refreshed.access_token;
  }

  return session.access_token;
};
