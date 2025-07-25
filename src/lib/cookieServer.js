// src/lib/cookieServer.js
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
    const cookieStore = await cookies(); // ✅ HARUS pakai await

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value;
                },
                set(name, value, options) {
                    cookieStore.set(name, value, options);
                },
                remove(name, options) {
                    cookieStore.set(name, '', options);
                }
            }
        }
    );
}
