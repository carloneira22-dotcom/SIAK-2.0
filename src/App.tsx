import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Stepper } from './components/Stepper';
import { StepPerfil } from './components/StepPerfil';
import { StepDenuncia } from './components/StepDenuncia';
import { StepInvestigacion } from './components/StepInvestigacion';
import { StepAnalisis } from './components/StepAnalisis';
import { StepInforme } from './components/StepInforme';
import { INITIAL_FORM_DATA, STEPS_INFO } from './constants';
import { FormData } from './types';
import { calcularDiasRestantes } from './utils/dateUtils';

export default function App() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [isValid, setIsValid] = useState(false);
    const [printContent, setPrintContent] = useState<string | null>(null);

    useEffect(() => {
        const checkValidation = () => {
            let valid = true;
            if (currentStep === 0) {
                valid = formData.perfil !== '' && 
                        formData.investigador.nombre.trim() !== '' && 
                        formData.investigador.rut.trim() !== '' && 
                        formData.investigador.email.trim() !== '';
            }
            if (currentStep === 1) {
                valid = formData.victima.nombre !== '' &&
                        formData.victima.rut !== '' &&
                        formData.denunciado.nombre !== '' &&
                        formData.denunciado.calidad !== '' &&
                        formData.hechos.tipo !== '' &&
                        formData.denuncia.quienDenuncia !== '';
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
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handlePrintActa = (entrevistado: string, preguntas: string[], respuestas: Record<number, string>) => {
        if (preguntas.length === 0) {
            return;
        }

        const nombreTestigo = entrevistado || "_____________________________________________";

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
                    <img src="https://placehold.co/150x150/white/black?text=LOGO+DAEM" alt="Logo DAEM" class="h-20 object-contain grayscale">
                    <div class="text-right">
                        <p class="text-xs font-bold">REPUBLICA DE CHILE</p>
                        <p class="text-xs font-bold">DAEM CAÑETE</p>
                    </div>
                </div>
                <div class="text-center">
                    <h2 class="text-xl font-black uppercase mt-4">Acta Oficial de Entrevista - Ley N° 21.643</h2>
                </div>
                
                <div class="mb-8 text-sm space-y-2 border p-4 bg-slate-50 mt-6">
                    <p><b>FECHA DE DILIGENCIA:</b> ${new Date().toLocaleDateString()}</p>
                    <p><b>TESTIGO / DECLARANTE:</b> ${nombreTestigo || '_____________________________________________'}</p>
                    <p><b>INVESTIGADOR A CARGO:</b> ${formData.investigador.nombre} (${formData.perfil})</p>
                    <p><b>MATERIA DENUNCIADA:</b> ${formData.hechos.tipo}</p>
                </div>
                
                <h3 class="font-bold border-b border-gray-400 mb-4 pb-1 text-lg">I. Registro Íntegro de Declaración</h3>
                ${bloquePreguntas}
                
                <div class="mt-8 text-sm text-justify">
                    <p>Previa lectura y ratificación de la presente acta, las partes comparecientes firman en señal de comprobante y conformidad con el registro íntegro de la declaración, la cual será anexada al expediente investigativo principal.</p>
                </div>

                <div class="mt-32 flex justify-between px-10">
                    <div class="border-t border-gray-800 pt-2 text-center text-xs w-2/5">
                        <b>FIRMA INVESTIGADOR/A</b><br>${formData.investigador.nombre}<br>${formData.perfil}
                    </div>
                    <div class="border-t border-gray-800 pt-2 text-center text-xs w-2/5">
                        <b>FIRMA DECLARANTE</b><br>${nombreTestigo || 'Nombre y RUN'}
                    </div>
                </div>
            </div>
        `;
        triggerPrint(html);
    };

    const triggerPrint = (html: string) => {
        setPrintContent(html);
    };

    const diasInfo = calcularDiasRestantes(formData.denuncia.fecha);

    return (
        <div className="bg-gray-50 text-gray-800 font-sans min-h-screen p-2 md:p-6">
            {printContent ? (
                <div className="bg-white min-h-screen relative">
                    <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
                        <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded shadow font-bold hover:bg-blue-700">🖨️ Imprimir</button>
                        <button onClick={() => setPrintContent(null)} className="bg-gray-600 text-white px-4 py-2 rounded shadow font-bold hover:bg-gray-700">❌ Cerrar Vista</button>
                    </div>
                    <div id="print-area" dangerouslySetInnerHTML={{ __html: printContent }} />
                </div>
            ) : (
                <div className="max-w-5xl mx-auto" id="main-wrapper">
                    <Header diasInfo={diasInfo} />
                    <Stepper currentStep={currentStep} />

                    <div id="app-container" className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">
                        <div className="p-6 md:p-8 flex-1">
                            {currentStep === 0 && <StepPerfil formData={formData} setFormData={setFormData} />}
                            {currentStep === 1 && <StepDenuncia formData={formData} setFormData={setFormData} />}
                            {currentStep === 2 && <StepInvestigacion formData={formData} setFormData={setFormData} onPrintActa={handlePrintActa} onPrintCitacion={triggerPrint} />}
                            {currentStep === 3 && <StepAnalisis formData={formData} setFormData={setFormData} />}
                            {currentStep === 4 && <StepInforme formData={formData} onPrintInforme={triggerPrint} />}
                        </div>

                        <div className="p-4 bg-gray-50 border-t flex justify-between items-center no-print">
                            <button 
                                onClick={prevStep} 
                                disabled={currentStep === 0}
                                className={`px-4 py-2 font-bold rounded-lg ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                ⬅️ Atrás
                            </button>
                            {!isValid && currentStep < 4 && (
                                <div className="text-red-500 text-xs font-bold">⚠️ Faltan datos obligatorios</div>
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
            )}
        </div>
    );
}
