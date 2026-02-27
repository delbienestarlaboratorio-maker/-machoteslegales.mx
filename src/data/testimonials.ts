export interface Testimonial {
    id: number
    name: string
    role: string
    content: string
    rating: number
    specialty: string
    date: string
}

export const testimonials: Testimonial[] = [
    { id: 1, name: "Carlos M.", role: "Empresario", content: "El formato de acta constitutiva me ahorró semanas de espera con el notario y casi $15,000 pesos. Muy bien redactado y actualizado.", rating: 5, specialty: "Corporativo", date: "Hace 2 días" },
    { id: 2, name: "Elena G.", role: "Arrendadora", content: "Llevaba meses buscando un contrato de arrendamiento que de verdad me protegiera en caso de impago en CDMX. Excelente documento.", rating: 5, specialty: "Civil", date: "Hace 1 semana" },
    { id: 3, name: "Roberto P.", role: "Usuario Verificado", content: "Descargué la demanda de divorcio incausado. Mi abogado solo la revisó, la imprimió y la ingresó. Aprobada en el primer juzgado.", rating: 5, specialty: "Familiar", date: "Hace 3 días" },
    { id: 4, name: "Sofía R.", role: "Madre de familia", content: "La demanda de pensión alimenticia viene con jurisprudencia que ni sabía que existía. Muy completo.", rating: 5, specialty: "Familiar", date: "Hace 2 semanas" },
    { id: 5, name: "Jorge H.", role: "Gerente de RH", content: "Los formatos laborales son oro puro para evitar demandas futuras por parte de ex-empleados.", rating: 5, specialty: "Laboral", date: "Hace 1 mes" },
    { id: 6, name: "Ana L.", role: "Comerciante", content: "Me querían cobrar una multa injusta del SAT. Usé el recurso de revocación que compré aquí y me cancelaron la multa.", rating: 5, specialty: "Fiscal", date: "Hace 5 días" },
    { id: 7, name: "Luis F.", role: "Usuario Verificado", content: "El pagaré mercantil tiene cláusulas de intereses moratorios muy claras. Ya logré recuperar mi dinero en el juicio ejecutivo.", rating: 5, specialty: "Mercantil", date: "Hace 10 días" },
    { id: 8, name: "María T.", role: "Emprendedora", content: "Compré el paquete de contratos para mi agencia y están listos para usarse. Muy recomendables.", rating: 4, specialty: "Corporativo", date: "Hace 1 semana" },
    { id: 9, name: "Pedro A.", role: "Abogado Junior", content: "Como pasante me han salvado la vida varias veces. Son machotes de buena calidad técnica, no de los que están gratis bajados de Taringa.", rating: 5, specialty: "Penal", date: "Hace 3 días" },
    { id: 10, name: "Carmen V.", role: "Dueña de local", content: "Perfecto para arrendamiento comercial. Cubre todo lo de protección civil y fiador.", rating: 5, specialty: "Civil", date: "Hace 4 días" },
    { id: 11, name: "David E.", role: "Usuario Verificado", content: "Mi ex no quería dar pensión, con esta demanda metimos toda la presión legal necesaria, muy bien fundamentado.", rating: 5, specialty: "Familiar", date: "Hace 1 mes" },
    { id: 12, name: "Fernanda S.", role: "Freelancer", content: "El contrato de prestación de servicios me sirve con todos mis clientes. Luce súper profesional.", rating: 5, specialty: "Civil", date: "Hace 2 semanas" },
    { id: 13, name: "Héctor B.", role: "Usuario Verificado", content: "La querella por fraude bancario viene estructurada exactamente como la pide el Ministerio Público.", rating: 5, specialty: "Penal", date: "Hace 3 semanas" },
    { id: 14, name: "Isabel N.", role: "Heredera", content: "Iniciamos la sucesión intestamentaria nosotros mismos usando este formato como base. Todo en orden.", rating: 4, specialty: "Civil", date: "Hace 2 meses" },
    { id: 15, name: "Raúl C.", role: "Contador Ejecutivo", content: "Siempre recomiendo Machotes Legales a mis clientes cuando necesitan actas de asamblea urgentes.", rating: 5, specialty: "Corporativo", date: "Hace 1 semana" },
    { id: 16, name: "Teresa J.", role: "Ama de casa", content: "Muy fácil de entender. Los espacios a llenar son claros y la redacción es seria.", rating: 5, specialty: "Familiar", date: "Hace 5 días" },
    { id: 17, name: "Javier O.", role: "Usuario Verificado", content: "El amparo indirecto logró la suspensión provisional que buscábamos en tiempo récord.", rating: 5, specialty: "Amparo", date: "Hace 1 mes" },
    { id: 18, name: "Mónica D.", role: "Empleada", content: "Me despidieron y no querían pagarme mi liquidación. La demanda laboral de aquí trae los cálculos de horas extras perfectos.", rating: 5, specialty: "Laboral", date: "Hace 2 semanas" },
    { id: 19, name: "Ricardo M.", role: "Vendedor de Autos", content: "El contrato de compraventa de vehículo con responsabilidades penales me quitó un peso de encima.", rating: 5, specialty: "Civil", date: "Hace 1 mes" },
    { id: 20, name: "Andrea P.", role: "Abogada Litigante", content: "A veces necesito presentar algo rápido en un estado foráneo y estos formatos son una excelente base.", rating: 4, specialty: "Diversos", date: "Hace 3 días" },
    { id: 21, name: "Sergio L.", role: "Usuario Verificado", content: "Impresionante la cantidad de leyes citadas correctamente. 10/10.", rating: 5, specialty: "Familiar", date: "Hace 1 semana" },
    { id: 22, name: "Gabriela F.", role: "Usuaria Verificada", content: "Solicité divorcio y custodia de manera conjunta con la plantilla y el proceso fluyó muchísimo más rápido.", rating: 5, specialty: "Familiar", date: "Hace 2 días" },
    { id: 23, name: "Víctor R.", role: "Propietario", content: "Acabo de demandar por incumplimiento de arrendamiento en Edomex y el machote es exacto para el juzgado civil.", rating: 5, specialty: "Civil", date: "Hace 5 días" },
    { id: 24, name: "Daniela V.", role: "Emprendedora", content: "El aviso de privacidad y términos y condiciones para mi e-commerce quedaron de primer nivel. Nada que envidiarle a bufetes caros.", rating: 5, specialty: "Digital", date: "Hace 3 semanas" },
    { id: 25, name: "Eduardo S.", role: "Empresario PYME", content: "El contrato colectivo de trabajo me evitó problemas sindicales severos. Totalmente actualizado a la reforma laboral.", rating: 5, specialty: "Laboral", date: "Hace 2 meses" },
    { id: 26, name: "Patricia U.", role: "Usuario Verificado", content: "La carta responsiva escolar era justo lo que la dirección nos pedía y no sabíamos cómo redactar. Lista en 5 minutos.", rating: 5, specialty: "Escolar", date: "Hace 1 día" },
    { id: 27, name: "Oscar P.", role: "Usuario Verificado", content: "Descargué la denuncia por lesiones. Fue directa y ayudó a que en el MP me hicieran caso más rápido sin dar tantas vueltas.", rating: 4, specialty: "Penal", date: "Hace 1 semana" },
    { id: 28, name: "Liliana T.", role: "Esposa", content: "Acuerdo prenupcial (separación de bienes) muy equitativo e inteligible para ambas partes.", rating: 5, specialty: "Familiar", date: "Hace 4 meses" },
    { id: 29, name: "Manuel K.", role: "Ingeniero", content: "La demanda de daño moral es un texto técnico sólido. Mi abogado dijo que le ahorró unas 5 horas de arrastrar la pluma.", rating: 5, specialty: "Civil", date: "Hace 3 días" },
    { id: 30, name: "Laura Y.", role: "Estudiante de Derecho", content: "Los uso como guía de estudio y formularios prácticos. Están mucho más actualizados que mis libros del semestre.", rating: 5, specialty: "Varios", date: "Hace 2 semanas" },
    { id: 31, name: "Alberto J.", role: "Desarrollador Inmobiliario", content: "Los contratos de promesa de compraventa de inmueble los uso diario con la notaría. Cumplen con Profeco y Ley de Lavado.", rating: 5, specialty: "Corporativo", date: "Hace 1 mes" },
    { id: 32, name: "Norma G.", role: "Usuario Verificado", content: "Muy buena estructura en la contestación de demanda de alimentos. Nos permitió defender nuestros ingresos reales.", rating: 5, specialty: "Familiar", date: "Hace 2 semanas" },
    { id: 33, name: "Fernando M.", role: "Padrastro", content: "Pude meter el escrito de adopción de manera muy clara gracias al formato.", rating: 5, specialty: "Familiar", date: "Hace 1 mes" },
    { id: 34, name: "Alicia C.", role: "Usuaria Verificada", content: "El recurso de revisión contra el IMSS lo ingresó mi contadora usando este machote. Excelente argumentación legal.", rating: 5, specialty: "Administrativo", date: "Hace 5 días" },
    { id: 35, name: "Miguel A.", role: "Diseñador", content: "El NDA (Acuerdo de Confidencialidad) protege todo mi portafolio antes de dárselo a los clientes. 100% recomendado.", rating: 5, specialty: "Corporativo", date: "Hace 2 días" },
    { id: 36, name: "Silvia L.", role: "Maestra", content: "Presenté el amparo contra la reforma de la misma Secretaría, el texto es contundente.", rating: 4, specialty: "Amparo", date: "Hace 3 semanas" },
    { id: 37, name: "Antonio V.", role: "Usuario Verificado", content: "Rápido, seguro y más barato que perder tiempo yendo al bufete. La carta poder con ratificación es impecable.", rating: 5, specialty: "Notarial", date: "Hace 1 día" },
    { id: 38, name: "Diana H.", role: "Abogada Familiar", content: "Mis respetos. Los machotes de jurisdicción voluntaria están muy completos y citan el Código Civil Federal correctamente.", rating: 5, specialty: "Familiar", date: "Hace 4 días" },
    { id: 39, name: "Raúl G.", role: "Vecino", content: "La queja condominal la usamos en la junta y todos quedaron impresionados por cómo fundamentamos el ruido excesivo.", rating: 5, specialty: "Civil", date: "Hace 6 días" },
    { id: 40, name: "Verónica N.", role: "Doctora", content: "El contrato de comodato para mi equipo médico es el más claro que he leído. Gracias.", rating: 5, specialty: "Civil", date: "Hace 2 semanas" },
    { id: 41, name: "Ernesto B.", role: "Transportista", content: "Contrato de transporte de carga mercantil. Listo en 5 minutos en el celular antes de cargar el tráiler. Genial.", rating: 5, specialty: "Mercantil", date: "Hace 1 mes" },
    { id: 42, name: "Lorena R.", role: "Usuaria Verificada", content: "Iniciamos el juicio de intestado de mi abuelo solas mi hermana y yo, la guía es fenomenal.", rating: 5, specialty: "Civil", date: "Hace 1 semana" },
    { id: 43, name: "Gerardo Z.", role: "Organizador de Eventos", content: "El contrato de provisión de servicios para bodas me protege de cancelaciones masivas. Dinero bien invertido.", rating: 5, specialty: "Civil", date: "Hace 3 semanas" },
    { id: 44, name: "Susana O.", role: "Usuaria", content: "Mi primera demanda redactada. Gracias al formato de violencia familiar me dieron las medidas de restricción enseguida.", rating: 5, specialty: "Penal", date: "Hace 2 días" },
    { id: 45, name: "Joaquín D.", role: "Agricultor", content: "El contrato de aparcería rural es difícil de encontrar bien hecho, pero este está apegado a la ley agraria vigente.", rating: 4, specialty: "Agrario", date: "Hace 2 meses" },
    { id: 46, name: "Beatriz M.", role: "Usuario Verificado", content: "La demanda reivindicatoria estaba trabada con mi otro abogado, compré este formato y lo ingresamos directo.", rating: 5, specialty: "Civil", date: "Hace 1 semana" },
    { id: 47, name: "Arturo F.", role: "Desarrollador SaaS", content: "Los contratos de licencia de software (EULA) locales en México son un asco, pero este de aquí es de nivel internacional adaptado a México.", rating: 5, specialty: "Tecnología", date: "Hace 4 días" },
    { id: 48, name: "Gloria P.", role: "Tía", content: "Juicio de rectificación de acta de nacimiento. No necesité pagarle a un gestor de afuera del Registro Civil.", rating: 5, specialty: "Familiar", date: "Hace 12 días" },
    { id: 49, name: "Ignacio C.", role: "Usuario Verificado", content: "El pagaré con aval y deudores solidarios aseguró mi capital. Lo imprimo siempre.", rating: 5, specialty: "Mercantil", date: "Hace 1 mes" },
    { id: 50, name: "Lucía T.", role: "Gerente Comercial", content: "Uso el formato de reconocimiento de adeudo todo el tiempo con clientes morosos. Tiene peso legal real.", rating: 5, specialty: "Mercantil", date: "Hace 5 días" },
]
