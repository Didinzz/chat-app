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

    const { data, error } = await supabase.rpc('get_user_chats');
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ✅ Gunakan NextResponse.json untuk konsistensi
    return NextResponse.json(data, { status: 200 });
}