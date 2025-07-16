import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    // Buat response yang bisa dimodifikasi nanti
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Buat Supabase client yang bisa berinteraksi dengan cookies
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                // ✅ Versi yang lebih sederhana dan tepat
                get(name) {
                    return request.cookies.get(name)?.value;
                },
                set(name, value, options) {
                    // Jika `set` dipanggil, kita modifikasi cookies di response
                    response.cookies.set({ name, value, ...options });
                },
                remove(name, options) {
                    // Jika `remove` dipanggil, kita hapus cookie di response
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    // 🛡️ LOGIKA INTI MIDDLEWARE 🛡️

    // Mengambil data pengguna, bukan sesi. Ini lebih ringkas.
    const { data: { user } } = await supabase.auth.getUser();
    const { pathname } = request.nextUrl;

    // Definisikan rute publik (tidak perlu login)
    const publicRoutes = ['/login', '/register'];

    // 1. Jika pengguna BELUM LOGIN dan mencoba akses halaman SELAIN rute publik
    if (!user && !publicRoutes.includes(pathname)) {
        // Alihkan ke halaman login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Jika pengguna SUDAH LOGIN dan mencoba akses rute publik
    if (user && publicRoutes.includes(pathname)) {
        // Alihkan ke halaman utama
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Jika tidak masuk kondisi di atas, lanjutkan ke tujuan
    return response;
}

// Konfigurasi matcher untuk menentukan rute mana yang akan dijalankan oleh middleware
export const config = {
    matcher: [
        /*
         * Cocokkan semua path KECUALI yang dimulai dengan:
         * - api (rute API)
         * - _next/static (file statis)
         * - _next/image (file optimasi gambar)
         * - favicon.ico (file favicon)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};