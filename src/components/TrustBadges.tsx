import React from 'react'

const badges = [
    {
        icon: '👨‍⚖️',
        color: 'emerald',
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/20',
        iconColor: 'text-emerald-400',
        title: 'Redactado por Abogados',
        desc: 'Firmas verificadas de México',
    },
    {
        icon: '🗓️',
        color: 'blue',
        bg: 'bg-blue-500/15',
        border: 'border-blue-500/20',
        iconColor: 'text-blue-400',
        title: 'Actualizado 2025-2026',
        desc: 'Legislación y reformas vigentes',
    },
    {
        icon: '🛡️',
        color: 'gold',
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/20',
        iconColor: 'text-amber-400',
        title: '100% Válido en México',
        desc: 'Aceptado en todos los juzgados',
    },
]

export default function TrustBadges() {
    return (
        <div className="flex flex-col gap-2">
            {badges.map((b) => (
                <div
                    key={b.title}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${b.bg} border ${b.border}`}
                >
                    <span className="text-2xl flex-shrink-0">{b.icon}</span>
                    <div className="min-w-0">
                        <p className="text-white text-xs font-semibold leading-tight">{b.title}</p>
                        <p className="text-white/50 text-xs leading-tight mt-0.5">{b.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
