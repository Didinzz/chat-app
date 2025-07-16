// src/app/api/auth/login/route.js
import { createSupabaseServerClient } from '@/lib/cookieServer';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { email, password } = await request.json();

    const supabase = await createSupabaseServerClient(); // ✅ pakai await

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login successful', user: data.user });
}
