/**
 * Componente de espacio publicitario reutilizable.
 * Muestra un placeholder visual donde irá publicidad (Google Adsense, etc).
 * Variantes: banner (horizontal), sidebar (vertical), inline (entre contenido).
 */

type AdVariant = 'banner' | 'sidebar' | 'inline'

interface AdSlotProps {
    variant?: AdVariant
    className?: string
}

const sizes: Record<AdVariant, { label: string; classes: string }> = {
    banner: {
        label: '728×90 — Banner Horizontal',
        classes: 'w-full min-h-[90px]',
    },
    sidebar: {
        label: '300×250 — Sidebar',
        classes: 'w-full min-h-[250px]',
    },
    inline: {
        label: '468×60 — Inline',
        classes: 'w-full min-h-[60px]',
    },
}

export default function AdSlot({ variant = 'banner', className = '' }: AdSlotProps) {
    const { label, classes } = sizes[variant]

    return (
        <div className={`${classes} ${className}`}>
            <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                <span className="text-white/15 text-xs font-mono">{label}</span>
                <span className="text-white/10 text-xs">— Espacio publicitario</span>
            </div>
        </div>
    )
}
