"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { diccionariJuridico, DictionaryTerm } from '@/data/diccionario';

export default function DiccionarioSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DictionaryTerm[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Cerrar el dropdown si se hace click afuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Lógica de filtrado predictivo reactivo
    useEffect(() => {
        if (query.trim().length > 1) {
            const searchTerm = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            const filtered = diccionariJuridico.filter(term => {
                const normalizedTerm = term.termino.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const normalizedDesc = term.definicion_corta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return normalizedTerm.includes(searchTerm) || normalizedDesc.includes(searchTerm);
            }).slice(0, 6); // Limitar a los 6 mejores resultados para no romper la UI

            setResults(filtered);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [query]);

    // Navegar seleccionando con teclado
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && results.length > 0) {
            e.preventDefault();
            router.push(`/diccionario/${results[0].letra.toLowerCase()}/${results[0].id}`);
            setIsOpen(false);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            wrapperRef.current?.blur();
        }
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto z-40" ref={wrapperRef}>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className={`w-6 h-6 transition-colors ${query ? 'text-[var(--color-accent)]' : 'text-slate-400 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="w-full bg-[#0f172a]/80 backdrop-blur-md border border-white/10 hover:border-white/20 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/20 text-white rounded-2xl pl-12 pr-4 py-5 text-lg placeholder-slate-400 transition-all shadow-[0_0_20px_rgba(234,179,8,0.05)] focus:shadow-[0_0_30px_rgba(234,179,8,0.15)]"
                    placeholder="Escribe el concepto legal, documento o amparo que buscas..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (query.trim().length > 1) setIsOpen(true); }}
                />
                {/* Accento brillante en el borde al teclear */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity rounded-b-2xl"></div>
            </div>

            {/* Dropdown de Resultados Predictivos */}
            {isOpen && (
                <div className="absolute w-full mt-2 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                    {results.length > 0 ? (
                        <ul className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {results.map((term, idx) => (
                                <li key={term.id}>
                                    <Link
                                        href={`/diccionario/${term.letra.toLowerCase()}/${term.id}`}
                                        className="block p-4 hover:bg-white/5 transition-colors group/item"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 items-center justify-center text-[var(--color-accent)] font-bold group-hover/item:border-[var(--color-accent)]/50 transition-colors">
                                                {term.letra}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-base mb-1 group-hover/item:text-[var(--color-accent)] transition-colors">
                                                    {term.termino}
                                                </h4>
                                                <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 leading-snug">
                                                    {term.definicion_corta}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                            <div className="p-3 bg-black/40 text-center border-t border-white/5">
                                <span className="text-xs text-white/40 flex items-center justify-center gap-2">
                                    Presiona Enter para ir al primer resultado o Esc para cerrar
                                </span>
                            </div>
                        </ul>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="text-4xl mb-3">🧐</div>
                            <p className="text-white font-semibold">Término no encontrado</p>
                            <p className="text-sm text-[var(--color-text-muted)] mt-1">Intenta usar diferentes palabras o consulta el índice alfabético.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
