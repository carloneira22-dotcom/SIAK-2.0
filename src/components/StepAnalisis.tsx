import React, { useState } from 'react';
import { FormData } from '../types';
import { analizarCaso } from '../services/geminiService';

interface StepAnalisisProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function StepAnalisis({ formData, setFormData }: StepAnalisisProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAnalisisSenior = async () => {
        setErrorMessage('');
        
        let hasAnswers = false;
        const entrevistasParaAnalisis: { rol: string, preguntas: string[], respuestas: Record<number, string> }[] = [];
        
        Object.entries(formData.investigacion.entrevistas).forEach(([id, ent]) => {
            const respuestas = Object.values(ent.respuestas).filter(r => r.trim() !== "");
            if (respuestas.length > 0) {
                hasAnswers = true;
                // Determine rol from id
                let rol = 'Testigo';
                if (id === 'denunciante') rol = 'Denunciante';
                if (id === 'denunciado') rol = 'Denunciado/a';

                entrevistasParaAnalisis.push({
                    rol: rol,
                    preguntas: ent.preguntas,
                    respuestas: ent.respuestas
                });
            }
        });

        // Fallback to old structure if needed
        const respuestasViejas = Object.values(formData.investigacion.respuestasGenerales).filter(r => r.trim() !== "");
        if (respuestasViejas.length > 0) {
            hasAnswers = true;
            entrevistasParaAnalisis.push({
                rol: 'General',
                preguntas: formData.investigacion.preguntasSugeridas,
                respuestas: formData.investigacion.respuestasGenerales
            });
        }

        const relato = formData.hechos.relato.trim();
        const tipo = formData.hechos.tipo;
        
        if(!hasAnswers) {
            setErrorMessage("SIAK: No hay datos suficientes. Debe registrar al menos una respuesta en la sección de 'Registro de Entrevista' (Paso Anterior).");
            return;
        }

        setIsAnalyzing(true);
        try {
            const { conclusion, fundamentacion } = await analizarCaso(tipo, relato, entrevistasParaAnalisis);
            
            let medidaSugerida = "";
            let conclusionValida = ["Conducta Acreditada", "Conducta No Acreditada", "Antecedentes Insuficientes"].includes(conclusion) ? conclusion : "Antecedentes Insuficientes";
            
            if (conclusionValida === "Conducta Acreditada") {
                medidaSugerida = "Amonestación Escrita";
            } else {
                medidaSugerida = "Desestimar denuncia por falta de mérito";
            }
            
            setFormData(prev => ({
                ...prev,
                analisis: {
                    ...prev.analisis,
                    conclusion: conclusionValida,
                    fundamentacion: `Análisis Senior IA (Gemini):\n${fundamentacion}`,
                    medidaPropuesta: medidaSugerida
                }
            }));
        } catch(error) {
            setErrorMessage("Hubo un error al ejecutar el Análisis Senior IA. Intente nuevamente.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const calidad = formData.denunciado?.calidad || '';
    let activeSelectId = null;
    if(calidad.includes("Docente")) activeSelectId = 'sancion-docente';
    else if(calidad.includes("Trabajo")) activeSelectId = 'sancion-codigo';
    else if(calidad.includes("Administrativo")) activeSelectId = 'sancion-admin';
    else if(calidad.includes("Honorarios")) activeSelectId = 'sancion-honorarios';

    return (
        <div className="step-content active space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-gray-800">Marco Sancionatorio y Análisis Senior</h3>
                <p className="text-sm text-gray-600 mt-2">Estatuto aplicable al denunciado: <span className="font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">{calidad || 'No definido'}</span></p>
            </div>
            
            {errorMessage && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg">
                    <p className="text-sm text-red-700 font-bold">{errorMessage}</p>
                </div>
            )}

            <div className="mb-8 p-6 bg-purple-50 border border-purple-200 rounded-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="font-black text-purple-900 text-lg">🧠 Asistente de Análisis Investigativo (IA)</h4>
                        <p className="text-xs text-purple-700 mt-1">SIAK cruzará el relato original con las respuestas otorgadas en la etapa de entrevistas para formular una conclusión jurídica heurística basada en los estatutos y la Ley Karin.</p>
                    </div>
                    <button 
                        onClick={handleAnalisisSenior} 
                        disabled={isAnalyzing}
                        className={`bg-gradient-to-r from-purple-600 to-fuchsia-600 whitespace-nowrap text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-fuchsia-700 shadow-md transition-colors flex items-center gap-2 ${isAnalyzing ? 'pulse-ia opacity-80' : ''}`}
                    >
                        ✨ {isAnalyzing ? 'Ejecutando Análisis...' : 'Ejecutar Análisis Senior'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="font-bold text-gray-700 border-b pb-2">1. Calificación de los Hechos</h4>
                    <div className="space-y-2">
                        {['Conducta Acreditada', 'Conducta No Acreditada', 'Antecedentes Insuficientes'].map(conc => (
                            <button 
                                key={conc}
                                onClick={() => setFormData(prev => ({ ...prev, analisis: { ...prev.analisis, conclusion: conc } }))} 
                                className={`w-full p-4 text-left border-2 rounded-xl font-bold transition-colors ${
                                    formData.analisis.conclusion === conc ? 'border-green-500 bg-green-50 text-green-900' : 'border-gray-200 bg-white text-gray-600'
                                }`}
                            >
                                {conc}
                            </button>
                        ))}
                    </div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mt-4">Fundamentación y Síntesis Probatoria</label>
                    <textarea 
                        className="w-full p-4 text-sm border rounded-xl mt-1 h-48 bg-gray-50 leading-relaxed" 
                        placeholder="El sistema redactará el análisis aquí..."
                        value={formData.analisis.fundamentacion}
                        onChange={(e) => setFormData(prev => ({ ...prev, analisis: { ...prev.analisis, fundamentacion: e.target.value } }))}
                    />
                </div>
                <div className="space-y-4">
                    <h4 className="font-bold text-gray-700 border-b pb-2">2. Propuesta de Sanción (Automática)</h4>
                    
                    {activeSelectId === 'sancion-docente' && (
                        <select 
                            className="w-full p-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700"
                            value={formData.analisis.medidaPropuesta}
                            onChange={(e) => setFormData(prev => ({ ...prev, analisis: { ...prev.analisis, medidaPropuesta: e.target.value } }))}
                        >
                            <option value="">Seleccione sanción (Ley 19.070)...</option>
                            <option>Amonestación Escrita</option><option>Censura</option><option>Suspensión de Funciones</option><option>Destitución</option>
                            <option>Desestimar denuncia por falta de mérito</option>
                        </select>
                    )}
                    
                    {activeSelectId === 'sancion-codigo' && (
                        <select 
                            className="w-full p-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700"
                            value={formData.analisis.medidaPropuesta}
                            onChange={(e) => setFormData(prev => ({ ...prev, analisis: { ...prev.analisis, medidaPropuesta: e.target.value } }))}
                        >
                            <option value="">Seleccione sanción (DFL 1)...</option>
                            <option>Amonestación Escrita (Copia a DT)</option><option>Multa (Hasta 25% remuneración)</option><option>Despido (Art. 160 N°1)</option>
                            <option>Desestimar denuncia por falta de mérito</option>
                        </select>
                    )}
                    
                    {activeSelectId === 'sancion-admin' && (
                        <select 
                            className="w-full p-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700"
                            value={formData.analisis.medidaPropuesta}
                            onChange={(e) => setFormData(prev => ({ ...prev, analisis: { ...prev.analisis, medidaPropuesta: e.target.value } }))}
                        >
                            <option value="">Seleccione sanción (Ley 18.883)...</option>
                            <option>Censura</option><option>Multa (5% al 20%)</option><option>Suspensión del empleo</option><option>Destitución</option>
                            <option>Desestimar denuncia por falta de mérito</option>
                        </select>
                    )}

                    {activeSelectId === 'sancion-honorarios' && (
                        <select 
                            className="w-full p-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700"
                            value={formData.analisis.medidaPropuesta}
                            onChange={(e) => setFormData(prev => ({ ...prev, analisis: { ...prev.analisis, medidaPropuesta: e.target.value } }))}
                        >
                            <option value="">Seleccione sanción...</option>
                            <option>Término anticipado de contrato</option><option>Amonestación</option>
                            <option>Desestimar denuncia por falta de mérito</option>
                        </select>
                    )}

                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 mt-4 text-xs text-yellow-800 leading-relaxed">
                        <b>⚠️ Principio de Proporcionalidad:</b> SIAK formula una propuesta técnica basada en la ley. La sanción final es facultad privativa del Sostenedor, quien debe considerar atenuantes y agravantes.
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h4 className="font-bold text-gray-700 border-b pb-2 mb-4">3. Solicitud de Investigación Sumaria</h4>
                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        id="solicitudSumaria" 
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={formData.analisis.solicitudSumaria || false}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setFormData(prev => {
                                let newTexto = prev.analisis.textoSumario;
                                if (checked && !newTexto) {
                                    newTexto = `MATERIA: Solicita Instrucción de Investigación Sumaria / Sumario Administrativo.\n\nA: DON JORGE RADONICH BARRA\nALCALDE DE LA ILUSTRE MUNICIPALIDAD DE CAÑETE\n\nDE: ${prev.investigador?.nombre || '_________________'}\n${prev.perfil || '_________________'}\n\nJunto con saludar cordialmente, y en atención a los antecedentes recabados en el marco de la denuncia por ${prev.hechos.tipo || 'Ley Karin'} presentada con fecha ${prev.denuncia.fecha || '___________'}, vengo en solicitar a Ud. la instrucción de un proceso disciplinario (Investigación Sumaria o Sumario Administrativo) en contra de don/doña ${prev.denunciado?.nombre || '_________________'}, quien se desempeña en ${prev.denunciado?.establecimiento || '_________________'}.\n\nLo anterior se fundamenta en los siguientes antecedentes y síntesis probatoria obtenidos durante la etapa de investigación preliminar:\n\n${prev.analisis.fundamentacion || 'Sin fundamentación registrada.'}\n\nPor tanto, y considerando que los hechos descritos podrían constituir una infracción a los deberes y obligaciones funcionarias, solicito a Ud. tenga a bien ordenar la instrucción del respectivo procedimiento disciplinario para determinar las eventuales responsabilidades administrativas que correspondan.\n\nAtentamente,\n\n___________________________________\n${prev.investigador?.nombre || ''}\n${prev.perfil || ''}`;
                                }
                                return { 
                                    ...prev, 
                                    analisis: { 
                                        ...prev.analisis, 
                                        solicitudSumaria: checked,
                                        textoSumario: newTexto
                                    } 
                                };
                            });
                        }}
                    />
                    <label htmlFor="solicitudSumaria" className="text-sm font-bold text-gray-800 cursor-pointer">
                        Solicitud de investigación sumaria al alcalde Don Jorge Radonich Barra
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-8">
                    Marque esta opción si los antecedentes ameritan elevar los antecedentes para la instrucción de un sumario administrativo o investigación sumaria por parte de la máxima autoridad comunal.
                </p>
                {formData.analisis.solicitudSumaria && (
                    <div className="mt-6 ml-8">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Borrador de Solicitud</label>
                        <textarea 
                            className="w-full p-4 text-sm border rounded-xl bg-gray-50 leading-relaxed h-96"
                            value={formData.analisis.textoSumario || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, analisis: { ...prev.analisis, textoSumario: e.target.value } }))}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
