import { createSupabaseServerClient } from "@/lib/cookieServer";
import { NextResponse } from 'next/server'; // Sebaiknya gunakan NextResponse untuk konsistensi

export async function GET() {
    const supabase = await createSupabaseServerClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { data, error } = await supabase.rpc('get_user_chats');
    if (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new NextResponse(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}