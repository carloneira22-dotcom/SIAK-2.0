import React from 'react';
import { Scale } from 'lucide-react';

interface HeaderProps {
    diasInfo: { transcurridos: number, restantes: number, estado: 'ok' | 'warning' | 'danger' | 'overdue' } | null;
}

export function Header({ diasInfo }: HeaderProps) {
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
            <div className="hidden md:flex items-center gap-6 text-right border-l-2 border-gray-100 pl-4">
                {diasInfo && (
                    <div className={`px-4 py-2 rounded-lg border text-left ${
                        diasInfo.estado === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                        diasInfo.estado === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                        diasInfo.estado === 'danger' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                        'bg-red-50 border-red-200 text-red-800'
                    }`}>
                        <div className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1">Plazo Legal (30 días hábiles)</div>
                        <div className="flex items-center gap-3">
                            <div className="text-2xl font-black leading-none">{diasInfo.restantes >= 0 ? diasInfo.restantes : 0}</div>
                            <div className="text-xs leading-tight font-medium">
                                días<br/>restantes
                            </div>
                            <div className="ml-2 pl-3 border-l border-current/30 text-[10px] opacity-80 flex flex-col justify-center">
                                <span><b>{diasInfo.transcurridos}</b> transcurridos</span>
                                {diasInfo.estado === 'overdue' && <span className="text-red-600 font-bold">¡Plazo vencido!</span>}
                            </div>
                        </div>
                    </div>
                )}
                <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Base Normativa</p>
                    <p className="text-xs font-bold text-gray-600">DFL 1 (CT), Ley 19.070, Ley 18.883</p>
                    <p className="text-[10px] text-gray-400">Ord. N° 1189 SIE</p>
                </div>
            </div>
        </header>
    );
}
