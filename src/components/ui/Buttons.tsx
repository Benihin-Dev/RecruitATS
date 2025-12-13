
"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const PrimaryButton = ({
    children,
    className = "",
    isLoading = false,
    ...props
}: ButtonProps) => {
    // We keep the component name 'PrimaryButton' for backward compatibility with existing code
    // but implemented a modern gradient style.
    return (
        <button
            className={`
        relative overflow-hidden group
        bg-primary-gradient text-white font-semibold py-2.5 px-6 rounded-lg 
        shadow-lg shadow-primary/30 
        transition-all duration-300 
        hover:shadow-glow hover:-translate-y-0.5
        disabled:opacity-70 disabled:cursor-not-allowed
        flex items-center justify-center
        ${className}
      `}
            disabled={isLoading || props.disabled}
            {...props}
        >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-full"></span>
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            <span className="relative">{children}</span>
        </button>
    );
};

export const SecondaryButton = ({
    children,
    className = "",
    isLoading = false,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={`
        bg-white text-gray-700 font-medium py-2.5 px-6 rounded-lg
        border border-gray-200
        shadow-sm
        transition-all duration-300
        hover:border-primary hover:text-primary hover:shadow-md
        flex items-center justify-center
        ${isLoading ? "opacity-75 cursor-not-allowed" : ""} 
        ${className}
      `}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && "..."}
            {children}
        </button>
    );
};
