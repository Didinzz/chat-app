'use client';

import { useEffect, useState } from 'react';
import ChatItem from './ChatItem';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import ConfirmationModal from './ConfrimationModal';

export default function Sidebar({ user, activeChat, setActiveChat, toggleDarkMode, isDarkMode, onlineUsers }) {
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();


    const handleLogoutClick = async () => {
        // Tampilkan modal konfirmasi logout
        setIsModalOpen(true);
    }

    const handleConfirmLogout = async () => {
        const { error } = await supabase.auth.signOut();

        setIsModalOpen(false);

        if (error) {
            console.error("Error during logout:", error.message);
        } else {
            router.push('/login'); // Redirect to login page after logout
        }
    }


    useEffect(() => {
        // Jangan lakukan fetch jika 'user' tidak ada
        if (!user) return;

        // ✅ Tambahkan AbortController untuk membatalkan fetch jika komponen unmount
        // atau jika 'user' berubah sebelum fetch selesai.
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [profileRes, chatsRes] = await Promise.all([
                    // Teruskan 'signal' ke setiap fetch
                    fetch('/api/profile', { cache: 'no-store', signal }),
                    fetch('/api/chats', { cache: 'no-store', signal })
                ]);

                if (!profileRes.ok || !chatsRes.ok) {
                    throw new Error(`Failed to fetch data: profile: ${profileRes.status} chats: ${chatsRes.status}`);
                }

                const profileData = await profileRes.json();
                const chatsData = await chatsRes.json();

                // ✅ Rapikan state profile dan pastikan chat list adalah array
                setUserProfile(profileData.profile);
                setChatList(Array.isArray(chatsData) ? chatsData : []);

            } catch (error) {
                // Jangan log error pembatalan
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error("Error fetching sidebar data:", error);
                    setChatList([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // ✅ Ini adalah cleanup function. Akan berjalan saat:
        // 1. Komponen di-unmount (dihapus dari layar).
        // 2. useEffect berjalan lagi karena 'user' berubah.
        return () => {
            controller.abort();
        };
    }, [user]);



    return (
        <div className="sidebar w-1/3 flex flex-col bg-sidebar-light dark:bg-sidebar-dark border-r border-border-light dark:border-border-dark transition-colors duration-300">
            {/* Profile Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between">
                <div className="flex items-center">
                    <div className="avatar w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold shadow-md">
                        {userProfile?.avatar_url ? (
                            <img src={userProfile?.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (userProfile?.username?.charAt(0).toUpperCase())}
                    </div>
                    <span className="ml-3 font-medium">{userProfile?.username}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light"></div>
                    </label>
                    <button onClick={handleLogoutClick} className="p-2 rounded-full hover:bg-indigo-400 transition cursor-pointer" title="Logout">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmLogout}
                title="Logout"
                message="Apakah Anda yakin ingin logout?"
                buttonText="Ya, Logout"
            />

            {/* Search Bar */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="relative">
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300"
                        placeholder="Cari atau mulai chat baru"
                    />
                </div>
            </div>


            {/* Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <p className='p-4 text-gray-500 dark:text-gray-400 text-center'>Memuat...</p>
                ) : (
                    chatList.map(chat => {
                        const isOnline = !!onlineUsers[chat.other_user_id];
                        return (
                            <ChatItem
                                key={chat.chat_id}
                                chat={chat}
                                isActive={activeChat?.id === chat.chat_id}
                                onClick={() => setActiveChat({
                                    id: chat.chat_id,
                                    name: chat.other_user_username,
                                    avatar_url: chat.other_user_avatar_url,
                                    other_user_id: chat.other_user_id
                                })}
                                isOnline={isOnline}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}