'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Fuse, { type FuseResult } from 'fuse.js'
import { allTemplates, Template } from '@/data/templates'

const fuse = new Fuse(allTemplates, {
    keys: [
        { name: 'title', weight: 0.5 },
        { name: 'keywords', weight: 0.3 },
        { name: 'description', weight: 0.1 },
        { name: 'specialty', weight: 0.1 },
    ],
    threshold: 0.45,       // Even more tolerant for typos
    distance: 100,         // Keep matches closer to the search term
    ignoreLocation: true,  // Match anywhere in the string
    includeScore: true,
    minMatchCharLength: 2,
    useExtendedSearch: true,
})

// Expanded Typo Map for Mexican Legal Documents
const TYPO_MAP: Record<string, string> = {
    'divorsio': 'divorcio',
    'diborcio': 'divorcio',
    'divorcion': 'divorcio',
    'diborcion': 'divorcio',
    'ampparo': 'amparo',
    'amprao': 'amparo',
    'anparo': 'amparo',
    'kerella': 'querella',
    'querela': 'querella',
    'aroendamiento': 'arrendamiento',
    'arendamiento': 'arrendamiento',
    'arrendamieto': 'arrendamiento',
    'rendamiento': 'arrendamiento',
    'despidio': 'despido',
    'indemisacion': 'indemnización',
    'indemnisacion': 'indemnización',
    'indemnizacion': 'indemnización',
    'demada': 'demanda',
    'demana': 'demanda',
    'finiqito': 'finiquito',
    'finiquitto': 'finiquito',
    'fraue': 'fraude',
    'fraudee': 'fraude',
    'pagre': 'pagaré',
    'pagare': 'pagaré',
    'constitucion': 'constitución',
    'contitucion': 'constitución',
    'pencion': 'pensión',
    'pension': 'pensión',
    'testameto': 'testamento',
    'testemento': 'testamento',
    'comprabenta': 'compraventa',
    'usucapion': 'usucapión',
    'prescripcion': 'prescripción',
    'reklamacion': 'reclamación',
    'liquidacion': 'liquidación',
    'liquidasion': 'liquidación',
    'suspencion': 'suspensión',
    'pentrato': 'contrato',
    'cotrato': 'contrato',
    'contrat': 'contrato',
    'agravios': 'agravio',
    'apelasion': 'apelación',
    'apelacion': 'apelación',
}

// Expanded Natural Language Synonyms to match real intent
const SYNONYM_MAP: Record<string, string> = {
    'me robaron': 'denuncia robo',
    'me asaltaron': 'denuncia robo',
    'me despidieron': 'despido injustificado',
    'despido injusto': 'despido injustificado',
    'no me pagan': 'demanda laboral salario',
    'falta de pago': 'demanda mercantil pagaré',
    'me deben dinero': 'demanda mercantil pagaré',
    'deuda de pagare': 'demanda mercantil pagaré',
    'quiero divorciarme': 'divorcio incausado',
    'separacion': 'divorcio',
    'separarme': 'divorcio',
    'crear empresa': 'acta constitutiva',
    'abrir empresa': 'acta constitutiva',
    'rentar casa': 'contrato arrendamiento',
    'renta departamento': 'contrato arrendamiento',
    'rentar local': 'contrato arrendamiento comercial',
    'me estafaron': 'querella fraude',
    'fraude dinero': 'querella fraude',
    'me demandaron': 'contestación demanda',
    'responder demanda': 'contestación demanda',
    'herencia': 'testamento sucesión',
    'dejar bienes': 'testamento',
    'custodia hijos': 'guarda custodia',
    'quitarme a mis hijos': 'guarda custodia',
    'vender casa': 'compraventa inmueble',
    'comprar casa': 'compraventa inmueble',
    'comprar depa': 'compraventa inmueble',
    'accidente': 'denuncia lesiones',
    'me pegaron': 'denuncia lesiones',
    'choque auto': 'denuncia daños',
    'amenazas': 'querella amenazas',
    'me amenazaron': 'querella amenazas',
    'pension hijos': 'pensión alimenticia',
    'dinero niños': 'pensión alimenticia',
    'manutencion': 'pensión alimenticia',
    'carta poder': 'poder notarial',
    'dar poder': 'poder notarial general',
    'impuestos sat': 'amparo fiscal',
    'multa sat': 'recurso revocación fiscal',
    'multa trafico': 'recurso revisión administrativo',
    'juicio rapido': 'procedimiento abreviado',
}

// Recommended searches for the empty state
const RECOMMENDED_SEARCHES = [
    { title: 'Divorcio Incausado', term: 'divorcio incausado', icon: '💔' },
    { title: 'Demanda Laboral', term: 'despido injustificado', icon: '💼' },
    { title: 'Cobro de Pagaré', term: 'pagaré mercantil', icon: '💰' },
    { title: 'Arrendamiento', term: 'contrato arrendamiento', icon: '🏠' },
    { title: 'Juicio de Amparo', term: 'demanda de amparo', icon: '⚖️' },
]

