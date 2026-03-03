'use client'

import React, { useState, useEffect, useRef } from 'react'

interface TemplateVar {
    id: string
    label: string
    type: string
    defaultValue: string
}

export default function GeneradorContratoClient({ template, htmlRaw, baseStyles }: { template: any, htmlRaw: string, baseStyles: string }) {
    const [variables, setVariables] = useState<TemplateVar[]>([])
    const [responses, setResponses] = useState<Record<string, string>>({})
    const [isPrinting, setIsPrinting] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [hasPaid, setHasPaid] = useState(false) // Mock payment state
    const varsPerStep = 4 // Agrupar variables de a 4 para no saturar al usuario
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Parse the HTML string to find dynamic fields
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlRaw, 'text/html')
        const spans = doc.querySelectorAll('span.campo-dinamico')

        const varsFound: TemplateVar[] = []
        const uniqueSet = new Set<string>()

        spans.forEach(span => {
            const id = span.getAttribute('data-id')
            const label = span.getAttribute('data-label')
            const type = span.getAttribute('data-type')
            const defVal = span.textContent?.replace(/[()\[\]]/g, '')

            if (id && label && type && !uniqueSet.has(id)) {
                uniqueSet.add(id)
                varsFound.push({ id, label, type, defaultValue: defVal || '' })
            }
        })

        setVariables(varsFound)

        // initialize responses
        const initialResp: Record<string, string> = {}
        varsFound.forEach(v => initialResp[v.id] = '')
        setResponses(initialResp)
    }, [htmlRaw])

    // Compute live html
    const getLiveHtml = () => {
        let liveHtml = htmlRaw
        variables.forEach(v => {
            const val = responses[v.id]
            const isFilled = val && val.trim() !== ''
            const classStr = isFilled ? 'campo-dinamico filled' : 'campo-dinamico'
            const content = isFilled ? val : `[${v.defaultValue}]`

            // Reemplazar la etiqueta original manteniendo la estructura pero inyectando el valor/clase
            const regex = new RegExp(`<span[^>]*data-id="${v.id}"[^>]*>.*?<\\/span>`, 'g')
            liveHtml = liveHtml.replace(regex, `<span class="${classStr}">${content}</span>`)
        })
        return liveHtml
    }

    const handlePrint = () => {
        if (template.tier === 'v2' && !hasPaid) {
            alert('En producción esto abrirá Stripe Checkout. Ahora, te marcaremos como Pagado para que puedas imprimir.')
            setHasPaid(true)
            return
        }
        setIsPrinting(true)
        setTimeout(() => {
            window.print()
            setIsPrinting(false)
        }, 500) // Ensure react rendered the print-friendly DOM layout
    }

    return (
        <div className={`flex flex-col lg:flex-row bg-gray-100 font-sans ${isPrinting ? 'min-h-screen' : 'h-screen overflow-hidden'}`}>
            {/* PANEL IZQUIERDO: WIZARD */}
            <div className={`w-full lg:w-1/3 bg-white border-r border-gray-200 flex flex-col ${isPrinting ? 'hidden' : 'flex'}`}>
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center z-10 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">Generador V2</span>
                        </div>
                        <h2 className="font-bold text-gray-800 text-lg leading-tight">Asistente de Llenado</h2>
                        <p className="text-xs text-gray-500 mt-1">{template.title}</p>
                    </div>
                    <a href="/" className="text-gray-400 hover:text-gray-600" title="Cerrar">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </a>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col">
                    <div className="mb-6">
                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                            <span>Paso {currentStep} de {Math.ceil(variables.length / varsPerStep) || 1}</span>
                            <span>{Math.round(((currentStep - 1) / (Math.ceil(variables.length / varsPerStep) || 1)) * 100)}% Completado</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-600 h-full transition-all duration-500 ease-out"
                                style={{ width: `${(currentStep / (Math.ceil(variables.length / varsPerStep) || 1)) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1">
                        {variables.slice((currentStep - 1) * varsPerStep, currentStep * varsPerStep).map((v, index) => {
                            const globalIndex = (currentStep - 1) * varsPerStep + index;
                            return (
                                <div key={v.id} className="flex flex-col bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                                    <label className="text-sm font-semibold text-gray-700 mb-3 flex items-start">
                                        <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">{globalIndex + 1}</span>
                                        {v.label}
                                    </label>
                                    {v.type === 'textarea' ? (
                                        <textarea
                                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black bg-gray-50 focus:bg-white"
                                            rows={3}
                                            placeholder={v.defaultValue}
                                            value={responses[v.id] || ''}
                                            onChange={(e) => setResponses({ ...responses, [v.id]: e.target.value })}
                                        />
                                    ) : (
                                        <input
                                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black bg-gray-50 focus:bg-white"
                                            type={v.type}
                                            placeholder={v.defaultValue}
                                            value={responses[v.id] || ''}
                                            onChange={(e) => setResponses({ ...responses, [v.id]: e.target.value })}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Controles del Wizard */}
                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between gap-4">
                        <button
                            onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                            disabled={currentStep === 1}
                            className="px-6 py-3 rounded-xl border border-gray-300 font-bold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            ← Anterior
                        </button>

                        {currentStep < Math.ceil(variables.length / varsPerStep) ? (
                            <button
                                onClick={() => setCurrentStep(s => Math.min(Math.ceil(variables.length / varsPerStep), s + 1))}
                                className="px-6 py-3 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 transition-colors flex-1 shadow-md shadow-blue-500/20"
                            >
                                Siguiente Paso →
                            </button>
                        ) : (
                            template.tier === 'v2' && !hasPaid ? (
                                <button
                                    onClick={handlePrint}
                                    className="px-6 py-3 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-500 transition-colors flex-1 shadow-md shadow-blue-500/20 flex justify-center items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    Pagar ${template.price} MXN para Descargar
                                </button>
                            ) : (
                                <button
                                    onClick={handlePrint}
                                    className="px-6 py-3 rounded-xl bg-emerald-500 font-bold text-black hover:bg-emerald-400 transition-colors flex-1 shadow-md shadow-emerald-500/20 flex justify-center items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {template.tier === 'v2' ? 'Documento Liberado (Imprimir PDF)' : 'Terminar e Imprimir (Gratis)'}
                                </button>
                            )
                        )}
                    </div>

                    <div className="pt-6 pb-12 mt-6 border-t border-gray-200">
                        <p className="text-xs text-center text-gray-500 font-medium">✨ Los datos ingresados en este asistente no viajan a ningún servidor y se procesan 100% de forma local en tu navegador por seguridad.</p>
                    </div>
                </div>
            </div>

            {/* PANEL DERECHO: LIVE PREVIEW */}
            <div className={`w-full ${isPrinting ? 'block bg-white' : 'lg:w-2/3 bg-gray-200 hidden lg:flex flex-col items-center overflow-y-auto pt-8 pb-16'}`}>

                {/* Print Styles Injection */}
                <style dangerouslySetInnerHTML={{ __html: baseStyles }} />
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        body { background: white !important; margin: 0 !important; padding: 0 !important; }
                        #preview-container { margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; box-shadow: none !important; }
                        .document-content { padding: 0 !important; }
                        @page { margin: 1.5cm 2cm 2cm 2cm !important; }
                        .watermark-overlay { display: none !important; }
                    }
                `}} />

                <div
                    className={`mx-auto bg-white transition-all relative ${isPrinting ? '' : 'shadow-2xl rounded-sm shrink-0'}`}
                    style={isPrinting ? {} : { width: '21.6cm', minHeight: '27.9cm', padding: '2.5cm 2.5cm 2cm 3cm' }}
                    id="preview-container"
                >
                    {template.tier === 'v2' && !hasPaid && !isPrinting && (
                        <div className="absolute inset-0 pointer-events-none watermark-overlay z-50 overflow-hidden flex items-center justify-center opacity-70">
                            <div className="text-gray-200/50 font-black text-6xl uppercase tracking-widest whitespace-nowrap transform -rotate-45 select-none" style={{ fontFamily: 'var(--font-outfit)' }}>
                                VISTA PREVIA (SIN VALIDEZ) • PAGA PARA DESBLOQUEAR • VISTA PREVIA (SIN VALIDEZ)
                            </div>
                        </div>
                    )}
                    <div
                        ref={contentRef}
                        className="document-content font-serif text-[11pt] sm:text-[13pt] leading-relaxed text-[#1a1a1a]"
                        dangerouslySetInnerHTML={{ __html: getLiveHtml() }}
                    />
                </div>

            </div>

            {/* VISTA MÓVIL (BOTÓN FLOTANTE PARA VER PREVIEW) */}
            <div className={`lg:hidden fixed bottom-6 right-6 ${isPrinting ? 'hidden' : 'block'}`}>
                <button
                    onClick={handlePrint}
                    className="bg-[#c9a84c] text-white p-4 rounded-full shadow-2xl"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
            </div>
        </div>
    )
}
