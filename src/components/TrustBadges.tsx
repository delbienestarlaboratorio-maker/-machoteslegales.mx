import React from 'react'

export default function TrustBadges() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-4 px-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface-light)] border border-white/5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl shrink-0">
                    👨‍⚖️
                </div>
                <div>
                    <h4 className="text-white text-sm font-semibold">Redactado por Abogados</h4>
                    <p className="text-[var(--color-text-muted)] text-xs mt-0.5">Firmas legales verificadas de México</p>
                </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface-light)] border border-white/5">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl shrink-0">
                    🗓️
                </div>
                <div>
                    <h4 className="text-white text-sm font-semibold">Regulaciones de 2025</h4>
                    <p className="text-[var(--color-text-muted)] text-xs mt-0.5">Fundamentos jurídicos vigentes</p>
                </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface-light)] border border-white/5">
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] text-xl shrink-0">
                    🛡️
                </div>
                <div>
                    <h4 className="text-white text-sm font-semibold">100% Válido y Seguro</h4>
                    <p className="text-[var(--color-text-muted)] text-xs mt-0.5">Aceptado en todo juzgado nacional</p>
                </div>
            </div>
        </div>
    )
}
