'use client';

import { useEffect } from 'react';
import { CloseIcon } from './Icons';

export default function Modal({ open, onClose, children, wide, }) {
    useEffect(() => {
        if (!open)
            return;
        const k = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", k);
        return () => window.removeEventListener("keydown", k);
    }, [open, onClose]);
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sakuText/60 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={`fade-up bg-white rounded-2xl ${wide ? "max-w-lg" : "max-w-md"} w-full p-6 sm:p-8 shadow-2xl relative border border-sakuGreen-light max-h-[90vh] overflow-y-auto`}>
        <button onClick={onClose} aria-label="Tutup" className="absolute top-4 right-4 text-gray-400 hover:text-sakuText p-1">
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>);
}
/** Simple login / register form, shared by the landing modal and the in-app auth step. */
