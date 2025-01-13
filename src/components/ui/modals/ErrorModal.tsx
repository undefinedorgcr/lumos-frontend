/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { X } from 'lucide-react';

interface ErrorModalProps {
    isOpen: any,
    onClose: any,
    title: string,
    message: string
}

export const ErrorModal = ({ isOpen, onClose, title, message }: ErrorModalProps) => {

    function handleClose() {
        onClose(false);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md">
                {/* Header */}
                <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl text-red-500 font-neueblack">{title}</h2>
                    <button
                        onClick={handleClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
                    <p className='text-lg text-black'>{message}</p>
                </div>
            </div>
        </div>
    );
};