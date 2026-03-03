import { Metadata } from 'next'
import CalculadoraActualizacionINPC from './CalculadoraActualizacionINPC'

export const metadata: Metadata = {
    title: 'Actualización de Deudas e Impuestos por Inflación (INPC)',
    description: 'Actualiza sumas históricas a valor presente utilizando los Índices Nacionales de Precios al Consumidor (INPC) oficiales del Banco de México/INEGI. Obligatorio por el Art 17-A del CFF.',
    keywords: ['actualizar por inpc calculadora', 'inpc sat actualizacion', 'factor de actualizacion inpc', 'art 17-a cff', 'inflacion actualizacion deudas mexico', 'indice nacional precios consumidor multas'],
    openGraph: { title: 'Factor de Actualización INPC (SAT)', description: 'Simula el cálculo fiscal oficial para traer el valor del dinero del pasado al presente, aplicando la matemática inflacionaria que exigen los Juzgados y el SAE.', url: 'https://machoteslegales.mx/calculadora/actualizacion-inpc' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/actualizacion-inpc' },
}
export default function Page() { return <CalculadoraActualizacionINPC /> }
