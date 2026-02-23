import React from 'react';
import { PERFILES } from '../constants';
import { FormData } from '../types';

interface StepPerfilProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function StepPerfil({ formData, setFormData }: StepPerfilProps) {
    return (
        <div className="step-content active max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-gray-800">Definición de Competencias</h2>
                <p className="text-gray-500 mt-2">Identifique su rol. Esto ajustará los parámetros legales aplicables según dictámenes de la DT y Superintendencia de Educación.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PERFILES.map((p) => {
                    const isSelected = formData.perfil === p.id;
                    return (
                        <button
                            key={p.id}
                            className={`p-6 text-left border-2 rounded-xl transition-all ${
                                isSelected ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-100 bg-white hover:border-blue-200'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, perfil: p.id }))}
                        >
                            <h3 className="font-bold text-gray-800 text-lg">{p.id}</h3>
                            <p className="text-sm text-gray-500 mt-2">{p.desc}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
