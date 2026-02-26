import React, { useState } from 'react';
import { FormData } from '../types';
import { MedidasResguardo } from './investigacion/MedidasResguardo';
import { NominaTestigos } from './investigacion/NominaTestigos';
import { GestionEntrevistas } from './investigacion/GestionEntrevistas';

interface StepInvestigacionProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    onPrintActa: (entrevistado: string, preguntas: string[], respuestas: Record<number, string>) => void;
    onPrintCitacion: (html: string) => void;
}

export function StepInvestigacion({ formData, setFormData, onPrintActa, onPrintCitacion }: StepInvestigacionProps) {
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <div className="step-content active space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <h3 className="font-bold text-blue-900">🔍 DILIGENCIAS Y RESGUARDOS</h3>
                <p className="text-sm text-blue-800 mt-1">Gestión de medidas inmediatas, testigos y entrevistas.</p>
            </div>

            {errorMessage && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-sm mb-6 flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <p className="font-bold text-sm">{errorMessage}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <MedidasResguardo 
                        formData={formData} 
                        setFormData={setFormData} 
                        onPrintCitacion={onPrintCitacion} 
                        setErrorMessage={setErrorMessage} 
                    />
                    <NominaTestigos 
                        formData={formData} 
                        setFormData={setFormData} 
                    />
                </div>
                
                <div className="lg:col-span-2">
                    <GestionEntrevistas 
                        formData={formData} 
                        setFormData={setFormData} 
                        onPrintActa={onPrintActa} 
                        onPrintCitacion={onPrintCitacion} 
                        setErrorMessage={setErrorMessage} 
                    />
                </div>
            </div>
        </div>
    );
}
