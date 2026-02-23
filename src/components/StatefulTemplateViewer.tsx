'use client'

import { useState, useCallback } from 'react'
import StateSelector from './StateSelector'
import { FEDERAL_DATA, type StateData } from '@/data/states'

interface Props {
    htmlContent: string
    title: string
    tier: 'v1' | 'v2' | 'v3'
}

// Map of Jinja2 variable names to StateData keys
const STATE_VAR_MAP: Record<string, keyof StateData> = {
    'ciudad': 'capital',
    'estado': 'name',
    'fiscalia': 'fiscalia',
    'tribunal': 'tribunal',
    'juzgado': 'juzgados',
    'juzgados': 'juzgados',
    'codigo_penal': 'codigoPenal',
    'codigo_civil': 'codigoCivil',
    'codigo_procedimientos': 'codigoProc',
}

function applyStateToHtml(html: string, state: StateData): string {
    let result = html

    // Replace city/state variables - handles formats like:
    //   {{ ciudad | default("Ciudad") }}  OR  <span ...> ciudad | default("Ciudad") </span>
    // Replace ciudad with state capital
    result = result.replace(/ ?ciudad\s*\|\s*default\([^)]*\)/gi, state.capital)
    // Replace estado with state name  
    result = result.replace(/ ?estado\s*\|\s*default\([^)]*\)/gi, state.name)

    // Inject a state-specific legal info banner at the top
    const banner = `
        <div style="background:linear-gradient(135deg,#edf2ff,#dbeafe); border:2px solid #3b82f6; border-radius:8px; padding:16px 20px; margin-bottom:24px; font-size:11pt;">
            <div style="font-size:9pt; font-weight:700; letter-spacing:1.5px; color:#1e40af; text-transform:uppercase; margin-bottom:8px;">
                📍 Documento Adaptado para: ${state.name}
            </div>
            <div style="color:#1e293b; line-height:1.6; font-size:10pt;">
                <strong>Código Penal Aplicable:</strong> ${state.codigoPenal}<br>
                <strong>Código Civil Aplicable:</strong> ${state.codigoCivil}<br>
                <strong>Fiscalía Competente:</strong> ${state.fiscalia}<br>
                <strong>Tribunal:</strong> ${state.tribunal}
            </div>
        </div>
    `

    // Replace generic federal references with state-specific ones
    result = result.replace(/Código Penal Federal/g, state.codigoPenal)
    result = result.replace(/CPF/g, state.codigoPenal.includes('Federal') ? 'CPF' : `CP${state.code}`)
    result = result.replace(/Código Civil Federal/g, state.codigoCivil)
    result = result.replace(/CCF/g, state.codigoCivil.includes('Federal') ? 'CCF' : `CC${state.code}`)
    result = result.replace(/Fiscalía General de la República/g, state.fiscalia)
    result = result.replace(/Ministerio Público Federal/g, state.fiscalia)
    result = result.replace(/Art\. 386 CPF/g, state.artFraude)
    result = result.replace(/Art\. 367 CPF/g, state.artRobo)
    result = result.replace(/Art\. 282 CPF/g, state.artAmenazas)
    result = result.replace(/Art\. 399 CPF/g, state.artDanoPropiedad)

    return banner + result
}

