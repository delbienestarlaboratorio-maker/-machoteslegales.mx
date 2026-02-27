'use client'

import { useState } from 'react'

const FAQS = [
    {
        question: "¿Estos machotes son válidos legalmente en todo México?",
        answer: "Sí. Todos nuestros formatos están redactados con base en el Código Civil Federal, Código de Comercio y leyes generales aplicables. En caso de legislaciones estatales, la estructura es 100% compatible y solo debes adaptar la entidad federativa en los espacios indicados."
    },
    {
        question: "¿Necesito a un abogado para usar estas plantillas?",
        answer: "No obligatoriamente. Están diseñadas para que cualquier ciudadano pueda rellenarlas y presentarlas. Sin embargo, para juicios complejos (como amparos o divorcios contenciosos), siempre recomendamos que un profesional titulado revise el documento final antes de ingresarlo al juzgado."
    },
    {
        question: "¿Cómo edito el documento una vez descargado?",
        answer: "Al descargar la versión completa, obtienes el formato listo para usarse. Deberás llenar los espacios en blanco resaltados (como NOMBRES, FECHAS y CANTIDADES) en tu procesador de textos favorito (Word, Google Docs, etc.) y posteriormente imprimirlo para su firma."
    },
    {
        question: "¿Qué garantía tengo de que están actualizados?",
        answer: "Nuestro equipo legal revisa constantemente las tesis de jurisprudencia de la SCJN y las reformas publicadas en el Diario Oficial de la Federación (DOF) para garantizar que no utilices artículos derogados."
    },
    {
        question: "¿Tienen devoluciones si el formato no me sirve?",
        answer: "Nuestra prioridad es que resuelvas tu situación legal. Si consideras que el formato no cumple con los estándares descritos, tienes 7 días para solicitar la revisión y te ofreceremos una solución o devolución del 100%."
    }
]

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <section className="py-16 mt-12 border-t border-white/5">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
                    <p className="text-[var(--color-text-muted)]">Resuelve tus dudas antes de descargar tu formato legal.</p>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index
                        return (
                            <div
                                key={index}
                                className="bg-[var(--color-surface-light)] border border-white/5 rounded-xl overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                                >
                                    <span className="font-semibold text-white/90">{faq.question}</span>
                                    <span className={`text-[var(--color-text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>

                                <div
                                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 pb-5 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
