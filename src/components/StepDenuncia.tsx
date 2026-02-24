import React from 'react';
import { FormData } from '../types';
import { CALIDADES, ESTABLECIMIENTOS, FUNCIONARIOS } from '../constants';
import { Search } from 'lucide-react';

interface StepDenunciaProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function StepDenuncia({ formData, setFormData }: StepDenunciaProps) {
    const handleAutoFill = (value: string, tipo: 'victima' | 'tercero' | 'denunciado') => {
        const func = FUNCIONARIOS.find(f => f.nombre === value);
        if (func) {
            if (tipo === 'victima') {
                setFormData(prev => ({
                    ...prev,
                    victima: {
                        ...prev.victima,
                        nombre: func.nombre,
                        rut: func.rut,
                        establecimiento: func.establecimiento
                    }
                }));
            } else if (tipo === 'tercero') {
                setFormData(prev => ({
                    ...prev,
                    denuncianteTercero: {
                        ...prev.denuncianteTercero,
                        nombre: func.nombre,
                        establecimiento: func.establecimiento
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    denunciado: {
                        ...prev.denunciado,
                        nombre: func.nombre,
                        establecimiento: func.establecimiento
                    }
                }));
            }
        }
    };

    const setConducta = (tipo: string) => {
        setFormData(prev => ({ ...prev, hechos: { ...prev.hechos, tipo } }));
    };

    const setQuienDenuncia = (quien: 'Victima' | 'Tercero') => {
        setFormData(prev => ({ ...prev, denuncia: { ...prev.denuncia, quienDenuncia: quien } }));
    };

    return (
        <div className="step-content active space-y-6">
            <datalist id="funcionarios-list">
                {FUNCIONARIOS.map((f, i) => <option key={i} value={f.nombre} />)}
            </datalist>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-blue-900">📝 ACTA DE DENUNCIA DE VIOLENCIA EN EL TRABAJO, ACOSO LABORAL O SEXUAL DAEM CAÑETE</h3>
                    <p className="text-sm text-blue-800 mt-1">Llenado por el investigador según instructivo DAEM.</p>
                </div>
                <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded shadow font-bold hover:bg-blue-700 text-sm no-print">
                    🖨️ Imprimir Acta en Blanco
                </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Fecha de denuncia</label>
                        <input 
                            type="date"
                            className="w-full p-2 border rounded-lg"
                            value={formData.denuncia?.fecha || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, denuncia: { ...(prev.denuncia || {hora: '', quienDenuncia: ''}), fecha: e.target.value } }))}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Hora</label>
                        <input 
                            type="time"
                            className="w-full p-2 border rounded-lg"
                            value={formData.denuncia?.hora || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, denuncia: { ...(prev.denuncia || {fecha: '', quienDenuncia: ''}), hora: e.target.value } }))}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-sm font-bold text-gray-700 block mb-2">Indique tipo de denuncia:</label>
                    <div className="flex flex-wrap gap-3">
                        {['Acoso Sexual', 'Acoso Laboral', 'Violencia en el trabajo'].map(tipo => (
                            <button 
                                key={tipo}
                                onClick={() => setConducta(tipo)} 
                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
                                    formData.hechos.tipo === tipo ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {tipo}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-sm font-bold text-gray-700 block mb-2">Quien realiza la denuncia:</label>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer">
                            <input 
                                type="radio" 
                                name="quienDenuncia"
                                className="w-5 h-5"
                                checked={formData.denuncia?.quienDenuncia === 'Victima'}
                                onChange={() => setQuienDenuncia('Victima')}
                            />
                            <span className="text-sm text-gray-700"><b>Víctima</b> (persona en quien recae la acción de violencia en el trabajo, acoso laboral y sexual)</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer">
                            <input 
                                type="radio" 
                                name="quienDenuncia"
                                className="w-5 h-5"
                                checked={formData.denuncia?.quienDenuncia === 'Tercero'}
                                onChange={() => setQuienDenuncia('Tercero')}
                            />
                            <span className="text-sm text-gray-700"><b>Denunciante:</b> Persona (un tercero) que pone en conocimiento el hecho constitutivo de violencia en el trabajo, acoso laboral y sexual y que NO es víctima de tales acciones.</span>
                        </label>
                    </div>
                </div>

                <h4 className="font-black text-gray-800 mb-4 border-b pb-2 mt-8">Datos personales de la víctima</h4>
                <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200 no-print">
                    <label className="text-xs font-bold text-blue-800 uppercase flex items-center gap-2 mb-2">
                        <Search size={14} /> Buscar Funcionario Víctima
                    </label>
                    <input 
                        list="funcionarios-list" 
                        className="w-full p-2 border border-blue-300 rounded-lg text-sm bg-white" 
                        placeholder="Escriba un nombre para autocompletar..." 
                        onChange={(e) => handleAutoFill(e.target.value, 'victima')}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Nombre completo</label>
                        <input 
                            className="w-full p-2 border rounded-lg"
                            value={formData.victima?.nombre || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, victima: { ...(prev.victima || {rut: '', establecimiento: '', funcion: '', telefono: '', email: ''}), nombre: e.target.value } }))}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Cédula de Identidad</label>
                        <input 
                            className="w-full p-2 border rounded-lg"
                            value={formData.victima?.rut || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, victima: { ...(prev.victima || {nombre: '', establecimiento: '', funcion: '', telefono: '', email: ''}), rut: e.target.value } }))}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Unidad, programa o establecimiento educacional de desempeño</label>
                        <select 
                            className="w-full p-2 border rounded-lg"
                            value={formData.victima?.establecimiento || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, victima: { ...(prev.victima || {nombre: '', rut: '', funcion: '', telefono: '', email: ''}), establecimiento: e.target.value } }))}
                        >
                            <option value="">Seleccione...</option>
                            {ESTABLECIMIENTOS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Función que desempeña</label>
                        <input 
                            className="w-full p-2 border rounded-lg"
                            value={formData.victima?.funcion || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, victima: { ...(prev.victima || {nombre: '', rut: '', establecimiento: '', telefono: '', email: ''}), funcion: e.target.value } }))}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Teléfono</label>
                            <input 
                                className="w-full p-2 border rounded-lg"
                                value={formData.victima?.telefono || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, victima: { ...(prev.victima || {nombre: '', rut: '', establecimiento: '', funcion: '', email: ''}), telefono: e.target.value } }))}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">e-mail</label>
                            <input 
                                type="email"
                                className="w-full p-2 border rounded-lg"
                                value={formData.victima?.email || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, victima: { ...(prev.victima || {nombre: '', rut: '', establecimiento: '', funcion: '', telefono: ''}), email: e.target.value } }))}
                            />
                        </div>
                    </div>
                </div>

                {formData.denuncia?.quienDenuncia === 'Tercero' && (
                    <>
                        <h4 className="font-black text-gray-800 mb-4 border-b pb-2 mt-8">Datos personales del/a denunciante</h4>
                        <p className="text-xs text-gray-500 mb-4">(Solo en caso de que el denunciante no sea la víctima)</p>
                        <div className="mb-4 bg-indigo-50 p-4 rounded-lg border border-indigo-200 no-print">
                            <label className="text-xs font-bold text-indigo-800 uppercase flex items-center gap-2 mb-2">
                                <Search size={14} /> Buscar Funcionario Denunciante
                            </label>
                            <input 
                                list="funcionarios-list" 
                                className="w-full p-2 border border-indigo-300 rounded-lg text-sm bg-white" 
                                placeholder="Escriba un nombre para autocompletar..." 
                                onChange={(e) => handleAutoFill(e.target.value, 'tercero')}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Nombre completo</label>
                                <input 
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.denuncianteTercero?.nombre || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, denuncianteTercero: { ...(prev.denuncianteTercero || {funcion: '', establecimiento: ''}), nombre: e.target.value } }))}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Función que desempeña</label>
                                <input 
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.denuncianteTercero?.funcion || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, denuncianteTercero: { ...(prev.denuncianteTercero || {nombre: '', establecimiento: ''}), funcion: e.target.value } }))}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Unidad, programa o establecimiento educacional de desempeño</label>
                                <select 
                                    className="w-full p-2 border rounded-lg"
                                    value={formData.denuncianteTercero?.establecimiento || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, denuncianteTercero: { ...(prev.denuncianteTercero || {nombre: '', funcion: ''}), establecimiento: e.target.value } }))}
                                >
                                    <option value="">Seleccione...</option>
                                    {ESTABLECIMIENTOS.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                        </div>
                    </>
                )}

                <h4 className="font-black text-gray-800 mb-4 border-b pb-2 mt-8">Datos del/a denunciado/a</h4>
                <div className="mb-4 bg-red-50 p-4 rounded-lg border border-red-200 no-print">
                    <label className="text-xs font-bold text-red-800 uppercase flex items-center gap-2 mb-2">
                        <Search size={14} /> Buscar Funcionario Denunciado
                    </label>
                    <input 
                        list="funcionarios-list" 
                        className="w-full p-2 border border-red-300 rounded-lg text-sm bg-white" 
                        placeholder="Escriba un nombre para autocompletar..." 
                        onChange={(e) => handleAutoFill(e.target.value, 'denunciado')}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Nombre completo</label>
                        <input 
                            className="w-full p-2 border rounded-lg"
                            value={formData.denunciado?.nombre || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, denunciado: { ...(prev.denunciado || {funcion: '', establecimiento: '', relacion: '', calidad: ''}), nombre: e.target.value } }))}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Función que desempeña</label>
                        <input 
                            className="w-full p-2 border rounded-lg"
                            value={formData.denunciado?.funcion || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, denunciado: { ...(prev.denunciado || {nombre: '', establecimiento: '', relacion: '', calidad: ''}), funcion: e.target.value } }))}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Unidad, programa o establecimiento educacional de desempeño</label>
                        <select 
                            className="w-full p-2 border rounded-lg"
                            value={formData.denunciado?.establecimiento || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, denunciado: { ...(prev.denunciado || {nombre: '', funcion: '', relacion: '', calidad: ''}), establecimiento: e.target.value } }))}
                        >
                            <option value="">Seleccione...</option>
                            {ESTABLECIMIENTOS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                    <div className="no-print">
                        <label className="text-xs font-bold text-gray-500 uppercase">Relación Jerárquica (Uso Interno SIAK)</label>
                        <select 
                            className="w-full p-2 border rounded-lg"
                            value={formData.denunciado?.relacion || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, denunciado: { ...(prev.denunciado || {nombre: '', funcion: '', establecimiento: '', calidad: ''}), relacion: e.target.value } }))}
                        >
                            <option value="">Seleccione...</option>
                            <option>Superior Jerárquico</option>
                            <option>Subalterno</option>
                            <option>Par / Colega</option>
                            <option>Tercero</option>
                        </select>
                    </div>
                    <div className="no-print">
                        <label className="text-xs font-bold text-gray-500 uppercase">Estatuto que lo rige (Uso Interno SIAK)</label>
                        <select 
                            className="w-full p-2 border-2 border-blue-400 rounded-lg"
                            value={formData.denunciado?.calidad || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, denunciado: { ...(prev.denunciado || {nombre: '', funcion: '', establecimiento: '', relacion: ''}), calidad: e.target.value } }))}
                        >
                            <option value="">Seleccione...</option>
                            {CALIDADES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-black text-gray-800 mb-4 border-b pb-2">NARRACIÓN DE LOS HECHOS</h4>
                <p className="text-sm text-gray-600 mb-4">
                    Describa las conductas manifestadas (en orden cronológico) por el/la presunto/a acosador/a que avalarían la denuncia. (Señalar nombres, lugares, fechas y detalles que complementen la denuncia). (Si desea puede relatar los hechos en hoja adjunta). Utilizar letra legible, de preferencia imprenta.
                </p>
                <div>
                    <textarea 
                        className="w-full p-3 border rounded-lg mt-1 h-48 text-sm bg-gray-50" 
                        placeholder="Relate fechas, lugares y testigos detalladamente..."
                        value={formData.hechos.relato}
                        onChange={(e) => setFormData(prev => ({ ...prev, hechos: { ...prev.hechos, relato: e.target.value } }))}
                    />
                </div>
                
                <div className="mt-16 flex justify-between px-10 hidden print:flex">
                    <div className="border-t border-gray-800 pt-2 text-center text-xs w-2/5">
                        Firma del/a denunciante
                    </div>
                    <div className="border-t border-gray-800 pt-2 text-center text-xs w-2/5">
                        Firma funcionario/a receptor/a
                    </div>
                </div>
                <div className="mt-8 text-center text-xs font-bold hidden print:block">
                    <p>DEPARTAMENTO COMUNAL DE EDUCACIÓN</p>
                    <p>ILUSTRE MUNICIPALIDAD DE CAÑETE.</p>
                </div>
            </div>
        </div>
    );
}
