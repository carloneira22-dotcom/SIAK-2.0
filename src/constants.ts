import { Funcionario, FormData } from './types';

export const FUNCIONARIOS: Funcionario[] = [
    { nombre: "ACEVEDO ARANEDA MANUEL", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "ALVAREZ RAMIREZ MARCELO ALEJANDRO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "ANATIVIA ZAMORA JULIO ALONSO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "ANTIMAN ANIÑIR ROXANA ANDREA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "ARAVENA MUÑOZ LORETO DE LOS ANGELES", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "ASTORGA CISTERNA MAXIMO ENRIQUE", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "ASTUDILLO GUTIERREZ EVELYN ELCIRA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "AVILES GONZALEZ JAIME FABIAN", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "BARRIA ALBORNOZ SERGIO AURELIO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "BASCUÑAN BAEZA CARLOS PATRICIO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "BIZAMA REYES EVELYN MARIBEL", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "BORGUERO PAZ CARLA PATRICIA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "BORQUEZ GONZALEZ NOELIA ALEJANDRA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "BRAVO CAMERON PIA CARLA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "CASTRO SANTANDER MIRIAM VIVIANA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "CAYUPAN PORMA MICHEL SOFIA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "CEBALLOS ACEVEDO BENJAMIN DEL C.", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "CERNA PALAVECINOS FLOR DEL CARMEN", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "CHANDIA SAN MARTIN FRANCISCO JAVIER", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "CHAVEZ PROBOSTE IRENE SOLEDAD", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "CID PARRA DAVID", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "CORREA SANZANA MARCO ANTONIO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "CORTES FICA ARTURO ABDON", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "CORTES MAUREIRA FELIPE ANDRES", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "DIAZ OBREQUE PATRICIO IVAN", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "DURAN SALAZAR JULIO TOMAS", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "ECHAYZ FERNANDEZ ZAIDA ESTER", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "ESPERGUEL CONCHA YOHANNA ELIZABETH", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "ESPINOZA VELOZO ALICIA JIMENA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "ETCHEVERRY MORALES NOEMA DEL PILAR", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "FERNANDEZ GALLARDO DANIEL ANTONIO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "FERNANDEZ JARA DANIEL IVAN", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "FICA GALLARDO ISIDORA BALDRAMINA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "GALLARDO MENDEZ JUAN MISAEL", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "GARCES GONZALEZ XIMENA ELIZABETH", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "GONZALEZ FERRER MIGUEL ENRIQUE", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "HIDALGO OLATE ALEX HERMINIO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "HIDALGO VIVEROS FERNANDA ANDREA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "HUENUPI HUENUCOY MARCOS ESTEBAN", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "INOSTROZA ARANEDA RODRIGO ALEJANDRO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "LARA FUENTES JOSE HUGO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "LEPICHEO ANTIPIL JOHANA DAMARIS", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "LEPICHEO GALLARDO FERNANDA CAROLINA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "LEPICHEO MENDOZA OSCAR IGNACIO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "LOBOS FERNANDEZ VICTOR HUGO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "MANOSALVA VARGAS ALEJANDRO DOMINGO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "MARTINEZ CARRILLO JOHANA ANABEL", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "MARTINEZ MENDEZ LUIS ARIEL", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "MARTINEZ MONSALVE ALDO RICARDO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "MATAMALA SALAS PEDRO OMAR", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "MENDEZ MUNOZ MARISOL DEL PILAR", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "MEZA FUENTEALBA NASTYA RUTH", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "MORALES MORALES MARGOT", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "MORGADO GARRIDO CAMILA MARIA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "MUÑOZ DOMINGUEZ JORGE ALBERTO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "NAVARRO BAHAMONDE JORGE OCTAVIO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "NAVARRO FONTI NICOLAS SPERSO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "NAVARRO MALIG ERWIN DARIO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "NEIRA CUEVAS PILAR ISABEL", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "NEIRA JOFRE CARLO ESTEBAN", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "OBREQUE MARIN CONSTANZA FERNANDA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "OBREQUE MELLA DANIEL YERKO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "OLMOS PALMA CLAUDIA SUSANA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "PANTOJA MELO DANIELA SOLANGE", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "PARRA VASQUEZ ROBERTO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "PAVEZ ESPINOZA CRISTIAN PABLO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "PEREZ MEZA PABLO ESTEBAN", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "PILGRIM CARRASCO MARCO ANTONIO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "RAMOS ORELLANA IGNACIO ANDRES", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "RECABARREN VERGARA PAMELA ANDREA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "RETAMAL MARTINEZ MARIA MARCELA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "REYES BARRA LUIS NICOLAS", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "RIQUELME ESPINOZA MARCIA ANDREA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "RIQUELME TORRES GUILLERMO DOMINGO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "ROBLES MARTINEZ PATRICIA ANDREA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "SAAVEDRA MORALES MAURICIO ALFONSO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "SALAZAR COLOMA CARMEN VIVIANA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "SALGADO BURGOS CESAR HERNAN", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "SANCHEZ GARRIDO MARIO ALCIBIADES", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "SANDOVAL BARRA CLAUDIO ARNOLDO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "SANHUEZA ASTETE CLAUDIO ESTEBAN", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "SANHUEZA SANHUEZA ERASMO SENEN", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "SILVA GUTIERREZ CAROL MARIA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "SOTO NAVARRO GRICELLI DEL PILAR", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "TELLO ARCE PATRICIO ULISES", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "TOLEDO MARDONES JAVIER GUSTAVO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "TORRES SALDIAS LUIS EUGENIO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "VASQUEZ VASQUEZ ALEJANDRA ANDREA", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "VILLAGRAN CAYUPE EDUARDO", rut: "", establecimiento: "DAEM Cañete" },
    { nombre: "ZAMBRANO MONSALVEZ CECILIA BEATRIZ", rut: "", establecimiento: "DAEM Cañete" },
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

export const INVESTIGADORES_AUTORIZADOS = [
    { nombre: "ASTUDILLO GUTIERREZ EVELYN ELCIRA", rut: "13231040-8", email: "" },
    { nombre: "CARLO NEIRA JOFRE", rut: "17.345.421-K", email: "" },
    { nombre: "JOAQUIN LARA HERRERA", rut: "", email: "" }
];

export const CALIDADES = [
    "Estatuto Docente (Ley 19.070)",
    "Código del Trabajo (Asistentes de la Educación)",
    "Estatuto Administrativo (Ley 18.883 - Planta/Contrata)",
    "Honorarios"
];

export const ESTABLECIMIENTOS = [
    "Escuela Básica Paicaví",
    "Escuela Básica Juan Lavín Alvear",
    "Escuela Básica La Granja",
    "Escuela Básica Ricardo Coloma Díaz",
    "Escuela Básica Galvarino",
    "Escuela Básica Juan Aguilera Jerez",
    "Escuela Básica Cacique Francisco Melin",
    "Escuela Básica Rene Andrade Toledo",
    "Escuela Básica Rubí Nelson Silva",
    "Escuela Básica Leoncio Araneda Figueroa",
    "Escuela Básica Arturo Prat Chacón",
    "Escuela Básica Homero Vigueras Figueroa",
    "Escuela Básica de Lloncao",
    "Escuela Básica Salto de Huillinco",
    "Escuela Básica García Hurtado de Mendoza",
    "Escuela Básica Tres Sauces",
    "Escuela Básica Federico Gana",
    "Liceo B-56 Jose de la Cruz Miranda",
    "Liceo Homero Vigueras Figueroa",
    "Liceo Bicentenario TP Alonso de Ercilla y Zuñiga",
    "ESCUELA LENGUAJE BAMBI",
    "DAEM Cañete"
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
        entrevistas: {},
        idDocDerivacion: '',
        textoDerivacion: '',
        evidencias: []
    },
    analisis: {
        conclusion: '',
        fundamentacion: '',
        medidaPropuesta: '',
        solicitudSumaria: false,
        textoSumario: '',
        idDoc: ''
    }
};