const tierStyles: Record<string, string> = {
    v1: `
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.8; color: #000; padding: 2cm; }
    h1 { font-size: 14pt; text-align: center; text-transform: uppercase; margin-bottom: 5px; }
    .subtitle { font-size: 10pt; text-align: center; color: #555; margin-bottom: 15px; }
    .header { text-align:center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
    .section-title { font-weight:bold; text-transform:uppercase; margin-top:20px; margin-bottom:10px; text-align:center; font-size:12pt; }
    .indent { text-indent: 1.5cm; }
    .text-justify { text-align: justify; }
    .text-bold { font-weight: bold; }
    .meta-line { text-align: right; font-size: 11pt; margin-bottom: 20px; }
    .signature-line { border-top: 1px solid #000; padding-top: 8px; text-align: center; margin-top: 40px; }
    p { margin-bottom: 8px; }
  `,
    v2: `
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    body { font-family: 'Crimson Text', 'Times New Roman', serif; font-size: 13pt; line-height: 1.9; color: #111; padding: 2cm; }
    h1 { font-size: 16pt; font-weight: 700; text-align: center; text-transform: uppercase; margin-bottom: 8px; }
    .section-title { font-weight:700; text-transform:uppercase; margin-top:22px; margin-bottom:10px; padding-bottom:3px; border-bottom:1px solid #ccc; }
    .indent { text-indent: 1.5cm; }
    .text-justify { text-align: justify; }
    .signature-line { border-top: 1px solid #000; padding-top: 8px; text-align: center; margin-top: 40px; }
    p { margin-bottom:10px; }
  `,
    v3: `
    body { font-family: 'Crimson Text', 'Times New Roman', serif; font-size: 13pt; line-height: 1.9; color: #111; padding: 2cm; }
    .section-title { font-weight:700; text-transform:uppercase; margin-top:22px; margin-bottom:10px; padding-bottom:3px; border-bottom:1px solid #ccc; color:#1e3a5f; }
    .indent { text-indent: 1.5cm; }
    .text-justify { text-align: justify; }
    .signature-line { border-top: 1px solid #000; padding-top: 8px; text-align: center; margin-top: 40px; }
    p { margin-bottom:10px; }
  `,
}

export default function StatefulTemplateViewer({ htmlContent, title, tier }: Props) {
    const [currentState, setCurrentState] = useState<StateData>(FEDERAL_DATA)
    const [isPrinting, setIsPrinting] = useState(false)

    const processedHtml = applyStateToHtml(htmlContent, currentState)

    const handleDownloadPDF = () => {
        const printWindow = window.open('', '_blank')
        if (!printWindow) return
        printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es-MX">
      <head>
        <meta charset="UTF-8">
        <title>${title} — ${currentState.name}</title>
        <style>
          ${tierStyles[tier]}
          @media print {
            body { padding: 0; }
            @page { size: letter; margin: 2.5cm 2cm 2cm 3cm; }
          }
        </style>
      </head>
      <body>${processedHtml}</body>
      </html>
    `)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => { printWindow.print(); printWindow.close() }, 500)
    }

    const handleCopyText = async () => {
        const tmp = document.createElement('div')
        tmp.innerHTML = processedHtml
        await navigator.clipboard.writeText(tmp.innerText)
    }

    return (
        <div className="flex flex-col gap-4">
            {/* State Selector */}
            <StateSelector onStateChange={setCurrentState} />

            {/* Toolbar */}
            <div className="flex items-center justify-between bg-[var(--color-surface)] rounded-xl px-4 py-3 border border-white/10">
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${tier === 'v1' ? 'bg-white/10 text-white' :
                        tier === 'v2' ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' :
                            'bg-blue-500/20 text-blue-400'
                        }`}>
                        {tier.toUpperCase()}
                    </span>
                    <span className="text-sm text-[var(--color-text-muted)] truncate max-w-xs">{title}</span>
                    {currentState.code !== 'FED' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                            📍 {currentState.name}
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopyText}
                        className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white transition-colors"
                    >
                        Copiar texto
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isPrinting}
                        className="px-4 py-1.5 text-xs rounded-lg font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-black transition-colors disabled:opacity-50"
                    >
                        {isPrinting ? 'Generando...' : '↓ Descargar PDF'}
                    </button>
                </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl border border-white/10 overflow-hidden bg-white shadow-2xl">
                <div
                    className="template-preview"
                    style={{
                        fontFamily: tier === 'v1' ? "'Times New Roman', serif" : "'Crimson Text', 'Times New Roman', serif",
                        fontSize: '12pt',
                        lineHeight: '1.8',
                        color: '#111',
                        padding: '2cm',
                        minHeight: '29.7cm',
                        background: '#fff',
                    }}
                    dangerouslySetInnerHTML={{
                        __html: `
            <style>${tierStyles[tier]}</style>
            ${processedHtml}
          ` }}
                />
            </div>
        </div>
    )
}
