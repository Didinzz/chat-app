// app/components/ChatItem.js
'use client';

export default function ChatItem({ chat, isActive, onClick, isOnline }) {
    const activeClasses = 'bg-indigo-50 dark:bg-gray-700 border-l-4 border-l-indigo-500';
    const inactiveClasses = 'hover:bg-gray-50 dark:hover:bg-gray-700';

    // Format date to d/m/y
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div
            className={`chat-item p-3 flex items-center border-b border-gray-100 dark:border-gray-700 cursor-pointer ${isActive ? activeClasses : inactiveClasses}`}
            onClick={onClick}
        >
            <div className="relative">
                <div className="avatar w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold shadow-md">
                    {chat.other_user_avatar_url ? (
                        <img src={chat.other_user_avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (chat.other_user_username.charAt(0).toUpperCase())}
                </div>
                <div className={`status-indicator absolute bottom-0 right-0 border-2 border-white dark:border-gray-800 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
            <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800 dark:text-white">{chat.other_user_username}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(chat.last_message_at)}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Klik untuk memulai percakapan...</p>
            </div>
        </div>
    );
}
