// app/components/ChatItem.js
'use client';

export default function ChatItem({ chat, isActive, onClick }) {
    const activeClasses = 'bg-indigo-50 dark:bg-gray-700 border-l-4 border-l-indigo-500';
    const inactiveClasses = 'hover:bg-gray-50 dark:hover:bg-gray-700';

    return (
        <div
            className={`chat-item p-3 flex items-center border-b border-gray-100 dark:border-gray-700 cursor-pointer ${isActive ? activeClasses : inactiveClasses}`}
            onClick={onClick}
        >
            <div className="relative">
                <div className={`avatar w-12 h-12 rounded-full ${chat.avatar_url} flex items-center justify-center text-white font-medium shadow-md`}>
                    {chat.name.charAt(0)}
                </div>
                <div className={`status-indicator absolute bottom-0 right-0 border-2 border-white dark:border-gray-800 rounded-full ${chat.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
            <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-800 dark:text-white">{chat.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.preview}</p>
            </div>
        </div>
    );
}