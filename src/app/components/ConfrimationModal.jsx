'use client';

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    buttonText
}) {
    if (!isOpen) return null;

    return (
        // Latar belakang overlay
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            {/* Kontainer Modal */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                {message}
            </p>
            {/* Tombol Aksi */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}