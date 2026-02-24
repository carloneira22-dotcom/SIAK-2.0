import React from 'react';
import { PERFILES, INVESTIGADORES_AUTORIZADOS } from '../constants';
import { FormData } from '../types';

interface StepPerfilProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function StepPerfil({ formData, setFormData }: StepPerfilProps) {
    return (
        <div className="step-content active max-w-3xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-gray-800">Definición de Competencias</h2>
                <p className="text-gray-500 mt-2">Identifique su rol y datos personales. Esto ajustará los parámetros legales aplicables según dictámenes de la DT y Superintendencia de Educación.</p>
                {(!formData.perfil || !formData.investigador?.nombre || !formData.investigador?.rut || !formData.investigador?.email) && (
                    <p className="text-sm text-amber-600 font-bold mt-4 bg-amber-50 inline-block px-4 py-2 rounded-lg border border-amber-200">
                        ⚠️ Debe completar todos los datos del investigador y seleccionar un rol para continuar.
                    </p>
                )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">1. Datos del Investigador/a</h3>
                
                <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="text-xs font-bold text-blue-800 uppercase block mb-2">Seleccionar Investigador Autorizado (Opcional)</label>
                    <select 
                        className="w-full p-2 border border-blue-300 rounded-lg text-sm bg-white"
                        onChange={(e) => {
                            const selected = INVESTIGADORES_AUTORIZADOS.find(inv => inv.nombre === e.target.value);
                            if (selected) {
                                setFormData(prev => ({
                                    ...prev,
                                    investigador: {
                                        nombre: selected.nombre,
                                        rut: selected.rut,
                                        email: selected.email || prev.investigador?.email || ''
                                    }
                                }));
                            }
                        }}
                        value={INVESTIGADORES_AUTORIZADOS.find(inv => inv.nombre === formData.investigador?.nombre)?.nombre || ""}
                    >
                        <option value="">-- Seleccione un investigador o ingrese los datos manualmente --</option>
                        {INVESTIGADORES_AUTORIZADOS.map(inv => (
                            <option key={inv.nombre} value={inv.nombre}>{inv.nombre} {inv.rut ? `(${inv.rut})` : ''}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Nombre Completo</label>
                        <input 
                            type="text"
                            className="w-full p-2 border rounded-lg mt-1"
                            placeholder="Ej: Juan Pérez González"
                            value={formData.investigador?.nombre || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, investigador: { ...(prev.investigador || {rut: '', email: ''}), nombre: e.target.value } }))}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">RUT</label>
                        <input 
                            type="text"
                            className="w-full p-2 border rounded-lg mt-1"
                            placeholder="Ej: 12.345.678-9"
                            value={formData.investigador?.rut || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, investigador: { ...(prev.investigador || {nombre: '', email: ''}), rut: e.target.value } }))}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Correo Electrónico</label>
                        <input 
                            type="email"
                            className="w-full p-2 border rounded-lg mt-1"
                            placeholder="Ej: jperez@daemcanete.cl"
                            value={formData.investigador?.email || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, investigador: { ...(prev.investigador || {nombre: '', rut: ''}), email: e.target.value } }))}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">2. Rol en la Investigación</h3>
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
        </div>
    );
}
