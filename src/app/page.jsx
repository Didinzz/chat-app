'use client';

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState({});

    // useEffect untuk mengelola sesi autentikasi
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );
        return () => authListener.subscription.unsubscribe();
    }, []);

    // useEffect untuk mengelola status online (Presence)
    useEffect(() => {
        if (!user) return;

        const channel = supabase.channel('online-status', {
            config: { presence: { key: user.id } },
        });

        channel.on('presence', { event: 'sync' }, () => {
            const newState = channel.presenceState();
            setOnlineUsers(newState);
        });

        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({ online_at: new Date().toISOString() });
                await supabase.rpc('update_last_seen');
            }
        });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Memuat...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="chat-container flex rounded-xl overflow-hidden shadow-xl">
                <Sidebar
                    user={user}
                    activeChat={activeChat}
                    setActiveChat={setActiveChat}
                    toggleDarkMode={toggleDarkMode}
                    isDarkMode={isDarkMode}
                    onlineUsers={onlineUsers}
                />
                <ChatArea
                    user={user}
                    activeChat={activeChat}
                    onlineUsers={onlineUsers}
                />
            </div>
        </div>
    );
}