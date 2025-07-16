import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { createServerClient } from "@supabase/ssr";
import { createSupabaseServerClient } from "@/lib/cookieServer";

export async function POST() {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
}