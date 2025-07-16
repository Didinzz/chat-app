// app/components/MessageBubble.jsx

'use client';

export default function MessageBubble({ message, isSender, otherUser }) {
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

 
    if (isSender) {
        // Tampilan untuk pesan yang dikirim
        return (
            <div className="flex items-end justify-end">
                <div className="message sent p-3 bg-message-sent-light dark:bg-message-sent-dark rounded-t-2xl rounded-l-2xl shadow-sm message-bubble-animation">
                    <p className="text-gray-800 dark:text-text-dark">{message.text}</p>
                    <div className="flex items-center justify-end mt-1 space-x-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(message.created_at)}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Tampilan untuk pesan yang diterima
    return (
        <div className="flex items-end space-x-2">
            <div className={`avatar w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-medium shadow-sm`}>
                {/* Menampilkan huruf pertama dari username lawan bicara */}
                {otherUser?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="message received p-3 bg-message-received-light dark:bg-message-received-dark rounded-t-2xl rounded-r-2xl shadow-sm message-bubble-animation">
                <p className="text-gray-800 dark:text-text-dark">{message.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                    {formatTime(message.created_at)}
                </p>
            </div>
        </div>
    );
}