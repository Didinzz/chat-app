// app/components/ChatArea.js
'use client';

import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { supabase } from '@/lib/supabaseClient';


export default function ChatArea({ activeChat, user, onlineUsers }) {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 1. EFEK UNTUK MENGAMBIL PESAN AWAL (MELALUI API ROUTE)
    useEffect(() => {
        if (activeChat) {
            const getMessages = async () => {
                try {
                    const response = await fetch(`/api/messages?chat_id=${activeChat.id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch messages');
                    }
                    const data = await response.json();
                    setMessages(data);
                } catch (error) {
                    console.error(error);
                }
            };
            setMessages([]); // Kosongkan pesan saat chat berubah
            getMessages();
        } else {
            setMessages([]); // Kosongkan pesan jika tidak ada chat aktif
        }
    }, [activeChat]);

    // 2. EFEK UNTUK REAL-TIME SUBSCRIPTION (TETAP DI CLIENT)
    useEffect(() => {
        if (!activeChat) return;

        const channel = supabase
            .channel(`chat_${activeChat.id}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${activeChat.id}` },
                (payload) => {
                    // Cek agar tidak ada duplikasi pesan dari post dan subscription
                    setMessages(prevMessages =>
                        prevMessages.find(msg => msg.id === payload.new.id)
                            ? prevMessages
                            : [...prevMessages, payload.new]
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeChat]);

    useEffect(scrollToBottom, [messages]);

    // 3. FUNGSI UNTUK MENGIRIM PESAN (MELALUI API ROUTE)
    const handleSendMessage = async () => {
        // Pastikan pengguna dan chat aktif ada
        if (inputValue.trim() && activeChat && user) {
            const newMessage = {
                text: inputValue,
                chat_id: activeChat.id,
                sender_id: user.id // Gunakan ID pengguna yang sedang login
            };
            setInputValue('');

            try {
                // Panggil API route untuk mengirim pesan
                await fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newMessage),
                });
            } catch (error) {
                console.error('Error sending message:', error);
                setInputValue(newMessage.text);
            }
        }
    };

    if (!activeChat) {
        return (
            <div className="w-2/3 flex flex-col items-center justify-center bg-gray-100 dark:bg-bg-dark text-gray-500 dark:text-gray-400">
                Pilih chat untuk memulai percakapan
            </div>
        );
    }

    const isPeerOnline = !!onlineUsers[activeChat.other_user_id];

    return (
        <div className="w-2/3 flex flex-col bg-white dark:bg-gray-800 transition-colors duration-300">
            {/* Chat Header */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-border-light dark:border-border-dark flex items-center justify-between shadow-sm transition-colors duration-300">
                <div className="flex items-center">
                    <div className={`avatar w-10 h-10 rounded-full flex items-center justify-center text-indigo-600 dark:text-white font-medium shadow-md`}>
                        {activeChat?.avatar_url ? (
                            <img src={activeChat.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (activeChat?.name?.charAt(0)?.toUpperCase())}
                    </div>
                    <div className="ml-3">
                        <h3 className="font-medium text-gray-800 dark:text-white">{activeChat.name}</h3>
                        <p className={`text-xs ${isPeerOnline ? 'text-green-500' : 'text-gray-400'}`}>
                            {isPeerOnline ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
                {/* Action Icons */}
            </div>

            {/* Messages Area */}
            <div className="message-area flex-1 p-4 overflow-y-auto custom-scrollbar pattern-bg-light dark:pattern-bg-dark bg-gray-100 dark:bg-bg-dark transition-colors duration-300">
                <div className="flex flex-col space-y-4">
                    {messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            // Bandingkan sender_id dengan ID pengguna yang login
                            isSender={msg.sender_id === user?.id}
                            // Berikan info lawan bicara ke bubble
                            otherUser={{
                                username: activeChat?.name,
                                avatar_url: activeChat?.avatar_url
                            }}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="input-area p-3 bg-white dark:bg-gray-800 border-t border-border-light dark:border-border-dark transition-colors duration-300">
                <div className="flex items-center">
                    {/* Emoji & Attachment Buttons */}
                    <div className="message-input-container flex-1 mx-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="message-input w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200 transition-colors duration-300"
                            placeholder="Ketik pesan..."
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        className="send-button p-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition shadow-md cursor-pointer"
                    >
                        {/* Send Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}