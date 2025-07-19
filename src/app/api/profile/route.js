import { createSupabaseServerClient } from "@/lib/cookieServer";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createSupabaseServerClient();

    // ✅ Gunakan getUser() yang lebih aman
    const { data: { user } } = await supabase.auth.getUser();

    // ✅ Cek 'user' bukan 'session'
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id) // ✅ Gunakan user.id
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data }, { status: 200 });
}