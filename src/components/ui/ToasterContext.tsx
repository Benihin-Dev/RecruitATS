"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(
        (message: string, type: ToastType = "success", duration = 3000) => {
            const id = Math.random().toString(36).substring(2, 9);
            setToasts((prev) => [...prev, { id, message, type, duration }]);

            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast]
    );

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`min-w-[300px] max-w-sm w-full bg-white dark:bg-zinc-800 shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden rounded-lg p-4 mb-2 flex items-start transform transition-all duration-300 ease-in-out hover:scale-105
            ${toast.type === 'success' ? 'border-l-4 border-emerald-500' : ''}
            ${toast.type === 'error' ? 'border-l-4 border-red-500' : ''}
            ${toast.type === 'warning' ? 'border-l-4 border-amber-500' : ''}
            ${toast.type === 'info' ? 'border-l-4 border-sky-500' : ''}
            `}
                    >
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {toast.message}
                            </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => removeToast(toast.id)}
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
