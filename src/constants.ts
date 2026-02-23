import { Funcionario, FormData } from './types';

export const FUNCIONARIOS: Funcionario[] = [
    { nombre: "ACEVEDO ARANEDA MANUEL", rut: "007998913-4", establecimiento: "DAEM" },
    { nombre: "ALVAREZ RAMIREZ MARCELO ALEJANDRO", rut: "014071817-3", establecimiento: "DAEM" },
    { nombre: "ANATIVIA ZAMORA JULIO ALONSO", rut: "014513206-1", establecimiento: "DAEM" },
    { nombre: "ANTIMAN ANIÑIR ROXANA ANDREA", rut: "018017835-K", establecimiento: "DAEM" },
    { nombre: "ARAVENA MUÑOZ LORETO DE LOS ANGELES", rut: "014582000-6", establecimiento: "DAEM" },
    { nombre: "ASTORGA CISTERNA MAXIMO ENRIQUE", rut: "011987700-8", establecimiento: "DAEM" },
    { nombre: "ASTUDILLO GUTIERREZ EVELYN ELCIRA", rut: "013231040-8", establecimiento: "DAEM" },
    { nombre: "AVILES GONZALEZ JAIME FABIAN", rut: "010621578-2", establecimiento: "DAEM" },
    { nombre: "BARRIA ALBORNOZ SERGIO AURELIO", rut: "010121945-3", establecimiento: "DAEM" },
    { nombre: "BASCUÑAN BAEZA CARLOS PATRICIO", rut: "018670941-1", establecimiento: "DAEM" },
    { nombre: "BIZAMA REYES EVELYN MARIBEL", rut: "015658737-0", establecimiento: "DAEM" },
    { nombre: "BORGUERO PAZ CARLA PATRICIA", rut: "015197579-8", establecimiento: "DAEM" },
    { nombre: "BORQUEZ GONZALEZ NOELIA ALEJANDRA", rut: "013122349-8", establecimiento: "DAEM" },
    { nombre: "BRAVO CAMERON PIA CARLA", rut: "014368931-1", establecimiento: "DAEM" },
    { nombre: "BAEZA QUILODRAN MACARENA NATALY", rut: "016980558-K", establecimiento: "JUNJI BOSQUE MAGICO" },
    { nombre: "CABEZA RIVAS ALISSON MELISSA", rut: "019273673-0", establecimiento: "JUNJI BOSQUE MAGICO" },
    { nombre: "DURAN AILLON ERICA VANESSA", rut: "015756369-6", establecimiento: "JUNJI BOSQUE MAGICO" },
    { nombre: "GARCES SALAZAR YESSICA DEL PILAR", rut: "015658584-K", establecimiento: "JUNJI BOSQUE MAGICO" },
    { nombre: "GARRIDO MORENO ZULEMA VERONICA", rut: "018995444-1", establecimiento: "JUNJI BOSQUE MAGICO" },
    { nombre: "HENRIQUEZ CUEVAS LETICIA YAQUELINE", rut: "012734460-4", establecimiento: "JUNJI BOSQUE MAGICO" },
    { nombre: "HERNANDEZ FERNANDEZ JOSE ALEJANDRO", rut: "015477447-5", establecimiento: "JUNJI BOSQUE MAGICO" },
    { nombre: "KURTIN ISLAS GLORIA ELIANA", rut: "008329526-0", establecimiento: "JUNJI BOSQUE MAGICO" },
    { nombre: "LLANQUILEO MARILAO LUZVENIA YAMILET", rut: "018671177-7", establecimiento: "JUNJI BOSQUE MAGICO" },
    { nombre: "ORTIZ VARELA CAROLINA CONSTANZA", rut: "020956451-3", establecimiento: "JUNJI BOSQUE MAGICO" },
    { nombre: "SANHUEZA PARRA KAREN ALEJANDRA", rut: "015204201-9", establecimiento: "JUNJI BOSQUE MAGICO" },
    { nombre: "CEBALLOS ACEVEDO OMAR SEGUNDO", rut: "011987426-2", establecimiento: "JUNJI VTF" }
];

export const CALIDADES = [
    "Estatuto Docente (Ley 19.070)",
    "Código del Trabajo (Asistentes de la Educación)",
    "Estatuto Administrativo (Ley 18.883 - Planta/Contrata)",
    "Honorarios"
];

export const ESTABLECIMIENTOS = [
    "Escuela Básica Arturo Prat", "Liceo B-56", "Jardín Infantil VTF Los Duendecitos",
    "Administración Central DAEM", "Escuela Emilia Romagna", "Liceo Alonso de Ercilla",
    "JUNJI BOSQUE MAGICO", "JUNJI VTF",
    "Escuela Ricardo Coloma Díaz", "Escuela Leoncio Araneda Figueroa",
    "Escuela Juanita Fernández Solar", "Escuela Homero Vigueras Araneda",
    "Escuela de Niñas Canadá", "Liceo Técnico Profesional Alonso de Ercilla y Zúñiga",
    "Liceo Gabriela Mistral", "Liceo Politécnico Caupolicán",
    "Escuela Especial de Lenguaje", "Escuela Rural", "Microcentro"
];

export const PERFILES = [
    { id: 'Investigador / Fiscal DAEM', desc: 'Conducción de sumarios e investigaciones.' },
    { id: 'Asesor Jurídico', desc: 'Control de legalidad y encuadre normativo.' },
    { id: 'Convivencia Escolar', desc: 'Primera acogida y gestión en Establecimientos.' },
    { id: 'Prevencionista de Riesgos', desc: 'Enfoque de salud ocupacional y resguardo.' }
];

export const STEPS_INFO = [
    { title: 'Perfil', emoji: '👤' },
    { title: 'Denuncia', emoji: '📄' },
    { title: 'Investigación', emoji: '🔍' },
    { title: 'Análisis', emoji: '⚖️' },
    { title: 'Informe', emoji: '📑' }
];

export const INITIAL_FORM_DATA: FormData = {
    perfil: '',
    investigador: {
        nombre: '',
        rut: '',
        email: ''
    },
    denuncia: {
        fecha: '',
        hora: '',
        quienDenuncia: ''
    },
    victima: {
        nombre: '',
        rut: '',
        establecimiento: '',
        funcion: '',
        telefono: '',
        email: ''
    },
    denuncianteTercero: {
        nombre: '',
        funcion: '',
        establecimiento: ''
    },
    denunciado: {
        nombre: '',
        funcion: '',
        establecimiento: '',
        relacion: '',
        calidad: ''
    },
    hechos: {
        tipo: '',
        relato: ''
    },
    investigacion: {
        atencionPsicologica: false,
        medidaSeparacion: false,
        testigos: [],
        fechaCitacion: '',
        horaCitacion: '',
        lugarCitacion: '',
        separacionSujeto: '',
        separacionNuevoEspacio: '',
        separacionNuevaFuncion: '',
        preguntasSugeridas: [],
        respuestasGenerales: {},
        entrevistas: {}
    },
    analisis: {
        conclusion: '',
        fundamentacion: '',
        medidaPropuesta: ''
    }
};
