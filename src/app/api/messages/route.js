import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Pastikan path ini benar

// Handler untuk GET request: Mengambil pesan
export async function GET(request) {
    // Mengambil chat_id dari query parameter URL
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chat_id');

    if (!chatId) {
        return NextResponse.json({ error: 'chat_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('API Error fetching messages:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// Handler untuk POST request: Mengirim pesan baru
export async function POST(request) {
    const newMessage = await request.json();

    if (!newMessage || !newMessage.text || !newMessage.chat_id || !newMessage.sender_id) {
        return NextResponse.json({ error: 'Invalid message data' }, { status: 400 });
    }
    const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select() // Mengembalikan data yang baru saja dimasukkan
        .single();

    if (error) {
        console.error('API Error sending message:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}