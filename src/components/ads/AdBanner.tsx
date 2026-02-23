'use client'

interface AdBannerProps {
    slot?: string
    format?: 'horizontal' | 'vertical' | 'rectangle'
    className?: string
}

/**
 * AdBanner — Placeholder para Google AdSense.
 * 
 * En producción, reemplazar el contenido con el script real de AdSense:
 *   <ins class="adsbygoogle" data-ad-client="ca-pub-XXXXX" data-ad-slot="YYYYY" ...></ins>
 *   <script>(adsbygoogle = window.adsbygoogle || []).push({})</script>
 * 
 * Se muestra SOLO en plantillas V1 (gratuitas).
 */
export default function AdBanner({ format = 'horizontal', className = '' }: AdBannerProps) {
    const sizes: Record<string, { minH: string; ratio: string }> = {
        horizontal: { minH: '90px', ratio: '' },
        vertical: { minH: '600px', ratio: '' },
        rectangle: { minH: '250px', ratio: '' },
    }

    const { minH } = sizes[format]

    return (
        <div
            className={`relative rounded-xl overflow-hidden border border-white/5 ${className}`}
            style={{ minHeight: minH, background: 'linear-gradient(135deg, rgba(30,41,59,0.4), rgba(15,23,42,0.6))' }}
        >
            {/* Placeholder visual — se reemplaza con AdSense real */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-40">
                <div className="text-xs text-[var(--color-text-muted)] tracking-widest uppercase">Publicidad</div>
                <div className="w-12 h-px bg-white/20" />
                <div className="text-[10px] text-[var(--color-text-muted)]">Anuncio no invasivo</div>
            </div>
        </div>
    )
}
