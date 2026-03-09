import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Header } from './components/Header';
import { Stepper } from './components/Stepper';
import { StepPerfil } from './components/StepPerfil';
import { StepDenuncia } from './components/StepDenuncia';
import { StepInvestigacion } from './components/StepInvestigacion';
import { StepAnalisis } from './components/StepAnalisis';
import { StepInforme } from './components/StepInforme';
import { Portal } from './components/Portal';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { INITIAL_FORM_DATA, STEPS_INFO } from './constants';
import { FormData } from './types';
import { calcularDiasRestantes } from './utils/dateUtils';
import { supabase } from './services/supabase';

export type AppContext = {
    region: string;
    provincia: string;
    comuna: string;
    sector: string;
};

export default function App() {
    const [view, setView] = useState<'portal' | 'superadmin' | 'siak'>('portal');
    const [appContext, setAppContext] = useState<AppContext | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [isValid, setIsValid] = useState(false);
    const [printContent, setPrintContent] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        const checkValidation = () => {
            let valid = true;
            if (currentStep === 0) {
                valid = formData.perfil !== '' && 
                        (formData.investigador?.nombre || '').trim() !== '' && 
                        (formData.investigador?.rut || '').trim() !== '' && 
                        (formData.investigador?.email || '').trim() !== '';
            }
            if (currentStep === 1) {
                valid = (formData.victima?.nombre || '') !== '' &&
                        (formData.victima?.rut || '') !== '' &&
                        (formData.denunciado?.nombre || '') !== '' &&
                        (formData.denunciado?.calidad || '') !== '' &&
                        (formData.hechos?.tipo || '') !== '' &&
                        (formData.denuncia?.quienDenuncia || '') !== '';
            }
            setIsValid(valid);
        };
        checkValidation();
    }, [formData, currentStep]);

    const nextStep = () => {
        if (!isValid) return;
        if (currentStep < STEPS_INFO.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else if (currentStep === STEPS_INFO.length - 1) {
            // Reset
            setCurrentStep(0);
            setFormData(INITIAL_FORM_DATA);
            setSaveMessage(null);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSaveToSupabase = async () => {
        setIsSaving(true);
        setSaveMessage(null);
        try {
            const { data, error } = await supabase
                .from('investigaciones')
                .insert([
                    {
                        region: appContext?.region || 'No especificada',
                        provincia: appContext?.provincia || 'No especificada',
                        comuna: appContext?.comuna || 'No especificada',
                        sector: appContext?.sector || 'No especificado',
                        investigador_rut: formData.investigador.rut,
                        victima_rut: formData.victima.rut,
                        denunciado_nombre: formData.denunciado.nombre,
                        tipo_hecho: formData.hechos.tipo,
                        estado: 'Finalizada',
                        form_data: formData
                    }
                ]);

            if (error) throw error;
            
            setSaveMessage({ type: 'success', text: '✅ Investigación guardada exitosamente en la base de datos.' });
        } catch (error: any) {
            console.error('Error saving to Supabase:', error);
            setSaveMessage({ type: 'error', text: `❌ Error al guardar: ${error.message || 'Error de conexión'}` });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrintDenuncia = () => {
        const comunaText = appContext?.comuna || "CAÑETE";
        const sectorText = appContext?.sector || "DAEM";
        
        const html = `
            <div class="p-8 font-serif">
                <div class="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                    <img src="/logo.png" onerror="this.onerror=null;this.src='https://placehold.co/150x150/white/black?text=LOGO+${sectorText}';" alt="Logo ${sectorText}" class="h-20 object-contain grayscale">
                </div>
                <div class="text-right mb-8">
                    <p class="font-bold uppercase">${comunaText}, ${formData.denuncia.fecha ? new Date(formData.denuncia.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : '___ de ____________ de 20__'}</p>
                </div>
                <div class="text-center mb-8">
                    <h2 class="text-xl font-black uppercase">ACTA DE DENUNCIA DE VIOLENCIA EN EL TRABAJO, ACOSO LABORAL O SEXUAL</h2>
                </div>
                
                <div class="mb-6 space-y-4">
                    <p><b>FECHA DE DENUNCIA:</b> ${formData.denuncia.fecha || '____________________'} <b>HORA:</b> ${formData.denuncia.hora || '________'}</p>
                    <p><b>TIPO DE DENUNCIA:</b> ${formData.hechos.tipo || '________________________________________'}</p>
                    <p><b>QUIEN REALIZA LA DENUNCIA:</b> ${formData.denuncia.quienDenuncia || '____________________'}</p>
                </div>

                <h3 class="font-bold border-b border-gray-400 mb-4 pb-1 text-lg">I. Datos de la Víctima</h3>
                <div class="mb-6 space-y-2">
                    <p><b>Nombre completo:</b> ${formData.victima.nombre || '________________________________________________________'}</p>
                    <p><b>RUT:</b> ${formData.victima.rut || '____________________'}</p>
                    <p><b>Establecimiento:</b> ${formData.victima.establecimiento || '________________________________________________________'}</p>
                    <p><b>Función:</b> ${formData.victima.funcion || '________________________________________________________'}</p>
                    <p><b>Teléfono:</b> ${formData.victima.telefono || '____________________'} <b>Email:</b> ${formData.victima.email || '________________________________________'}</p>
                </div>

                ${formData.denuncia.quienDenuncia === 'Tercero' ? `
                <h3 class="font-bold border-b border-gray-400 mb-4 pb-1 text-lg">II. Datos del Denunciante (Tercero)</h3>
                <div class="mb-6 space-y-2">
                    <p><b>Nombre completo:</b> ${formData.denuncianteTercero.nombre || '________________________________________________________'}</p>
                    <p><b>Función:</b> ${formData.denuncianteTercero.funcion || '________________________________________________________'}</p>
                    <p><b>Establecimiento:</b> ${formData.denuncianteTercero.establecimiento || '________________________________________________________'}</p>
                </div>
                ` : ''}

                <h3 class="font-bold border-b border-gray-400 mb-4 pb-1 text-lg">${formData.denuncia.quienDenuncia === 'Tercero' ? 'III' : 'II'}. Datos del Denunciado/a</h3>
                <div class="mb-6 space-y-2">
                    <p><b>Nombre completo:</b> ${formData.denunciado.nombre || '________________________________________________________'}</p>
                    <p><b>Función:</b> ${formData.denunciado.funcion || '________________________________________________________'}</p>
                    <p><b>Establecimiento:</b> ${formData.denunciado.establecimiento || '________________________________________________________'}</p>
                </div>

                <h3 class="font-bold border-b border-gray-400 mb-4 pb-1 text-lg">${formData.denuncia.quienDenuncia === 'Tercero' ? 'IV' : 'III'}. Narración de los Hechos</h3>
                <div class="mb-8 p-4 border border-gray-400 min-h-[200px] text-justify whitespace-pre-wrap">
                    ${formData.hechos.relato || '________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________'}
                </div>

                <div class="mt-32 flex justify-between px-10">
                    <div class="border-t border-gray-800 pt-2 text-center text-xs w-2/5">
                        <b>FIRMA DEL/A DENUNCIANTE</b><br>${formData.denuncia.quienDenuncia === 'Tercero' ? formData.denuncianteTercero.nombre : formData.victima.nombre}
                    </div>
                    <div class="border-t border-gray-800 pt-2 text-center text-xs w-2/5">
                        <b>FIRMA FUNCIONARIO/A RECEPTOR/A</b><br>${formData.investigador.nombre}<br>${formData.perfil}
                    </div>
                </div>

                <div class="mt-24 flex h-2 w-full">
                    <div class="bg-green-500 w-1/3"></div>
                    <div class="bg-orange-400 w-1/3"></div>
                    <div class="bg-blue-500 w-1/3"></div>
                </div>
            </div>
        `;
        triggerPrint(html);
    };

    const handlePrintActa = (entrevistado: string, preguntas: string[], respuestas: Record<number, string>) => {
        if (preguntas.length === 0) {
            return;
        }

        const nombreTestigo = entrevistado || "_____________________________________________";
        const comunaText = appContext?.comuna || "CAÑETE";
        const sectorText = appContext?.sector || "DAEM";

        const bloquePreguntas = preguntas.map((p, i) => `
            <div class="mb-5">
                <p class="font-bold text-sm text-gray-800 mb-2">${i+1}. ${p}</p>
                <div class="p-3 border border-gray-400 min-h-[60px] text-sm italic bg-gray-50 text-gray-700">
                    ${respuestas[i] || '<br><br>'}
                </div>
            </div>
        `).join('');

        const html = `
            <div class="p-8 font-serif">
                <div class="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                    <img src="/logo.png" onerror="this.onerror=null;this.src='https://placehold.co/150x150/white/black?text=LOGO+${sectorText}';" alt="Logo ${sectorText}" class="h-20 object-contain grayscale">
                </div>
                <div class="text-right mb-8">
                    <p class="font-bold uppercase">${comunaText}, ${new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div class="mb-8">
                    <p><b>A :</b> ${nombreTestigo}</p>
                    <p><b>DE :</b> ${formData.investigador.nombre}</p>
                    <hr class="border-t border-black mt-2">
                </div>
                <div class="text-center">
                    <h2 class="text-xl font-black uppercase mt-4">Acta Oficial de Entrevista - Ley N° 21.643</h2>
                </div>
                
                <div class="mb-8 text-sm space-y-2 border p-4 bg-slate-50 mt-6">
                    <p><b>FECHA DE DILIGENCIA:</b> ${new Date().toLocaleDateString()}</p>
                    <p><b>TESTIGO / DECLARANTE:</b> ${nombreTestigo || '_____________________________________________'}</p>
                    <p><b>INVESTIGADOR A CARGO:</b> ${formData.investigador?.nombre || ''} (${formData.perfil})</p>
                    <p><b>MATERIA DENUNCIADA:</b> ${formData.hechos.tipo}</p>
                </div>
                
                <h3 class="font-bold border-b border-gray-400 mb-4 pb-1 text-lg">I. Registro Íntegro de Declaración</h3>
                ${bloquePreguntas}
                
                <div class="mt-8 text-sm text-justify">
                    <p>Previa lectura y ratificación de la presente acta, las partes comparecientes firman en señal de comprobante y conformidad con el registro íntegro de la declaración, la cual será anexada al expediente investigativo principal.</p>
                </div>

                <div class="mt-32 flex justify-between px-10">
                    <div class="border-t border-gray-800 pt-2 text-center text-xs w-2/5">
                        <b>FIRMA INVESTIGADOR/A</b><br>${formData.investigador?.nombre || ''}<br>${formData.perfil}
                    </div>
                    <div class="border-t border-gray-800 pt-2 text-center text-xs w-2/5">
                        <b>FIRMA DECLARANTE</b><br>${nombreTestigo || 'Nombre y RUN'}
                    </div>
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
        triggerPrint(html);
    };

    const triggerPrint = (html: string) => {
        setPrintContent(html);
    };

    const diasInfo = calcularDiasRestantes(formData.denuncia?.fecha || '');

    const handleSelectModule = (context: AppContext) => {
        setAppContext(context);
        setView('siak');
    };

    if (view === 'portal') {
        return <Portal onSelectRole={(role) => setView(role === 'admin' ? 'superadmin' : 'siak')} />;
    }

    if (view === 'superadmin') {
        return <SuperAdminDashboard onSelectModule={handleSelectModule} onLogout={() => setView('portal')} />;
    }

    return (
        <div className="bg-gray-50 text-gray-800 font-sans min-h-screen p-2 md:p-6">
            {printContent ? (
                <div className="bg-white min-h-screen relative">
                    <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
                        <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded shadow font-bold hover:bg-blue-700">🖨️ Imprimir</button>
                        <button onClick={() => setPrintContent(null)} className="bg-gray-600 text-white px-4 py-2 rounded shadow font-bold hover:bg-gray-700">❌ Cerrar Vista</button>
                    </div>
                    <div id="print-area" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(printContent) }} />
                </div>
            ) : (
                <div className="max-w-5xl mx-auto" id="main-wrapper">
                    <div className="mb-4 flex justify-between items-center no-print">
                        <button onClick={() => setView('portal')} className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Volver al Inicio
                        </button>
                        {appContext && (
                            <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                {appContext.comuna} • {appContext.sector}
                            </div>
                        )}
                    </div>
                    <Header diasInfo={diasInfo} appContext={appContext} />
                    <Stepper currentStep={currentStep} />

                    <div id="app-container" className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">
                        <div className="p-6 md:p-8 flex-1">
                            {currentStep === 0 && <StepPerfil formData={formData} setFormData={setFormData} />}
                            {currentStep === 1 && <StepDenuncia formData={formData} setFormData={setFormData} onPrintDenuncia={handlePrintDenuncia} />}
                            {currentStep === 2 && <StepInvestigacion formData={formData} setFormData={setFormData} onPrintActa={handlePrintActa} onPrintCitacion={triggerPrint} />}
                            {currentStep === 3 && <StepAnalisis formData={formData} setFormData={setFormData} />}
                            {currentStep === 4 && <StepInforme formData={formData} setFormData={setFormData} onPrintInforme={triggerPrint} />}
                        </div>

                        <div className="p-4 bg-gray-50 border-t flex justify-between items-center no-print">
                            <button 
                                onClick={prevStep} 
                                disabled={currentStep === 0}
                                className={`px-4 py-2 font-bold rounded-lg ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                ⬅️ Atrás
                            </button>
                            
                            <div className="flex-1 flex justify-center px-4">
                                {!isValid && currentStep < 4 && (
                                    <div className="text-red-500 text-xs font-bold">⚠️ Faltan datos obligatorios</div>
                                )}
                                {currentStep === 4 && saveMessage && (
                                    <div className={`text-xs font-bold px-3 py-1 rounded-full ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {saveMessage.text}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {currentStep === 4 && (
                                    <button 
                                        onClick={handleSaveToSupabase}
                                        disabled={isSaving}
                                        className={`px-4 py-2 font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isSaving ? 'Guardando...' : '💾 Guardar en BD'}
                                    </button>
                                )}
                                <button 
                                    onClick={nextStep} 
                                    disabled={!isValid && currentStep < 4}
                                    className={`px-6 py-2 font-bold rounded-lg text-white ${!isValid && currentStep < 4 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
                                >
                                    {currentStep === 4 ? "Nuevo Proceso 🔄" : "Continuar ➡️"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
