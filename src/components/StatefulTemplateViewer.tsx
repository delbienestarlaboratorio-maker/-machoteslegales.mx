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
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Playfair+Display:wght@400;700&display=swap');
    body { font-family: 'Lato', 'Arial', sans-serif; font-size: 11.5pt; line-height: 1.85; color: #1a1a2e; padding: 2cm; background: #fff; }
    h1 { font-family: 'Playfair Display', 'Times New Roman', serif; font-size: 15pt; text-align: center; text-transform: uppercase; margin-bottom: 4px; color: #0d4a3a; letter-spacing: 0.5px; }
    .subtitle { font-size: 9.5pt; text-align: center; color: #0d6e50; margin-bottom: 12px; font-weight: 400; letter-spacing: 0.3px; }
    .header-v1 { 
      text-align: center; 
      background: linear-gradient(135deg, #e6f7f2 0%, #d0f0e8 100%);
      border-top: 4px solid #0d6e50;
      border-bottom: 2px solid #b2dfdb;
      border-radius: 0 0 8px 8px;
      padding: 18px 24px 14px 24px;
      margin-bottom: 22px;
      position: relative;
    }
    .header-v1::before {
      content: 'ACCESO GRATUITO';
      position: absolute;
      top: 8px; right: 12px;
      background: #0d6e50;
      color: white;
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 1.5px;
      padding: 2px 10px;
      border-radius: 12px;
    }
    .header { 
      text-align: center; 
      background: linear-gradient(135deg, #e6f7f2 0%, #d0f0e8 100%);
      border-top: 4px solid #0d6e50;
      border-bottom: 2px solid #b2dfdb;
      padding: 18px 24px 14px 24px;
      margin-bottom: 22px;
    }
    .section-title { 
      font-family: 'Lato', sans-serif;
      font-weight: 700;
      font-size: 10.5pt;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-top: 22px;
      margin-bottom: 8px;
      color: #0d4a3a;
      border-left: 4px solid #0d6e50;
      padding-left: 10px;
      background: #f0faf6;
      padding-top: 5px;
      padding-bottom: 5px;
    }
    .indent { text-indent: 1.5cm; }
    .text-justify { text-align: justify; }
    .text-bold { font-weight: 700; }
    .text-center { text-align: center; }
    .meta-line { text-align: right; font-size: 10.5pt; margin-bottom: 18px; color: #555; font-style: italic; }
    .signature-block { text-align: center; margin-top: 50px; }
    .signature-line { 
      display: inline-block;
      min-width: 260px;
      border-top: 1.5px solid #0d4a3a;
      padding-top: 8px;
      font-size: 10.5pt;
      color: #1a1a2e;
      text-align: center;
    }
    p { margin-bottom: 9px; }
    table { border-collapse: collapse; font-size: 10.5pt; }
    th { background: #0d4a3a; color: white; padding: 7px; }
    td { padding: 5px 7px; border: 1px solid #b2dfdb; }
    tr:nth-child(even) td { background: #f0faf6; }
  `,
    v2: `
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600&display=swap');
    body { font-family: 'Crimson Text', 'Times New Roman', serif; font-size: 13pt; line-height: 1.8; color: #1a1a1a; padding: 2cm; }
    h1 { font-size: 16pt; font-weight: 700; text-align: center; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .header-v2 { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px double #1a1a1a; }
    .subtitle-v2 { font-size: 10pt; color: #444; line-height: 1.4; }
    .tier-badge { display: inline-block; font-family: 'Inter', sans-serif; font-size: 8pt; font-weight: 600; letter-spacing: 2px; color: #fff; background: linear-gradient(135deg, #c9a84c, #dbb85a); padding: 3px 12px; border-radius: 3px; margin-bottom: 10px; }
    .section-title { font-size: 13pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 25px; margin-bottom: 12px; padding-bottom: 4px; border-bottom: 1px solid #ccc; }
    .section-title.numbered { color: #1a365d; }
    .indent { text-indent: 1.5cm; }
    .text-justify { text-align: justify; }
    .text-bold { font-weight: 700; }
    .text-center { text-align: center; }
    .double-space { line-height: 2.0; }
    .meta-line { text-align: right; font-size: 12pt; margin-bottom: 20px; }
    .destinatario { font-size: 12pt; margin-bottom: 3px; }
    p { margin-bottom: 10px; }
    .jurisprudencia-box { background: #f7f5f0; border-left: 4px solid #c9a84c; padding: 12px 16px; margin: 15px 0 20px 1.5cm; font-size: 10.5pt; line-height: 1.5; }
    .jurisprudencia-titulo { font-family: 'Inter', sans-serif; font-size: 8pt; font-weight: 600; letter-spacing: 1.5px; color: #8b7432; margin-bottom: 8px; }
    .jurisprudencia-texto { margin-bottom: 10px; color: #333; }
    .jurisprudencia-texto:last-child { margin-bottom: 0; }
    .jurisprudencia-texto em { font-style: italic; color: #1a365d; }
    .concepto-violacion { margin-top: 20px; margin-bottom: 25px; }
    .concepto-violacion h3 { font-size: 12pt; font-weight: 700; color: #1a365d; margin-bottom: 3px; }
    .concepto-violacion h4 { font-size: 11pt; font-style: italic; color: #555; margin-bottom: 10px; }
    .signature-block { margin-top: 40px; text-align: center; }
    .signature-line { display: inline-block; min-width: 280px; border-top: 1px solid #000; padding-top: 8px; font-size: 11pt; font-weight: 600; }
    .confidencialidad-v2 { margin-top: 50px; padding: 12px 16px; border: 1px solid #ddd; background: #fafafa; font-family: 'Inter', sans-serif; font-size: 8pt; line-height: 1.4; color: #777; }
    .confidencialidad-v2 p { margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    td, th { padding: 6px 8px; font-size: 12pt; }
    th { background: #1e3a5f; color: white; font-weight: 600; }
    td { border: 1px solid #c8d0e0; }
    tr:nth-child(even) td { background: #eef1f8; }
    .tabla-calculos { width: 100%; border-collapse: collapse; margin: 10px 0; }
    .tabla-calculos th { background: #1e3a5f; color: white; padding: 8px; font-size: 11pt; text-align: left; }
    .tabla-calculos td { padding: 6px 8px; border: 1px solid #ddd; font-size: 11pt; }
    .tabla-calculos tr:nth-child(even) td { background: #f5f7fa; }
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
