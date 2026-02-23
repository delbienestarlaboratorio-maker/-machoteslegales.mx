'use client'

import { useState, useRef, useEffect } from 'react'
import Fuse, { type FuseResult } from 'fuse.js'
import { allTemplates, Template } from '@/data/templates'

const fuse = new Fuse(allTemplates, {
    keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.2 },
        { name: 'keywords', weight: 0.3 },
        { name: 'specialty', weight: 0.1 },
    ],
    threshold: 0.4,        // tolerancia alta para errores ortográficos
    distance: 200,
    includeScore: true,
    minMatchCharLength: 2,
})

// Correcciones ortográficas comunes en búsquedas legales
const TYPO_MAP: Record<string, string> = {
    'divorsio': 'divorcio',
    'divorsio incausado': 'divorcio incausado',
    'diborcion': 'divorcio',
    'ampparo': 'amparo',
    'amprao': 'amparo',
    'anparo': 'amparo',
    'kerella': 'querella',
    'querela': 'querella',
    'aroendamiento': 'arrendamiento',
    'arendamiento': 'arrendamiento',
    'arrendamieto': 'arrendamiento',
    'despidio': 'despido',
    'laboral despidio': 'laboral despido',
    'despido inustificado': 'despido injustificado',
    'indemisacion': 'indemnización',
    'indemnisacion': 'indemnización',
    'indemnizacion': 'indemnización',
    'demada': 'demanda',
    'demana': 'demanda',
    'finiqito': 'finiquito',
    'finiquitto': 'finiquito',
    'penal robo': 'denuncia robo',
    'fraue': 'fraude',
    'fraudee': 'fraude',
    'mercantil pagre': 'mercantil pagaré',
    'pagre': 'pagaré',
    'pagare': 'pagaré',
    'constitucion': 'constitución',
    'pencion': 'pensión',
    'pencion alimenticia': 'pensión alimenticia',
    'pension': 'pensión',
    'guardia custodia': 'guarda custodia',
    'guardia y custodia': 'guarda y custodia',
    'testameto': 'testamento',
    'testemento': 'testamento',
    'comprabenta': 'compraventa',
    'compra venta': 'compraventa',
    'poder notarial': 'poder notarial',
    'contratoarrendamiento': 'contrato arrendamiento',
    'usucapion': 'usucapión',
    'prescripcion': 'prescripción',
    'reklamacion': 'reclamación',
    'recurso revision': 'recurso revisión',
    'abreviado': 'procedimiento abreviado',
    'liquidacion': 'liquidación',
    'liquidasion': 'liquidación',
    'suspencion': 'suspensión',
}

// Sinónimos para búsquedas en lenguaje natural
const SYNONYM_MAP: Record<string, string> = {
    'me robaron': 'denuncia robo',
    'me despidieron': 'despido injustificado',
    'no me pagan': 'demanda laboral salario',
    'me deben dinero': 'demanda mercantil pagaré',
    'quiero divorciarme': 'divorcio incausado',
    'crear empresa': 'acta constitutiva',
    'abrir empresa': 'acta constitutiva',
    'rentar casa': 'contrato arrendamiento',
    'renta departamento': 'contrato arrendamiento',
    'separacion': 'divorcio',
    'me estafaron': 'querella fraude',
    'me demandaron': 'contestación demanda',
    'deuda': 'demanda mercantil',
    'herencia': 'testamento sucesión',
    'custodia hijos': 'guarda custodia',
    'vender casa': 'compraventa inmueble',
    'comprar casa': 'compraventa inmueble',
    'accidente': 'denuncia lesiones',
    'amenazas': 'querella amenazas',
    'pension hijos': 'pensión alimenticia',
    'manutencion': 'pensión alimenticia',
    'carta poder': 'poder notarial',
    'impuestos sat': 'amparo fiscal',
    'multa sat': 'recurso revocación fiscal',
}

