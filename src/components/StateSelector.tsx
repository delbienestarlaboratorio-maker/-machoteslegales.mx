'use client'

import { useState } from 'react'
import { MEXICAN_STATES, FEDERAL_DATA, type StateData } from '@/data/states'

interface Props {
    onStateChange: (state: StateData) => void
}

export default function StateSelector({ onStateChange }: Props) {
    const [selected, setSelected] = useState<string>('FED')
    const [isOpen, setIsOpen] = useState(false)

    const currentState = selected === 'FED'
        ? FEDERAL_DATA
        : MEXICAN_STATES.find(s => s.code === selected) || FEDERAL_DATA

    const handleSelect = (code: string) => {
        setSelected(code)
        setIsOpen(false)
        const state = code === 'FED'
            ? FEDERAL_DATA
            : MEXICAN_STATES.find(s => s.code === code) || FEDERAL_DATA
        onStateChange(state)
    }

    return (
        <div className="glass-card p-5 relative">
            <h2 className="text-sm font-semibold text-white mb-2">📍 ¿En qué estado estás?</h2>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
                La plantilla se adaptará a las leyes de tu entidad.
            </p>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white text-sm hover:border-[var(--color-accent)]/50 transition-all"
            >
                <span className="flex items-center gap-2">
                    <span className="text-lg">🏛️</span>
                    <span className="truncate">{currentState.name}</span>
                </span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 z-50 glass-card rounded-xl border border-white/10 shadow-2xl max-h-72 overflow-y-auto">
                    {/* Federal */}
                    <button
                        onClick={() => handleSelect('FED')}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors flex items-center gap-2 ${selected === 'FED' ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'text-white'}`}
                    >
                        <span>🇲🇽</span> Federal (Aplicación General)
                    </button>

                    <div className="border-t border-white/5 my-1" />

                    {/* All states */}
                    {MEXICAN_STATES.map(state => (
                        <button
                            key={state.code}
                            onClick={() => handleSelect(state.code)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${selected === state.code ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'text-[var(--color-text-muted)] hover:text-white'}`}
                        >
                            {state.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Quick info about selected state */}
            {selected !== 'FED' && (
                <div className="mt-3 space-y-1.5 text-xs text-[var(--color-text-muted)] border-t border-white/5 pt-3">
                    <div className="flex gap-1.5">
                        <span className="text-[var(--color-accent)]">⚖️</span>
                        <span className="truncate">{currentState.codigoPenal}</span>
                    </div>
                    <div className="flex gap-1.5">
                        <span className="text-[var(--color-accent)]">🏢</span>
                        <span className="truncate">{currentState.fiscalia}</span>
                    </div>
                    <div className="flex gap-1.5">
                        <span className="text-[var(--color-accent)]">🏛️</span>
                        <span className="truncate">{currentState.tribunal}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
