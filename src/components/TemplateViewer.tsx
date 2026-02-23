'use client'

import { useState } from 'react'

interface Props {
    htmlContent: string
    title: string
    tier: 'v1' | 'v2' | 'v3'
}

const tierStyles = {
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
    p { margin-bottom: 8px; }
  `,
    v2: `
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    body { font-family: 'Crimson Text', 'Times New Roman', serif; font-size: 13pt; line-height: 1.9; color: #111; padding: 2cm; }
    h1 { font-size: 16pt; font-weight: 700; text-align: center; text-transform: uppercase; margin-bottom: 8px; }
    .header-v2 { text-align:center; border-bottom: 2px double #111; margin-bottom: 25px; padding-bottom: 15px; }
    .tier-badge { display:inline-block; font-size:8pt; font-weight:700; letter-spacing:2px; color:#fff; background:linear-gradient(135deg,#c9a84c,#dbb85a); padding:3px 12px; border-radius:3px; margin-bottom:10px; }
    .subtitle-v2 { font-size:10pt; color:#555; line-height:1.4; }
    .section-title { font-weight:700; text-transform:uppercase; margin-top:22px; margin-bottom:10px; padding-bottom:3px; border-bottom:1px solid #ccc; }
    .section-title.numbered { color: #1a365d; }
    .indent { text-indent: 1.5cm; }
    .text-justify { text-align: justify; }
    .text-bold { font-weight:700; }
    .meta-line { text-align: right; font-size: 12pt; margin-bottom: 20px; }
    .jurisprudencia-box { background:#f7f5f0; border-left:4px solid #c9a84c; padding:12px 16px; margin:15px 0 20px 1.5cm; font-size:10.5pt; line-height:1.5; }
    .jurisprudencia-titulo { font-size:8pt; font-weight:700; letter-spacing:1.5px; color:#8b7432; margin-bottom:8px; }
    .jurisprudencia-texto { margin-bottom:10px; color:#333; }
    .jurisprudencia-texto em { color:#1a365d; }
    .concepto-violacion h3 { font-size:12pt; font-weight:700; color:#1a365d; margin-bottom:3px; }
    .concepto-violacion h4 { font-size:11pt; font-style:italic; color:#555; margin-bottom:10px; }
    .confidencialidad-v2 { margin-top:50px; padding:12px 16px; border:1px solid #ddd; background:#fafafa; font-size:8pt; color:#777; line-height:1.4; }
    p { margin-bottom:10px; }
  `,
    v3: `
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
    body { font-family: 'Crimson Text', 'Times New Roman', serif; font-size: 13pt; line-height: 1.9; color: #111; padding: 2cm; position:relative; }
    body::before { content:'CONFIDENCIAL'; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-45deg); font-size:80pt; font-weight:700; color:rgba(0,0,0,0.03); white-space:nowrap; pointer-events:none; z-index:-1; }
    .tier-badge-v3 { display:inline-block; font-size:7.5pt; font-weight:700; letter-spacing:2.5px; color:#fff; background:linear-gradient(135deg,#1e3a5f,#2d5a8e); padding:4px 12px; border-radius:3px; }
    .jurisprudencia-box { background:#f7f5f0; border-left:4px solid #c9a84c; padding:12px 16px; margin:15px 0 20px 1.5cm; font-size:10.5pt; }
    .estrategia-box { background:linear-gradient(135deg,#1e3a5f08,#1e3a5f03); border:1px solid #1e3a5f30; border-left:4px solid #1e3a5f; padding:14px 18px; margin:20px 0; }
    .estrategia-titulo { font-size:7.5pt; font-weight:700; letter-spacing:2px; color:#1e3a5f; text-transform:uppercase; margin-bottom:8px; }
    .section-title { font-weight:700; text-transform:uppercase; margin-top:22px; margin-bottom:10px; padding-bottom:3px; border-bottom:1px solid #ccc; color:#1e3a5f; }
    .indent { text-indent: 1.5cm; }
    .text-justify { text-align: justify; }
    p { margin-bottom:10px; }
  `,
}

export default function TemplateViewer({ htmlContent, title, tier }: Props) {
    const [isPrinting, setIsPrinting] = useState(false)

    const handleDownloadPDF = () => {
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es-MX">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          ${tierStyles[tier]}
          @media print {
            body { padding: 0; }
            @page { size: letter; margin: 2.5cm 2cm 2cm 3cm; }
          }
        </style>
      </head>
      <body>${htmlContent}</body>
      </html>
    `)
        printWindow.document.close()
        printWindow.focus()

        setTimeout(() => {
            printWindow.print()
            printWindow.close()
        }, 500)
    }

    const handleCopyText = async () => {
        const tmp = document.createElement('div')
        tmp.innerHTML = htmlContent
        await navigator.clipboard.writeText(tmp.innerText)
    }

    return (
        <div className="flex flex-col gap-4">
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
            ${htmlContent}
          ` }}
                />
            </div>
        </div>
    )
}