function correctTypos(query: string): string {
    const lower = query.toLowerCase().trim()
    // Check exact typo match
    if (TYPO_MAP[lower]) return TYPO_MAP[lower]
    // Check synonym match (natural language)
    if (SYNONYM_MAP[lower]) return SYNONYM_MAP[lower]
    // Check partial matches in both maps
    for (const [typo, fix] of Object.entries(TYPO_MAP)) {
        if (lower.includes(typo)) {
            return lower.replace(typo, fix)
        }
    }
    for (const [phrase, fix] of Object.entries(SYNONYM_MAP)) {
        if (lower.includes(phrase)) {
            return fix
        }
    }
    return query
}

const tierColors: Record<string, { bg: string; text: string; label: string }> = {
    v1: { bg: 'rgba(255,255,255,0.1)', text: '#e2e8f0', label: 'GRATIS' },
    v2: { bg: 'rgba(201,168,76,0.2)', text: '#c9a84c', label: '$79' },
    v3: { bg: 'rgba(147,130,220,0.2)', text: '#a78bfa', label: 'PRO' },
}

interface SearchBarProps {
    variant?: 'hero' | 'nav' | 'page'
    placeholder?: string
}

export default function SearchBar({ variant = 'page', placeholder }: SearchBarProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<FuseResult<Template>[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [corrected, setCorrected] = useState('')
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    function handleSearch(val: string) {
        setQuery(val)
        if (val.length < 2) {
            setResults([])
            setCorrected('')
            setIsOpen(false)
            return
        }
        const fixed = correctTypos(val)
        setCorrected(fixed !== val ? fixed : '')
        const searchResults = fuse.search(fixed.length > 0 ? fixed : val)
        setResults(searchResults.slice(0, 8))
        setIsOpen(true)
    }

    const isHero = variant === 'hero'

    return (
        <div ref={ref} className="relative w-full" style={{ maxWidth: isHero ? '640px' : '100%' }}>
            <div className="relative">
                <input
                    id="search-global"
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    placeholder={placeholder ?? 'Buscar plantilla... ej: demanda de amparo, divorcio, pagaré'}
                    className={`w-full px-5 pr-12 rounded-xl bg-[var(--color-surface-light)] border border-white/10 text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors ${isHero ? 'py-4 text-lg' : 'py-3.5 text-sm'}`}
                    autoComplete="off"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-lg">🔍</span>
            </div>

            {corrected && isOpen && (
                <div className="absolute top-full mt-1 left-0 text-xs text-[var(--color-accent)] px-2 z-50">
                    ¿Quisiste decir: <strong>&quot;{corrected}&quot;</strong>?
                </div>
            )}

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden border border-white/10 bg-[var(--color-surface)] shadow-2xl z-50 max-h-[400px] overflow-y-auto"
                    style={{ backdropFilter: 'blur(20px)' }}
                >
                    {results.map(({ item }) => {
                        const tier = tierColors[item.tier] ?? tierColors.v1
                        return (
                            <a
                                key={item.id}
                                href={`/plantillas/${item.specialty}/${item.slug}`}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                            >
                                <span
                                    className="text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0"
                                    style={{ background: tier.bg, color: tier.text }}
                                >
                                    {item.tier.toUpperCase()} {tier.label}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white truncate">{item.title}</div>
                                    <div className="text-xs text-[var(--color-text-muted)] truncate">{item.description}</div>
                                </div>
                                <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">→</span>
                            </a>
                        )
                    })}
                </div>
            )}

            {isOpen && query.length >= 2 && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[var(--color-surface)] p-6 text-center z-50">
                    <p className="text-sm text-[var(--color-text-muted)]">No se encontraron plantillas para &quot;{query}&quot;</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">Intenta con otras palabras clave como &quot;demanda&quot;, &quot;contrato&quot; o &quot;amparo&quot;</p>
                </div>
            )}
        </div>
    )
}
