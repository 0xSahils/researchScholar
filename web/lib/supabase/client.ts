import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Supabase new projects use NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (previously ANON_KEY)
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser-safe client — uses publishable/anon key
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
