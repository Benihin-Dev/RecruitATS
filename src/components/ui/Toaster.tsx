
"use client";

import { useEffect, useState } from "react";

interface ToasterProps {
    message: string;
    type?: "success" | "error" | "info";
    onClose: () => void;
}

export const Toaster = ({ message, type = "info", onClose }: ToasterProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = {
        success: "bg-green-600 text-white",
        error: "bg-red-600 text-white",
        info: "bg-blue-600 text-white",
    };

    return (
        <div className={`fixed top-4 right-4 z-50 rounded-md shadow-lg p-4 animate-slide-in-right ${colors[type]}`}>
            <div className="flex justify-between items-center space-x-4">
                <span>{message}</span>
                <button onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none">
                    ×
                </button>
            </div>
        </div>
    );
};
