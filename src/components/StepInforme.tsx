import React from 'react';
import { FormData } from '../types';

interface StepInformeProps {
    formData: FormData;
    onPrintInforme: (html: string) => void;
}

export function StepInforme({ formData, onPrintInforme }: StepInformeProps) {
    const testigosListaHTML = formData.investigacion.testigos.length > 0 
        ? formData.investigacion.testigos.map(t => `<li>${t}</li>`).join('')
        : '<li><i>No se individualizaron testigos adicionales.</i></li>';

    const informeHTML = `
        <div class="p-8 font-serif">
            <div class="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-6">
                <!-- Logo DAEM para Impresión -->
                <img src="https://placehold.co/150x150/white/black?text=LOGO+DAEM" alt="Logo DAEM" class="h-20 object-contain grayscale">
                <div class="text-right">
                    <p class="text-xs font-bold">REPUBLICA DE CHILE</p>
                    <p class="text-xs font-bold">DAEM CAÑETE</p>
                </div>
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
                    Se presenta informe investigativo de la denuncia originada por <b>${formData.denuncia.quienDenuncia === 'Victima' ? formData.victima.nombre : formData.denuncianteTercero.nombre}</b> 
                    (Víctima: <b>${formData.victima.nombre}</b>), en contra de <b>${formData.denunciado.nombre}</b>, 
                    regido bajo el marco normativo de <b>${formData.denunciado.calidad}</b>.
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

                <div class="mt-24 flex justify-between px-8">
                    <div class="border-t border-gray-800 pt-2 text-center text-xs w-2/5">
                        <b>FIRMA INVESTIGADOR/A</b><br>${formData.perfil}
                    </div>
                    <div class="border-t border-gray-800 pt-2 text-center text-xs w-2/5">
                        <b>TOMA DE CONOCIMIENTO</b><br>Director(a) DAEM / Sostenedor
                    </div>
                </div>
            </div>
        </div>
    `;

    return (
        <div className="step-content active bg-white p-8 border rounded-xl shadow-inner overflow-y-auto">
            <div dangerouslySetInnerHTML={{ __html: informeHTML }} />
            <div className="mt-8 text-center no-print">
                <button 
                    onClick={() => onPrintInforme(informeHTML)} 
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-black transition-colors shadow-lg"
                >
                    🖨️ Imprimir Informe Final Oficial
                </button>
            </div>
        </div>
    );
}
