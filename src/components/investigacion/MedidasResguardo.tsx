import React, { useState } from 'react';
import { FormData } from '../../types';
import { redactarDerivacionACHS, redactarOficioSeparacion } from '../../services/geminiService';

interface MedidasResguardoProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    onPrintCitacion: (html: string) => void;
    setErrorMessage: (msg: string) => void;
}

export function MedidasResguardo({ formData, setFormData, onPrintCitacion, setErrorMessage }: MedidasResguardoProps) {
    const [isGeneratingDerivacion, setIsGeneratingDerivacion] = useState(false);
    const [isGeneratingOficio, setIsGeneratingOficio] = useState(false);

    const handleGenerarDerivacion = async () => {
        setErrorMessage('');
        setIsGeneratingDerivacion(true);
        try {
            const html = await redactarDerivacionACHS(
                formData.victima?.nombre || '',
                formData.victima?.rut || '',
                formData.victima?.establecimiento || '',
                formData.hechos.tipo || 'Denuncia Ley Karin',
                formData.investigador?.nombre || ''
            );
            if (html) {
                setFormData(prev => ({
                    ...prev,
                    investigacion: {
                        ...prev.investigacion,
                        textoDerivacion: html
                    }
                }));
                
                const htmlImprimir = `
                    <div class="p-8 font-serif">
                        <div class="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                            <img src="/logo.png" onerror="this.onerror=null;this.src='https://placehold.co/150x150/white/black?text=LOGO+DAEM';" alt="Logo DAEM" class="h-20 object-contain grayscale">
                        </div>
                        <div class="text-right mb-8">
                            <p class="font-bold">CAÑETE, ${new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div class="mb-8">
                            <p><b>A :</b> Unidad de Prevención de Riesgos ACHS/MUTUAL</p>
                            <p><b>DE :</b> ${formData.investigador.nombre}</p>
                            <hr class="border-t border-black mt-2">
                        </div>
                        <h2 class="text-xl font-black uppercase mt-4 text-center mb-8">Derivación a Unidad de Prevención de Riesgos</h2>
                        <div class="text-justify leading-relaxed text-sm whitespace-pre-line">
                            ${html}
                        </div>
                        <div class="mt-24 text-xs">
                            <p class="font-bold">DISTRIBUCIÓN:</p>
                            <p>- Unidad de Personal</p>
                            <p>- Prevencionista de riesgos</p>
                            ${formData.investigacion.idDocDerivacion ? `<p class="mt-4 font-bold">ID DOC: ${formData.investigacion.idDocDerivacion}</p>` : ''}
                        </div>
                        <div class="mt-12 flex h-2 w-full">
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
                setErrorMessage("SIAK: No se pudo generar la derivación. Intente nuevamente.");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("SIAK: Error al conectar con el Asistente Jurídico para redactar la derivación.");
        } finally {
            setIsGeneratingDerivacion(false);
        }
    };

    const handlePrintDerivacion = () => {
        if (!formData.investigacion.textoDerivacion) return;
        
        const htmlImprimir = `
            <div class="p-8 font-serif">
                <div class="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                    <img src="/logo.png" onerror="this.onerror=null;this.src='https://placehold.co/150x150/white/black?text=LOGO+DAEM';" alt="Logo DAEM" class="h-20 object-contain grayscale">
                </div>
                <div class="text-right mb-8">
                    <p class="font-bold">CAÑETE, ${new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div class="mb-8">
                    <p><b>A :</b> Unidad de Prevención de Riesgos ACHS/MUTUAL</p>
                    <p><b>DE :</b> ${formData.investigador.nombre}</p>
                    <hr class="border-t border-black mt-2">
                </div>
                <h2 class="text-xl font-black uppercase mt-4 text-center mb-8">Derivación a Unidad de Prevención de Riesgos</h2>
                <div class="text-justify leading-relaxed text-sm whitespace-pre-line">
                    ${formData.investigacion.textoDerivacion}
                </div>
                <div class="mt-24 text-xs">
                    <p class="font-bold">DISTRIBUCIÓN:</p>
                    <p>- Unidad de Personal</p>
                    <p>- Prevencionista de riesgos</p>
                    ${formData.investigacion.idDocDerivacion ? `<p class="mt-4 font-bold">ID DOC: ${formData.investigacion.idDocDerivacion}</p>` : ''}
                </div>
                <div class="mt-12 flex h-2 w-full">
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
                sujetoNombre = formData.victima?.nombre || '';
                sujetoRol = 'Víctima / Denunciante';
            } else if (formData.investigacion.separacionSujeto === 'Denunciado') {
                sujetoNombre = formData.denunciado?.nombre || '';
                sujetoRol = 'Denunciado/a';
            }

            const html = await redactarOficioSeparacion(
                sujetoNombre,
                sujetoRol,
                formData.investigacion.separacionNuevoEspacio,
                formData.investigacion.separacionNuevaFuncion,
                formData.investigador?.nombre || ''
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
                            <p><b>A :</b> Director DAEM y Jefe de Personal</p>
                            <p><b>DE :</b> ${formData.investigador.nombre}</p>
                            <hr class="border-t border-black mt-2">
                        </div>
                        <h2 class="text-xl font-black uppercase mt-4 text-center mb-8">Oficio de Medida de Resguardo: Separación de Espacios y Funciones</h2>
                        <div class="text-justify leading-relaxed text-sm">
                            ${html}
                        </div>
                        <div class="mt-24 text-xs">
                            <p class="font-bold">DISTRIBUCIÓN:</p>
                            <p>- Unidad de Personal</p>
                            <p>- Partes</p>
                            <p>- La indicada</p>
                            <p>- Archivo</p>
                            <p class="mt-4 font-bold">ID DOC: ${Math.floor(Math.random() * 10000000)}</p>
                        </div>
                        <div class="mt-12 flex h-2 w-full">
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
                setErrorMessage("SIAK: No se pudo generar el oficio. Intente nuevamente.");
            }
        } catch (error) {
            setErrorMessage("SIAK: Error al conectar con el Asistente Jurídico para redactar el oficio.");
        } finally {
            setIsGeneratingOficio(false);
        }
    };

    return (
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
                <div className="ml-8 mb-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="mb-3">
                        <label className="text-xs font-bold text-slate-500 uppercase">ID DOC (Opcional)</label>
                        <input 
                            type="text"
                            className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white mt-1"
                            placeholder="Ej: 1234567"
                            value={formData.investigacion.idDocDerivacion || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, investigacion: { ...prev.investigacion, idDocDerivacion: e.target.value } }))}
                        />
                    </div>
                    <button 
                        onClick={handleGenerarDerivacion}
                        disabled={isGeneratingDerivacion || !formData.victima?.nombre}
                        className={`w-full bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm flex items-center justify-center gap-2 ${isGeneratingDerivacion ? 'opacity-50 cursor-not-allowed pulse-ia' : ''}`}
                    >
                        ✨ {isGeneratingDerivacion ? 'Redactando derivación...' : 'Generar Oficio de Derivación a Prevención de Riesgos'}
                    </button>
                    {!formData.victima?.nombre && <p className="text-xs text-red-500 mt-1">Debe registrar el nombre de la víctima en el paso anterior.</p>}
                    
                    {formData.investigacion.textoDerivacion && (
                        <button 
                            onClick={handlePrintDerivacion} 
                            className="w-full mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            🖨️ Volver a Imprimir Oficio de Derivación
                        </button>
                    )}
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
                                <option value="Victima">Víctima: {formData.victima?.nombre || 'No registrado'}</option>
                                <option value="Denunciado">Denunciado/a: {formData.denunciado?.nombre || 'No registrado'}</option>
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
    );
}
