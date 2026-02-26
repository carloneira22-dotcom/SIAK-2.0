import React from 'react';
import DOMPurify from 'dompurify';
import { FormData } from '../types';

interface StepInformeProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    onPrintInforme: (html: string) => void;
}

export function StepInforme({ formData, setFormData, onPrintInforme }: StepInformeProps) {
    const testigosListaHTML = formData.investigacion.testigos.length > 0 
        ? formData.investigacion.testigos.map(t => `<li>${t}</li>`).join('')
        : '<li><i>No se individualizaron testigos adicionales.</i></li>';

    const informeHTML = `
        <div class="p-8 font-serif">
            <div class="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                <!-- Logo DAEM para Impresión -->
                <img src="/logo.png" onerror="this.onerror=null;this.src='https://placehold.co/150x150/white/black?text=LOGO+DAEM';" alt="Logo DAEM" class="h-20 object-contain grayscale">
            </div>
            <div class="text-right mb-8">
                <p class="font-bold">CAÑETE, ${new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div class="mb-8">
                <p><b>A :</b> Director DAEM / Sostenedor</p>
                <p><b>DE :</b> ${formData.investigador.nombre}</p>
                <hr class="border-t border-black mt-2">
            </div>
            <div class="text-center">
                <h2 class="text-xl font-black uppercase mt-4">Informe Final de Investigación - Ley N° 21.643</h2>
                <p class="text-xs font-bold text-slate-500 mt-1">SISTEMA SIAK - EXPEDIENTE TÉCNICO</p>
            </div>
            
            <div class="space-y-6 text-sm text-slate-800 mt-6">
                <div class="bg-slate-50 p-4 border border-slate-200">
                    <p><b>MATERIA:</b> INFORME FINAL INVESTIGACIÓN POR ${formData.hechos.tipo.toUpperCase() || 'DENUNCIA'}.</p>
                    <p><b>FECHA DENUNCIA:</b> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <p class="text-justify leading-relaxed">
                    Se presenta informe investigativo de la denuncia originada por <b>${formData.denuncia?.quienDenuncia === 'Victima' ? formData.victima?.nombre : formData.denuncianteTercero?.nombre}</b> 
                    (Víctima: <b>${formData.victima?.nombre}</b>), en contra de <b>${formData.denunciado?.nombre}</b>, 
                    regido bajo el marco normativo de <b>${formData.denunciado?.calidad}</b>.
                </p>

                <h3 class="font-bold border-b border-gray-300 pb-1 mt-6 text-lg">I. Medidas de Resguardo</h3>
                <ul class="list-disc pl-6">
                    <li>Atención psicológica: <b>${formData.investigacion.atencionPsicologica ? 'SÍ OFRECIDA/DERIVADA' : 'NO DERIVADA'}</b></li>
                    <li>Separación de funciones: <b>${formData.investigacion.medidaSeparacion ? 'SÍ APLICADA' : 'NO APLICADA'}</b></li>
                </ul>

                <h3 class="font-bold border-b border-gray-300 pb-1 mt-6 text-lg">II. Nómina de Testigos y Entrevistas</h3>
                <ul class="list-disc pl-6 mb-2">
                    ${testigosListaHTML}
                </ul>
                <p class="text-xs italic text-gray-500">* Las actas de entrevistas individuales y sus respuestas se adjuntan en los anexos correspondientes a este informe.</p>

                <h3 class="font-bold border-b border-gray-300 pb-1 mt-6 text-lg">III. Descripción de los Hechos Denunciados</h3>
                <p class="p-4 bg-gray-50 italic border-l-4 border-gray-400">"${formData.hechos.relato || 'Sin relato detallado.'}"</p>

                <h3 class="font-bold border-b border-gray-300 pb-1 mt-6 text-lg">IV. Análisis Jurídico y Conclusión</h3>
                <p class="text-justify leading-relaxed">
                    <b>DETERMINACIÓN DE LA INVESTIGACIÓN:</b> Tras analizar los hechos y la prueba testimonial recopilada, se determina que la conducta está calificada como <b>${formData.analisis.conclusion.toUpperCase() || 'NO DETERMINADA'}</b>.
                </p>
                
                <!-- Aquí va la fundamentación generada por la IA -->
                <div class="p-4 border border-gray-300 bg-white mt-4 text-justify whitespace-pre-line">
                    ${formData.analisis.fundamentacion}
                </div>

                <p class="bg-blue-50 p-4 border border-blue-200 text-center font-bold text-lg mt-8 text-blue-900 rounded-lg">
                    PROPUESTA DISCIPLINARIA TÉCNICA:<br> ${formData.analisis.medidaPropuesta || 'SIN PROPUESTA / NO APLICA'}
                </p>
                
                ${formData.analisis.solicitudSumaria ? `
                <p class="bg-red-50 p-4 border border-red-200 text-center font-bold text-lg mt-4 text-red-900 rounded-lg">
                    SOLICITUD DE INVESTIGACIÓN SUMARIA AL ALCALDE DON JORGE RADONICH BARRA
                </p>
                ` : ''}

                <div class="mt-24 text-xs">
                    <p class="font-bold">DISTRIBUCIÓN:</p>
                    <p>- Unidad de Personal</p>
                    <p>- Director DAEM</p>
                    ${formData.analisis.idDoc ? `<p class="mt-4 font-bold">ID DOC: ${formData.analisis.idDoc}</p>` : ''}
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
        </div>
    `;

    const solicitudHTML = formData.analisis.solicitudSumaria ? `
        <div class="p-8 font-serif">
            <div class="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                <img src="/logo.png" onerror="this.onerror=null;this.src='https://placehold.co/150x150/white/black?text=LOGO+DAEM';" alt="Logo DAEM" class="h-20 object-contain grayscale">
            </div>
            <div class="text-right mb-8">
                <p class="font-bold">CAÑETE, ${new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div class="mb-8">
                <p><b>A :</b> DON JORGE RADONICH BARRA</p>
                <p><b>DE :</b> ${formData.investigador.nombre}</p>
                <hr class="border-t border-black mt-2">
            </div>
            <div class="mt-8 whitespace-pre-line text-justify leading-relaxed">
                ${formData.analisis.textoSumario || ''}
            </div>
            <div class="mt-24 text-xs">
                <p class="font-bold">DISTRIBUCIÓN:</p>
                <p>- Unidad de Personal</p>
                <p>- Director DAEM</p>
                ${formData.analisis.idDoc ? `<p class="mt-4 font-bold">ID DOC: ${formData.analisis.idDoc}</p>` : ''}
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
    ` : '';

    return (
        <div className="step-content active bg-white p-8 border rounded-xl shadow-inner overflow-y-auto">
            <div className="mb-6 no-print bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label className="block text-sm font-bold text-blue-900 mb-2">ID DOC (Opcional)</label>
                <input 
                    type="text" 
                    className="w-full md:w-1/3 p-2 text-sm border border-blue-300 rounded-lg bg-white" 
                    placeholder="Ej: 1234567"
                    value={formData.analisis.idDoc || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, analisis: { ...prev.analisis, idDoc: e.target.value } }))}
                />
                <p className="text-xs text-blue-700 mt-1">Ingrese el ID DOC si desea que aparezca en el informe impreso.</p>
            </div>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(informeHTML) }} />
            <div className="mt-8 text-center no-print flex flex-col md:flex-row justify-center gap-4">
                <button 
                    onClick={() => onPrintInforme(informeHTML)} 
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-black transition-colors shadow-lg"
                >
                    🖨️ Imprimir Informe Final Oficial
                </button>
                {formData.analisis.solicitudSumaria && (
                    <button 
                        onClick={() => onPrintInforme(solicitudHTML)} 
                        className="bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition-colors shadow-lg"
                    >
                        🖨️ Imprimir Solicitud de Sumario
                    </button>
                )}
            </div>
        </div>
    );
}
