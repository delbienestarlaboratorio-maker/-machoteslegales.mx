'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArticuloLey } from '@/data/articulos';
import { useRouter } from 'next/navigation';

interface BuscadorArticuloNavProps {
    articulos: ArticuloLey[];
    leyId: string;
    baseUrl?: string;
}

export default function BuscadorArticuloNav({ articulos, leyId, baseUrl = "/leyes/federal" }: BuscadorArticuloNavProps) {
    const [busqueda, setBusqueda] = useState('');
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const terminos = busqueda.toLowerCase().trim();

    const articulosFiltrados = articulos.filter(art => {
        if (!terminos) return false;
        return art.numero.toString().includes(terminos) ||
            art.contenido.toLowerCase().includes(terminos);
    }).slice(0, 10); // Mostrar solo top 10 resultados para no saturar

    // Cerrar al dar clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setMostrarResultados(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && articulosFiltrados.length > 0) {
            router.push(`${baseUrl}/${leyId}/${articulosFiltrados[0].id}`);
            setMostrarResultados(false);
            setBusqueda('');
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto sm:mx-0 z-50" ref={wrapperRef}>
            <div className="relative group">
                <input
                    type="text"
                    placeholder="Saltar a otro artículo (ej. 1916)"
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setMostrarResultados(true);
                    }}
                    onFocus={() => setMostrarResultados(true)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors pl-10 text-sm shadow-inner group-hover:border-white/20"
                />
                <svg className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            {/* Dropdown de Resultados */}
            {mostrarResultados && busqueda.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-emerald-500/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden max-h-80 overflow-y-auto animate-fade-in divide-y divide-white/5">
                    {articulosFiltrados.length > 0 ? (
                        articulosFiltrados.map((art) => (
                            <Link
                                href={`${baseUrl}/${leyId}/${art.id}`}
                                key={art.id}
                                onClick={() => {
                                    setMostrarResultados(false);
                                    setBusqueda('');
                                }}
                                className="block p-3 hover:bg-emerald-500/10 transition-colors"
                            >
                                <div className="text-emerald-400 font-bold text-sm mb-0.5">Artículo {art.numero}</div>
                                <div className="text-white/60 text-xs line-clamp-1 italic">"{art.contenido}"</div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-4 text-center text-white/40 text-sm">
                            No se encontraron artículos con "{busqueda}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
