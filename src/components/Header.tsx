import React from 'react';
import { Scale } from 'lucide-react';

export function Header() {
    return (
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200 no-print">
            <div className="flex items-center gap-4">
                <img src="https://placehold.co/150x150/0f766e/white?text=LOGO+DAEM" alt="Logo DAEM Cañete" className="h-16 w-16 object-contain rounded-lg border border-slate-100 shadow-sm" referrerPolicy="no-referrer" />
                <div className="bg-teal-800 p-4 rounded-xl text-white shadow-inner hidden sm:flex items-center justify-center">
                    <Scale size={24} />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">SIAK <span className="text-teal-700 font-bold">DAEM CAÑETE</span></h1>
                </div>
            </div>
            <div className="hidden md:block text-right border-l-2 border-gray-100 pl-4">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Base Normativa</p>
                <p className="text-xs font-bold text-gray-600">DFL 1 (CT), Ley 19.070, Ley 18.883</p>
                <p className="text-[10px] text-gray-400">Ord. N° 1189 SIE</p>
            </div>
        </header>
    );
}