function correctTypos(query: string): string {
    const lower = query.toLowerCase().trim()
    if (!lower) return ''

    // 1. Check exact natural language synonym
    if (SYNONYM_MAP[lower]) return SYNONYM_MAP[lower]

    // 2. Tokenize and correct individual words
    const words = lower.split(/\s+/)
    const correctedWords = words.map(w => TYPO_MAP[w] || w)
    const joined = correctedWords.join(' ')

    // 3. Fallback to partial synonym matching if no exact synonym was found
    for (const [phrase, fix] of Object.entries(SYNONYM_MAP)) {
        if (joined.includes(phrase)) {
            return joined.replace(phrase, fix)
        }
    }

    return joined
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
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const ref = useRef<HTMLDivElement>(null)
    const router = useRouter()

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
        setSelectedIndex(-1) // Reset keyboard selection on new input

        const trimmed = val.trim()
        if (val.length < 2) {
            setResults([])
            setCorrected('')
            // Keep it open to show recommendations if they just clicked/cleared
            if (val.length === 0) setIsOpen(true)
            return
        }

        const fixed = correctTypos(trimmed)
        setCorrected(fixed !== trimmed ? fixed : '')

        // Create a fuzzy search query. If there are multiple words, require all of them ideally.
        const fuseQuery = fixed.length > 0 ? fixed : trimmed
        const searchResults = fuse.search(fuseQuery)
        setResults(searchResults.slice(0, 8))
        setIsOpen(true)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!isOpen) return

        const maxIndex = query.length < 2 ? RECOMMENDED_SEARCHES.length - 1 : results.length - 1

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault()
            if (query.length < 2) {
                // Selected a recommended search
                handleSearch(RECOMMENDED_SEARCHES[selectedIndex].term)
            } else {
                // Selected an actual result
                const item = results[selectedIndex].item
                router.push(`/plantillas/${item.specialty}/${item.slug}`)
                setIsOpen(false)
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false)
        }
    }

    function applyRecommendation(term: string) {
        handleSearch(term)
        // Optionally focus the input again
        const input = document.getElementById('search-global') as HTMLInputElement
        if (input) input.focus()
    }

    const isHero = variant === 'hero'
    const showRecommendations = isOpen && query.length < 2

    return (
        <div ref={ref} className="relative w-full" style={{ maxWidth: isHero ? '640px' : '100%' }}>
            <div className={`relative flex items-center bg-[var(--color-surface-light)] border transition-all rounded-xl ${isOpen ? 'border-[var(--color-accent)]/80 shadow-[0_0_15px_rgba(201,168,76,0.15)] bg-[#1e293b]' : 'border-white/10'}`}>
                <span className="pl-4 text-[var(--color-text-muted)] text-lg">🔍</span>
                <input
                    id="search-global"
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder ?? 'Busca formato... ej: amparo, divorcio, pagaré'}
                    className={`w-full px-3 pr-4 bg-transparent text-white placeholder:text-[var(--color-text-muted)] focus:outline-none ${isHero ? 'py-4 text-lg' : 'py-3.5 text-sm'}`}
                    autoComplete="off"
                    spellCheck="false"
                />

                {query.length > 0 && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); setIsOpen(true) }}
                        className="absolute right-4 text-[var(--color-text-muted)] hover:text-white"
                    >
                        ✕
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[var(--color-surface-card)] shadow-2xl z-50 overflow-hidden"
                    style={{ backdropFilter: 'blur(20px)' }}
                >
                    {/* Typo Correction Banner */}
                    {corrected && query.length >= 2 && (
                        <div className="bg-[var(--color-accent)]/10 px-4 py-2 border-b border-[var(--color-accent)]/20 text-xs text-[var(--color-accent)] flex items-center gap-2">
                            <span>✨</span> ¿Mostrando resultados para <strong>&quot;{corrected}&quot;</strong>?
                        </div>
                    )}

                    {/* Results List */}
                    {query.length >= 2 && results.length > 0 && (
                        <div className="max-h-[400px] overflow-y-auto py-2">
                            {results.map(({ item }, index) => {
                                const tier = tierColors[item.tier] ?? tierColors.v1
                                const isSelected = index === selectedIndex
                                return (
                                    <a
                                        key={item.id}
                                        href={`/plantillas/${item.specialty}/${item.slug}`}
                                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'} border-b border-white/5 last:border-0`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span
                                            className="text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0"
                                            style={{ background: tier.bg, color: tier.text }}
                                        >
                                            {item.tier.toUpperCase()} {tier.label}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-white truncate flex items-center justify-between">
                                                {item.title}
                                            </div>
                                            <div className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">{item.description}</div>
                                        </div>
                                        {isSelected ? (
                                            <span className="text-xs text-white opacity-50 flex-shrink-0 animate-pulse">↵</span>
                                        ) : (
                                            <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                        )}
                                    </a>
                                )
                            })}
                        </div>
                    )}

                    {/* No Results Empty State */}
                    {query.length >= 2 && results.length === 0 && (
                        <div className="p-8 text-center bg-[var(--color-surface-light)]/50">
                            <div className="text-3xl mb-3 opacity-50">🤖</div>
                            <p className="text-sm text-white font-medium mb-1">No se encontró nada para &quot;{query}&quot;</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Intenta con el término legal (ej "arrendamiento" en vez de "rentar")</p>
                        </div>
                    )}

                    {/* Recommended Searches Empty State */}
                    {showRecommendations && (
                        <div className="py-2 bg-[var(--color-surface-light)]">
                            <div className="px-4 py-2 text-xs font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
                                Búsquedas Frecuentes
                            </div>
                            {RECOMMENDED_SEARCHES.map((rec, index) => {
                                const isSelected = index === selectedIndex
                                return (
                                    <button
                                        key={rec.term}
                                        onClick={() => applyRecommendation(rec.term)}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors ${isSelected ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-[var(--color-text-muted)] hover:text-white'}`}
                                    >
                                        <span className="text-sm">{rec.icon}</span>
                                        <span className="text-sm font-medium">{rec.title}</span>
                                        {isSelected && <span className="ml-auto text-xs opacity-50">↵</span>}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
