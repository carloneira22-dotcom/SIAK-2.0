import React, { useState } from 'react';
import { FormData } from '../types';
import { FUNCIONARIOS } from '../constants';
import { generarPreguntas, redactarCitacion, redactarDerivacionACHS, redactarOficioSeparacion } from '../services/geminiService';

interface StepInvestigacionProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    onPrintActa: (entrevistado: string, preguntas: string[], respuestas: Record<number, string>) => void;
    onPrintCitacion: (html: string) => void;
}

export function StepInvestigacion({ formData, setFormData, onPrintActa, onPrintCitacion }: StepInvestigacionProps) {
    const [nuevoTestigo, setNuevoTestigo] = useState('');
    const [isGeneratingCitacion, setIsGeneratingCitacion] = useState(false);
    const [isGeneratingDerivacion, setIsGeneratingDerivacion] = useState(false);
    const [isGeneratingOficio, setIsGeneratingOficio] = useState(false);
    const [isGeneratingPreguntas, setIsGeneratingPreguntas] = useState(false);
    const [sujetoActivoId, setSujetoActivoId] = useState('denunciante');
    const [errorMessage, setErrorMessage] = useState('');

    const sujetos = [
        { id: 'denunciante', rol: 'Denunciante', nombre: formData.denuncia.quienDenuncia === 'Victima' ? formData.victima.nombre : formData.denuncianteTercero.nombre },
        { id: 'denunciado', rol: 'Denunciado/a', nombre: formData.denunciado.nombre },
        ...formData.investigacion.testigos.map((t, i) => ({ id: `testigo-${i}`, rol: 'Testigo', nombre: t }))
    ];

    const sujetoActivo = sujetos.find(s => s.id === sujetoActivoId) || sujetos[0];
    const entrevistaActual = formData.investigacion.entrevistas[sujetoActivo.id] || { preguntas: [], respuestas: {} };

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

    const handleGenerarCitacion = async () => {
        if (!sujetoActivo.nombre) {
            setErrorMessage("SIAK: El sujeto seleccionado no tiene nombre registrado.");
            return;
        }
        setErrorMessage('');
        const tipo = formData.hechos.tipo || 'Denuncia Ley Karin';
        
        setIsGeneratingCitacion(true);
        try {
            const html = await redactarCitacion(
                sujetoActivo.nombre, 
                tipo, 
                formData.investigador.nombre, 
                formData.investigacion.fechaCitacion, 
                formData.investigacion.horaCitacion, 
                formData.investigacion.lugarCitacion,
                sujetoActivo.rol
            );
            if (html) {
                const htmlImprimir = `
                    <div class="p-8 font-serif">
                        <div class="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                            <img src="https://placehold.co/150x150/white/black?text=LOGO+DAEM" alt="Logo DAEM" class="h-20 object-contain grayscale">
                            <div class="text-right">
                                <p class="text-xs font-bold">REPUBLICA DE CHILE</p>
                                <p class="text-xs font-bold">DAEM CAÑETE</p>
                            </div>
                        </div>
                        <h2 class="text-xl font-black uppercase mt-4 text-center mb-8">Citación Oficial a Entrevista Investigativa</h2>
                        <div class="text-justify leading-relaxed text-sm">
                            ${html}
                        </div>
                        <div class="mt-24 flex justify-between px-10">
                            <div class="text-center text-xs w-full">
                                <p>____________________________________</p>
                                <p class="mt-2"><b>${formData.investigador.nombre}</b></p>
                                <p>${formData.perfil}</p>
                                <p>Investigador/a Designado/a DAEM Cañete</p>
                            </div>
                        </div>
                    </div>
                `;
                onPrintCitacion(htmlImprimir);
            } else {
                setErrorMessage("SIAK: No se pudo generar la citación. Intente nuevamente.");
            }
        } catch (error) {
            setErrorMessage("SIAK: Error al conectar con el Asistente Jurídico para redactar la citación.");
        } finally {
            setIsGeneratingCitacion(false);
        }
    };

    const handleGenerarDerivacion = async () => {
        setErrorMessage('');
        setIsGeneratingDerivacion(true);
        try {
            const html = await redactarDerivacionACHS(
                formData.victima.nombre,
                formData.victima.rut,
                formData.victima.establecimiento,
                formData.hechos.tipo || 'Denuncia Ley Karin',
                formData.investigador.nombre
            );
            if (html) {
                const htmlImprimir = `
                    <div class="p-8 font-serif">
                        <div class="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                            <img src="https://placehold.co/150x150/white/black?text=LOGO+DAEM" alt="Logo DAEM" class="h-20 object-contain grayscale">
                            <div class="text-right">
                                <p class="text-xs font-bold">REPUBLICA DE CHILE</p>
                                <p class="text-xs font-bold">DAEM CAÑETE</p>
                            </div>
                        </div>
                        <h2 class="text-xl font-black uppercase mt-4 text-center mb-8">Derivación a Unidad de Prevención de Riesgos</h2>
                        <div class="text-justify leading-relaxed text-sm">
                            ${html}
                        </div>
                        <div class="mt-24 flex justify-between px-10">
                            <div class="text-center text-xs w-full">
                                <p>____________________________________</p>
                                <p class="mt-2"><b>${formData.investigador.nombre}</b></p>
                                <p>${formData.perfil}</p>
                                <p>Investigador/a Designado/a DAEM Cañete</p>
                            </div>
                        </div>
                    </div>
                `;
                onPrintCitacion(htmlImprimir);
            } else {
                setErrorMessage("SIAK: No se pudo generar la derivación. Intente nuevamente.");
            }
        } catch (error) {
            setErrorMessage("SIAK: Error al conectar con el Asistente Jurídico para redactar la derivación.");
        } finally {
            setIsGeneratingDerivacion(false);
        }
    };

    const handleGenerarOficioSeparacion = async () => {
        setErrorMessage('');
        
        if (!formData.investigacion.separacionSujeto || !formData.investigacion.separacionNuevoEspacio || !formData.investigacion.separacionNuevaFuncion) {
            setErrorMessage("SIAK: Debe completar a quién se aplicará la medida, el nuevo espacio y la nueva función.");
            return;
        }

        setIsGeneratingOficio(true);
        try {
            let sujetoNombre = '';
            let sujetoRol = '';
            
            if (formData.investigacion.separacionSujeto === 'Victima') {
                sujetoNombre = formData.victima.nombre;
                sujetoRol = 'Víctima / Denunciante';
            } else if (formData.investigacion.separacionSujeto === 'Denunciado') {
                sujetoNombre = formData.denunciado.nombre;
                sujetoRol = 'Denunciado/a';
            }

            const html = await redactarOficioSeparacion(
                sujetoNombre,
                sujetoRol,
                formData.investigacion.separacionNuevoEspacio,
                formData.investigacion.separacionNuevaFuncion,
                formData.investigador.nombre
            );
            
            if (html) {
                const htmlImprimir = `
                    <div class="p-8 font-serif">
                        <div class="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                            <img src="https://placehold.co/150x150/white/black?text=LOGO+DAEM" alt="Logo DAEM" class="h-20 object-contain grayscale">
                            <div class="text-right">
                                <p class="text-xs font-bold">REPUBLICA DE CHILE</p>
                                <p class="text-xs font-bold">DAEM CAÑETE</p>
                            </div>
                        </div>
                        <h2 class="text-xl font-black uppercase mt-4 text-center mb-8">Oficio de Medida de Resguardo: Separación de Espacios y Funciones</h2>
                        <div class="text-justify leading-relaxed text-sm">
                            ${html}
                        </div>
                        <div class="mt-24 flex justify-between px-10">
                            <div class="text-center text-xs w-full">
                                <p>____________________________________</p>
                                <p class="mt-2"><b>${formData.investigador.nombre}</b></p>
                                <p>${formData.perfil}</p>
                                <p>Investigador/a Designado/a DAEM Cañete</p>
                            </div>
                        </div>
                    </div>
                `;
                onPrintCitacion(htmlImprimir);
            } else {
                setErrorMessage("SIAK: No se pudo generar el oficio. Intente nuevamente.");
            }
        } catch (error) {
            setErrorMessage("SIAK: Error al conectar con el Asistente Jurídico para redactar el oficio.");
        } finally {
            setIsGeneratingOficio(false);
        }
    };

    const handleGenerarPreguntas = async () => {
        setErrorMessage('');
        const relato = formData.hechos.relato.trim();
        const tipo = formData.hechos.tipo;

        if (!relato || !tipo) {
            setErrorMessage("SIAK: Asegúrese de haber seleccionado el 'Tipo de Conducta' y completado el 'Relato de los Hechos' en la etapa anterior.");
            return;
        }

        setIsGeneratingPreguntas(true);
        try {
            const preguntas = await generarPreguntas(relato, tipo, sujetoActivo.rol);
            setFormData(prev => ({
                ...prev,
                investigacion: {
                    ...prev.investigacion,
                    entrevistas: {
                        ...prev.investigacion.entrevistas,
                        [sujetoActivo.id]: {
                            preguntas,
                            respuestas: {}
                        }
                    }
                }
            }));
        } catch (error) {
            setErrorMessage("Hubo un error al conectar con el asistente de IA. Intente nuevamente.");
        } finally {
            setIsGeneratingPreguntas(false);
        }
    };

    const guardarRespuesta = (index: number, valor: string) => {
        setFormData(prev => {
            const currentEntrevista = prev.investigacion.entrevistas[sujetoActivo.id] || { preguntas: [], respuestas: {} };
            return {
                ...prev,
                investigacion: {
                    ...prev.investigacion,
                    entrevistas: {
                        ...prev.investigacion.entrevistas,
                        [sujetoActivo.id]: {
                            ...currentEntrevista,
                            respuestas: {
                                ...currentEntrevista.respuestas,
                                [index]: valor
                            }
                        }
                    }
                }
            };
        });
    };

    return (
        <div className="step-content active space-y-6">
            <h3 className="text-2xl font-black text-gray-800 mb-4">Diligencias y Resguardos</h3>
            
            {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg">
                    <p className="text-sm text-red-700 font-bold">{errorMessage}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                    <h4 className="font-bold text-red-900 mb-4">❤️ Medidas Inmediatas</h4>
                    <p className="text-xs text-red-700 mb-4">El DAEM debe adoptar medidas de resguardo (Ley 21.643).</p>
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg mb-2 border cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="w-5 h-5"
                            checked={formData.investigacion.atencionPsicologica}
                            onChange={(e) => setFormData(prev => ({ ...prev, investigacion: { ...prev.investigacion, atencionPsicologica: e.target.checked } }))}
                        />
                        <span className="text-sm text-gray-700">Se ofreció atención psicológica (ACHS/MUTUAL).</span>
                    </label>
                    {formData.investigacion.atencionPsicologica && (
                        <div className="ml-8 mb-4">
                            <button 
                                onClick={handleGenerarDerivacion}
                                disabled={isGeneratingDerivacion || !formData.victima.nombre}
                                className={`bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-2 ${isGeneratingDerivacion ? 'opacity-50 cursor-not-allowed pulse-ia' : ''}`}
                            >
                                ✨ {isGeneratingDerivacion ? 'Redactando derivación...' : 'Generar Oficio de Derivación a Prevención de Riesgos'}
                            </button>
                            {!formData.victima.nombre && <p className="text-xs text-red-500 mt-1">Debe registrar el nombre de la víctima en el paso anterior.</p>}
                        </div>
                    )}
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="w-5 h-5"
                            checked={formData.investigacion.medidaSeparacion}
                            onChange={(e) => setFormData(prev => ({ ...prev, investigacion: { ...prev.investigacion, medidaSeparacion: e.target.checked } }))}
                        />
                        <span className="text-sm text-gray-700">Se aplicó separación de espacios/funciones.</span>
                    </label>
                    {formData.investigacion.medidaSeparacion && (
                        <div className="ml-8 mt-2 mb-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <h5 className="text-xs font-bold text-slate-800 uppercase mb-3 border-b pb-2">Detalles de la Separación</h5>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">¿A quién se aplica la medida?</label>
                                    <select 
                                        className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white mt-1"
                                        value={formData.investigacion.separacionSujeto}
                                        onChange={(e) => setFormData(prev => ({ ...prev, investigacion: { ...prev.investigacion, separacionSujeto: e.target.value } }))}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value="Victima">Víctima: {formData.victima.nombre || 'No registrado'}</option>
                                        <option value="Denunciado">Denunciado/a: {formData.denunciado.nombre || 'No registrado'}</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Nuevo Espacio Físico</label>
                                    <input 
                                        type="text"
                                        className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white mt-1"
                                        placeholder="Ej: Oficina 204, Biblioteca..."
                                        value={formData.investigacion.separacionNuevoEspacio}
                                        onChange={(e) => setFormData(prev => ({ ...prev, investigacion: { ...prev.investigacion, separacionNuevoEspacio: e.target.value } }))}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Nueva Función a Desempeñar</label>
                                    <input 
                                        type="text"
                                        className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white mt-1"
                                        placeholder="Ej: Labores administrativas, archivo..."
                                        value={formData.investigacion.separacionNuevaFuncion}
                                        onChange={(e) => setFormData(prev => ({ ...prev, investigacion: { ...prev.investigacion, separacionNuevaFuncion: e.target.value } }))}
                                    />
                                </div>

                                <button 
                                    onClick={handleGenerarOficioSeparacion}
                                    disabled={isGeneratingOficio || !formData.investigacion.separacionSujeto}
                                    className={`w-full mt-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition-colors shadow-sm flex items-center justify-center gap-2 ${isGeneratingOficio ? 'opacity-50 cursor-not-allowed pulse-ia' : ''}`}
                                >
                                    ✨ {isGeneratingOficio ? 'Redactando oficio...' : 'Generar Oficio a Director DAEM y Jefe de Personal'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
                    <h4 className="font-bold text-slate-800 mb-4">👥 Nómina de Testigos</h4>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Añadir Funcionario como Testigo</label>
                        <div className="flex gap-2 mt-1">
                            <input 
                                list="funcionarios-list" 
                                className="flex-1 p-2 text-sm border border-slate-300 rounded-lg bg-white" 
                                placeholder="Buscar funcionario..."
                                value={nuevoTestigo}
                                onChange={(e) => setNuevoTestigo(e.target.value)}
                            />
                            <button 
                                onClick={addTestigo} 
                                className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors"
                            >
                                Añadir
                            </button>
                        </div>
                        <ul className="mt-4 space-y-2">
                            {formData.investigacion.testigos.length === 0 ? (
                                <li className="text-xs text-slate-400 italic">No hay testigos agregados aún.</li>
                            ) : (
                                formData.investigacion.testigos.map((t, i) => (
                                    <li key={i} className="flex justify-between items-center bg-white p-2 px-3 rounded-lg text-sm border border-slate-200 shadow-sm">
                                        <span className="font-medium text-slate-700">{t}</span>
                                        <button onClick={() => removeTestigo(i)} className="text-amber-500 hover:text-amber-700 font-bold ml-2">❌</button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl flex flex-col">
                <h4 className="font-bold text-blue-900 mb-4">🤖 Gestión de Entrevistas y Citaciones</h4>
                
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                    {sujetos.map(s => (
                        <button 
                            key={s.id}
                            onClick={() => setSujetoActivoId(s.id)}
                            className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-colors ${sujetoActivoId === s.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-blue-800 border border-blue-300 hover:bg-blue-100'}`}
                        >
                            {s.rol}: {s.nombre || 'Sin nombre'}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm">
                        <h5 className="font-bold text-blue-800 mb-4 border-b pb-2">1. Citación Oficial</h5>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Fecha Citación</label>
                                <input 
                                    type="date"
                                    className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white mt-1"
                                    value={formData.investigacion.fechaCitacion}
                                    onChange={(e) => setFormData(prev => ({ ...prev, investigacion: { ...prev.investigacion, fechaCitacion: e.target.value } }))}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Hora Citación</label>
                                <input 
                                    type="time"
                                    className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white mt-1"
                                    value={formData.investigacion.horaCitacion}
                                    onChange={(e) => setFormData(prev => ({ ...prev, investigacion: { ...prev.investigacion, horaCitacion: e.target.value } }))}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Lugar de Entrevista</label>
                                <input 
                                    type="text"
                                    className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white mt-1"
                                    placeholder="Ej: Oficina DAEM, Sala de reuniones..."
                                    value={formData.investigacion.lugarCitacion}
                                    onChange={(e) => setFormData(prev => ({ ...prev, investigacion: { ...prev.investigacion, lugarCitacion: e.target.value } }))}
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleGenerarCitacion} 
                            disabled={isGeneratingCitacion || !sujetoActivo.nombre}
                            className={`bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-3 rounded-lg text-sm font-bold hover:from-teal-700 hover:to-cyan-700 transition-colors w-full flex justify-center items-center gap-2 shadow-sm ${(isGeneratingCitacion || !sujetoActivo.nombre) ? 'opacity-50 cursor-not-allowed' : ''} ${isGeneratingCitacion ? 'pulse-ia' : ''}`}
                        >
                            ✨ {isGeneratingCitacion ? 'Redactando citación jurídica...' : 'Redactar Citación Oficial (IA)'}
                        </button>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm flex flex-col">
                        <h5 className="font-bold text-blue-800 mb-4 border-b pb-2">2. Pauta de Entrevista</h5>
                        <button 
                            onClick={handleGenerarPreguntas} 
                            disabled={isGeneratingPreguntas}
                            className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm border border-blue-700 px-4 py-3 rounded-lg text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-colors w-full flex justify-center items-center gap-2 mb-4 ${isGeneratingPreguntas ? 'pulse-ia opacity-80' : ''}`}
                        >
                            ✨ {isGeneratingPreguntas ? 'Generando preguntas...' : (entrevistaActual.preguntas.length > 0 ? 'Re-generar Preguntas' : 'Generar Preguntas con IA')}
                        </button>

                        {entrevistaActual.preguntas.length > 0 && (
                            <div className="flex-1 flex flex-col">
                                <div className="overflow-y-auto max-h-[300px] pr-2 space-y-4 mb-4">
                                    {entrevistaActual.preguntas.map((p, i) => (
                                        <div key={i} className="bg-blue-50/50 p-3 rounded border border-blue-200">
                                            <label className="block text-sm font-bold text-blue-900 mb-2">{i+1}. {p}</label>
                                            <textarea 
                                                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-white h-20" 
                                                placeholder="Escriba la respuesta literal aquí..."
                                                value={entrevistaActual.respuestas[i] || ''}
                                                onChange={(e) => guardarRespuesta(i, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => onPrintActa(sujetoActivo.nombre, entrevistaActual.preguntas, entrevistaActual.respuestas)} 
                                    className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-black text-sm flex justify-center items-center gap-2 mt-auto"
                                >
                                    🖨️ Imprimir Acta de Entrevista
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
