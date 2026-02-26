import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = "Eres SIAK, sistema formal de levantamiento de denuncias y herramienta de apoyo técnico a la gestión investigativa de Ley Karin 21.643 del DAEM. Reglas: Mantener lenguaje formal, técnico y neutral. No emitir juicios personales, No prejuzgar, No suponer hechos no acreditados. SIAK formula propuesta técnica, no ejecuta sanción.";

function parseGeminiResponse<T>(response: GenerateContentResponse, fallback: T): T {
    let jsonStr = response.text?.trim() || "{}";
    if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    try {
        return JSON.parse(jsonStr) as T;
    } catch (e) {
        console.error("Error parsing JSON from Gemini:", e, jsonStr);
        return fallback;
    }
}

export async function redactarCitacion(testigo: string, tipoDenuncia: string, perfil: string, fecha: string, hora: string, lugar: string, rol: string): Promise<string> {
    const prompt = `Redacta una citación formal, administrativa y estrictamente confidencial dirigida al funcionario/a: "${testigo}". 
    Motivo: Concurrir a entrevista en calidad de "${rol}" por investigación de "${tipoDenuncia}" (Ley 21.643 y Código del Trabajo / Estatuto correspondiente).
    Fecha de la citación: ${fecha || '[Fecha por definir]'}.
    Hora de la citación: ${hora || '[Hora por definir]'}.
    Lugar de la citación: ${lugar || 'Dependencias administrativas del DAEM Cañete'}.
    Instrucciones de redacción: Debe incluir la obligatoriedad de asistir, el apercibimiento legal en caso de inasistencia injustificada, y el deber estricto de resguardar la confidencialidad (principio de reserva). Usa los datos proporcionados para la fecha, hora y lugar. Escribe en formato HTML simple sin etiquetas de bloque externo (usa <b>, <p>, <br>).`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    citacion_html: {
                        type: Type.STRING,
                        description: "Documento de citación formateado en HTML."
                    }
                }
            }
        }
    });

    const result = parseGeminiResponse<{ citacion_html?: string }>(response, {});
    return result.citacion_html || "";
}

export async function redactarDerivacionACHS(victimaNombre: string, rut: string, establecimiento: string, tipoDenuncia: string, perfil: string): Promise<string> {
    const prompt = `Redacta un memorándum formal y estrictamente confidencial dirigido a la "Unidad de Prevención de Riesgos" del DAEM Cañete.
    Motivo: Derivación para atención psicológica (ACHS/MUTUAL) por activación de protocolo Ley 21.643.
    Funcionario/a derivado/a: "${victimaNombre}" (RUT: ${rut}), Establecimiento: "${establecimiento}".
    Tipo de denuncia: "${tipoDenuncia}".
    Instrucciones de redacción: El documento debe solicitar a Prevención de Riesgos que gestione la atención psicológica temprana para el/la funcionario/a en la mutualidad correspondiente (ACHS/MUTUAL), en el marco de las medidas de resguardo de la Ley Karin. Se debe enfatizar la estricta confidencialidad y reserva de los hechos denunciados. El documento es emitido por: "${perfil}" (Investigador/a Designado/a).
    Escribe en formato HTML simple sin etiquetas de bloque externo (usa <b>, <p>, <br>).`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    derivacion_html: {
                        type: Type.STRING,
                        description: "Documento de derivación formateado en HTML."
                    }
                }
            }
        }
    });

    const result = parseGeminiResponse<{ derivacion_html?: string }>(response, {});
    return result.derivacion_html || "";
}

