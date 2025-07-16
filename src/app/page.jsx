'use client';

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    // State `user` masih berguna untuk di-pass ke komponen anak
    const [user, setUser] = useState(null);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    // Kita tetap butuh data user, tapi tidak perlu loading state lagi
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();

        // Listener tetap berguna jika info user (misal email) diperbarui di tempat lain
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    if (!user) {
        return <div className="flex h-screen items-center justify-center">Memuat data pengguna...</div>;
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
                />
                <ChatArea user={user} activeChat={activeChat} />
            </div>
        </div>
    );
}