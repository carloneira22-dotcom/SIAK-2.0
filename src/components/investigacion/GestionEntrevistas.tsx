import React, { useState } from 'react';
import { FormData } from '../../types';
import { generarPreguntas, redactarCitacion } from '../../services/geminiService';

interface GestionEntrevistasProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    onPrintActa: (entrevistado: string, preguntas: string[], respuestas: Record<number, string>) => void;
    onPrintCitacion: (html: string) => void;
    setErrorMessage: (msg: string) => void;
}

export function GestionEntrevistas({ formData, setFormData, onPrintActa, onPrintCitacion, setErrorMessage }: GestionEntrevistasProps) {
    const [sujetoActivoId, setSujetoActivoId] = useState('denunciante');
    const [isGeneratingCitacion, setIsGeneratingCitacion] = useState(false);
    const [isGeneratingPreguntas, setIsGeneratingPreguntas] = useState(false);

    const sujetos = [
        { id: 'denunciante', rol: 'Denunciante', nombre: formData.denuncia?.quienDenuncia === 'Victima' ? formData.victima?.nombre : formData.denuncianteTercero?.nombre },
        { id: 'denunciado', rol: 'Denunciado/a', nombre: formData.denunciado?.nombre },
        ...formData.investigacion.testigos.map((t, i) => ({ id: `testigo-${i}`, rol: 'Testigo', nombre: t }))
    ];

    const sujetoActivo = sujetos.find(s => s.id === sujetoActivoId) || sujetos[0];
    const entrevistaActual = formData.investigacion.entrevistas[sujetoActivo.id] || { preguntas: [], respuestas: {} };

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
                formData.investigador?.nombre || '', 
                formData.investigacion.fechaCitacion, 
                formData.investigacion.horaCitacion, 
                formData.investigacion.lugarCitacion,
                sujetoActivo.rol
            );
            if (html) {
                const htmlImprimir = `
                    <div class="p-8 font-serif">
                        <div class="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                            <img src="/logo.png" onerror="this.onerror=null;this.src='https://placehold.co/150x150/white/black?text=LOGO+DAEM';" alt="Logo DAEM" class="h-20 object-contain grayscale">
                        </div>
                        <div class="text-right mb-8">
                            <p class="font-bold">CAÑETE, ${new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div class="mb-8">
                            <p><b>A :</b> ${sujetoActivo.nombre}</p>
                            <p><b>DE :</b> ${formData.investigador.nombre}</p>
                            <hr class="border-t border-black mt-2">
                        </div>
                        <h2 class="text-xl font-black uppercase mt-4 text-center mb-8">Citación Oficial a Entrevista Investigativa</h2>
                        <div class="text-justify leading-relaxed text-sm">
                            ${html}
                        </div>
                        <div class="mt-24 flex h-2 w-full">
                            <div class="bg-green-500 w-1/3"></div>
                            <div class="bg-orange-400 w-1/3"></div>
                            <div class="bg-blue-500 w-1/3"></div>
                        </div>
                        <div class="flex justify-between text-[10px] mt-1 text-gray-600">
                            <span>Arturo Prat 220, 3er. Piso</span>
                            <span>Fono 41 2758600</span>
                            <span>direccion@daemcanete.cl</span>
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

    const handleGenerarPreguntas = async () => {
        setErrorMessage('');
        setIsGeneratingPreguntas(true);
        try {
            const pregs = await generarPreguntas(formData.hechos.relato, formData.hechos.tipo, sujetoActivo.rol);
            if (pregs.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    investigacion: {
                        ...prev.investigacion,
                        entrevistas: {
                            ...prev.investigacion.entrevistas,
                            [sujetoActivo.id]: {
                                ...prev.investigacion.entrevistas[sujetoActivo.id],
                                preguntas: pregs
                            }
                        }
                    }
                }));
            } else {
                setErrorMessage("SIAK: No se pudieron generar las preguntas. Intente nuevamente.");
            }
        } catch (error) {
            setErrorMessage("SIAK: Error al conectar con el Asistente Jurídico para generar preguntas.");
        } finally {
            setIsGeneratingPreguntas(false);
        }
    };

    const guardarRespuesta = (index: number, valor: string) => {
        setFormData(prev => ({
            ...prev,
            investigacion: {
                ...prev.investigacion,
                entrevistas: {
                    ...prev.investigacion.entrevistas,
                    [sujetoActivo.id]: {
                        ...prev.investigacion.entrevistas[sujetoActivo.id],
                        respuestas: {
                            ...(prev.investigacion.entrevistas[sujetoActivo.id]?.respuestas || {}),
                            [index]: valor
                        }
                    }
                }
            }
        }));
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 border-b pb-2">Gestión de Entrevistas y Citaciones</h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
                {sujetos.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setSujetoActivoId(s.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                            sujetoActivoId === s.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {s.rol}: {s.nombre || 'Sin nombre'}
                    </button>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl mb-6">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <span>📅</span> Citación para {sujetoActivo.rol}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-bold text-blue-800 uppercase">Fecha</label>
                        <input 
                            type="date" 
                            className="w-full p-2 border border-blue-200 rounded-lg text-sm bg-white mt-1"
                            value={formData.investigacion.fechaCitacion}
                            onChange={(e) => setFormData(prev => ({ ...prev, investigacion: { ...prev.investigacion, fechaCitacion: e.target.value } }))}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-blue-800 uppercase">Hora</label>
                        <input 
                            type="time" 
                            className="w-full p-2 border border-blue-200 rounded-lg text-sm bg-white mt-1"
                            value={formData.investigacion.horaCitacion}
                            onChange={(e) => setFormData(prev => ({ ...prev, investigacion: { ...prev.investigacion, horaCitacion: e.target.value } }))}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-blue-800 uppercase">Lugar</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-blue-200 rounded-lg text-sm bg-white mt-1"
                            placeholder="Ej: DAEM Cañete"
                            value={formData.investigacion.lugarCitacion}
                            onChange={(e) => setFormData(prev => ({ ...prev, investigacion: { ...prev.investigacion, lugarCitacion: e.target.value } }))}
                        />
                    </div>
                </div>
                <button 
                    onClick={handleGenerarCitacion}
                    disabled={isGeneratingCitacion}
                    className={`w-full bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors shadow-sm flex items-center justify-center gap-2 ${isGeneratingCitacion ? 'opacity-50 cursor-not-allowed pulse-ia' : ''}`}
                >
                    ✨ {isGeneratingCitacion ? 'Redactando citación...' : 'Generar Citación Oficial'}
                </button>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                        <span>🎙️</span> Entrevista a {sujetoActivo.rol}
                    </h4>
                    <button 
                        onClick={handleGenerarPreguntas}
                        disabled={isGeneratingPreguntas || !formData.hechos.relato}
                        className={`bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 ${isGeneratingPreguntas ? 'opacity-50 cursor-not-allowed pulse-ia' : ''}`}
                    >
                        ✨ {isGeneratingPreguntas ? 'Analizando relato...' : 'Sugerir Preguntas Clave'}
                    </button>
                </div>
                
                {!formData.hechos.relato && (
                    <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded border border-amber-200 mb-4">
                        ⚠️ Debe ingresar el relato de los hechos en el paso anterior para que SIAK pueda sugerir preguntas.
                    </p>
                )}

                <div className="space-y-4">
                    {entrevistaActual.preguntas.map((p, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                            <p className="text-sm font-bold text-indigo-900 mb-2">P{i+1}: {p}</p>
                            <textarea 
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                rows={3}
                                placeholder="Registre la respuesta textual del entrevistado aquí..."
                                value={entrevistaActual.respuestas[i] || ''}
                                onChange={(e) => guardarRespuesta(i, e.target.value)}
                            ></textarea>
                        </div>
                    ))}
                    {entrevistaActual.preguntas.length === 0 && (
                        <div className="text-center py-8 bg-white rounded-lg border border-dashed border-indigo-200">
                            <p className="text-sm text-indigo-400">Haga clic en "Sugerir Preguntas Clave" para que SIAK analice el caso y formule las preguntas.</p>
                        </div>
                    )}
                </div>

                {entrevistaActual.preguntas.length > 0 && (
                    <button 
                        onClick={() => onPrintActa(sujetoActivo.nombre || 'Sin nombre', entrevistaActual.preguntas, entrevistaActual.respuestas)}
                        className="w-full mt-6 bg-gray-800 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-black transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        🖨️ Imprimir Acta de Entrevista
                    </button>
                )}
            </div>
        </div>
    );
}