export async function redactarOficioSeparacion(
    sujetoNombre: string, 
    sujetoRol: string, 
    nuevoEspacio: string, 
    nuevaFuncion: string, 
    perfil: string
): Promise<string> {
    const prompt = `Redacta un oficio formal y estrictamente confidencial dirigido al "Director DAEM" y al "Jefe de Personal" del DAEM Cañete.
    Motivo: Aplicación de medida de resguardo de separación de espacios y/o funciones, conforme a la Ley 21.643 (Ley Karin).
    Funcionario/a sujeto a la medida: "${sujetoNombre}" (Calidad en la investigación: ${sujetoRol}).
    Nuevo espacio físico asignado: "${nuevoEspacio}".
    Nueva función a desempeñar: "${nuevaFuncion}".
    Instrucciones de redacción: El documento debe indicar claramente que se aplica esta medida de separación de espacios y funciones como resguardo inmediato. Debe quedar expresamente definido que esta medida "está sujeta a cambios o ratificación por ambas jefaturas (Director DAEM y Jefe de Personal)" y que su duración se extenderá "por el tiempo que se realice la investigación correspondiente a la Ley Karin". El documento es emitido por: "${perfil}" (Investigador/a Designado/a).
    Escribe en formato HTML simple sin etiquetas de bloque externo (usa <b>, <p>, <br>).`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    oficio_html: {
                        type: Type.STRING,
                        description: "Documento de oficio formateado en HTML."
                    }
                }
            }
        }
    });

    const result = parseGeminiResponse<{ oficio_html?: string }>(response, {});
    return result.oficio_html || "";
}

export async function generarPreguntas(relato: string, tipo: string, rol: string): Promise<string[]> {
    const prompt = `Analiza el siguiente relato de denuncia bajo el marco de la Ley Karin de Chile (Acoso Laboral, Sexual o Violencia en el Trabajo).
    Tipo de denuncia catalogada: ${tipo}.
    Relato de los hechos: "${relato}".
    
    Como investigador experto, formula exactamente 4 preguntas clave, estratégicas, objetivas y no revictimizantes que deben realizarse a la persona en calidad de "${rol}" para esclarecer los hechos relatados. Concéntrate en los detalles, fechas, medios de prueba y contexto mencionado en el relato.`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    preguntas: {
                        type: Type.ARRAY,
                        description: "Lista de 4 preguntas generadas para la entrevista.",
                        items: { type: Type.STRING }
                    }
                }
            }
        }
    });

    const result = parseGeminiResponse<{ preguntas?: string[] }>(response, {});
    return result.preguntas || [];
}

export async function analizarCaso(tipo: string, relato: string, entrevistas: { rol: string, preguntas: string[], respuestas: Record<number, string> }[]): Promise<{ conclusion: string, fundamentacion: string }> {
    let entrevistaContext = "";
    entrevistas.forEach(ent => {
        entrevistaContext += `--- Entrevista a: ${ent.rol} ---\n`;
        ent.preguntas.forEach((p, i) => {
            const resp = ent.respuestas[i] || "Sin respuesta";
            entrevistaContext += `Pregunta: ${p}\nRespuesta obtenida: ${resp}\n\n`;
        });
    });

    const prompt = `Actúa como Asesor Jurídico Experto (Fiscal Administrativo) especializado en la Ley 21.643 (Ley Karin) en Chile.
    Debes analizar el caso en base a la denuncia original y las respuestas obtenidas en la fase de entrevistas.
    
    Tipo de Conducta Denunciada: ${tipo}.
    Relato Original del Denunciante: "${relato}".
    
    Resultados de la fase de entrevistas a testigos/víctima/denunciado:
    ${entrevistaContext}
    
    Instrucciones:
    1. Determina objetivamente si, en base a la corroboración de los testimonios, los hechos pueden catalogarse bajo una de estas tres opciones estrictas: "Conducta Acreditada", "Conducta No Acreditada" o "Antecedentes Insuficientes".
    2. Redacta una fundamentación jurídica y probatoria formal, técnica y neutral (de 2 a 3 párrafos cortos) justificando la decisión elegida. Menciona explícitamente las congruencias o incongruencias entre el relato inicial y las respuestas de las entrevistas. No inventes artículos de ley que no existan, mantén el foco en la valoración de la prueba.`;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    conclusion: {
                        type: Type.STRING,
                        description: "Debe ser exactamente una de estas opciones: 'Conducta Acreditada', 'Conducta No Acreditada', o 'Antecedentes Insuficientes'."
                    },
                    fundamentacion_redactada: {
                        type: Type.STRING,
                        description: "La redacción formal de la fundamentación cruzando los datos del relato y la entrevista."
                    }
                }
            }
        }
    });

    const result = parseGeminiResponse<{ conclusion?: string, fundamentacion_redactada?: string }>(response, {});
    return {
        conclusion: result.conclusion || "Antecedentes Insuficientes",
        fundamentacion: result.fundamentacion_redactada || "Error al generar análisis."
    };
}
