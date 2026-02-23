'use client'

import dynamic from 'next/dynamic'

const TemplateViewer = dynamic(() => import('./TemplateViewer'), {
    ssr: false,
    loading: () => (
        <div className="rounded-xl border border-white/10 bg-[var(--color-surface)] min-h-[800px] flex items-center justify-center">
            <div className="text-[var(--color-text-muted)] text-sm">Cargando vista previa...</div>
        </div>
    ),
})

export default function TemplateViewerWrapper(props: {
    htmlContent: string
    title: string
    tier: 'v1' | 'v2' | 'v3'
}) {
    return <TemplateViewer {...props} />
}
