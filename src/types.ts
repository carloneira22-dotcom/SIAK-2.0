export interface Funcionario {
  nombre: string;
  rut: string;
  establecimiento: string;
}

export interface FormData {
  perfil: string;
  investigador: {
    nombre: string;
    rut: string;
    email: string;
  };
  denuncia: {
    fecha: string;
    hora: string;
    quienDenuncia: 'Victima' | 'Tercero' | '';
  };
  victima: {
    nombre: string;
    rut: string;
    establecimiento: string;
    funcion: string;
    telefono: string;
    email: string;
  };
  denuncianteTercero: {
    nombre: string;
    funcion: string;
    establecimiento: string;
  };
  denunciado: {
    nombre: string;
    funcion: string;
    establecimiento: string;
    relacion: string;
    calidad: string;
  };
  hechos: {
    tipo: string;
    relato: string;
  };
  investigacion: {
    atencionPsicologica: boolean;
    medidaSeparacion: boolean;
    testigos: string[];
    fechaCitacion: string;
    horaCitacion: string;
    lugarCitacion: string;
    separacionSujeto: string;
    separacionNuevoEspacio: string;
    separacionNuevaFuncion: string;
    preguntasSugeridas: string[];
    respuestasGenerales: Record<number, string>;
    entrevistas: Record<string, { preguntas: string[], respuestas: Record<number, string> }>;
    idDocDerivacion?: string;
    textoDerivacion?: string;
  };
  analisis: {
    conclusion: string;
    fundamentacion: string;
    medidaPropuesta: string;
    solicitudSumaria?: boolean;
    textoSumario?: string;
    idDoc?: string;
  };
}
