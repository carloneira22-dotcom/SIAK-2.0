import React, { useState } from 'react';
import { FormData } from '../../types';
import { FUNCIONARIOS } from '../../constants';

interface NominaTestigosProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function NominaTestigos({ formData, setFormData }: NominaTestigosProps) {
    const [nuevoTestigo, setNuevoTestigo] = useState('');

    const addTestigo = () => {
        const val = nuevoTestigo.trim();
        if (val && !formData.investigacion.testigos.includes(val)) {
            setFormData(prev => ({
                ...prev,
                investigacion: {
                    ...prev.investigacion,
                    testigos: [...prev.investigacion.testigos, val]
                }
            }));
            setNuevoTestigo('');
        }
    };

    const removeTestigo = (index: number) => {
        setFormData(prev => ({
            ...prev,
            investigacion: {
                ...prev.investigacion,
                testigos: prev.investigacion.testigos.filter((_, i) => i !== index)
            }
        }));
    };

    return (
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4">👥 Nómina de Testigos</h4>
            <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    list="funcionarios-list"
                    className="flex-1 p-2 border rounded-lg text-sm"
                    placeholder="Nombre del testigo"
                    value={nuevoTestigo}
                    onChange={(e) => setNuevoTestigo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTestigo()}
                />
                <button onClick={addTestigo} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                    + Agregar
                </button>
            </div>
            <div className="space-y-2">
                {formData.investigacion.testigos.map((t, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span className="text-sm font-medium text-gray-700">{t}</span>
                        <button onClick={() => removeTestigo(i)} className="text-red-500 text-sm font-bold hover:text-red-700 px-2">
                            Eliminar
                        </button>
                    </div>
                ))}
                {formData.investigacion.testigos.length === 0 && (
                    <p className="text-sm text-gray-400 italic text-center py-4">No hay testigos registrados.</p>
                )}
            </div>
        </div>
    );
}
