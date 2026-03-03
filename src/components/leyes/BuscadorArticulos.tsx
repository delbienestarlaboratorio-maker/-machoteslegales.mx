'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArticuloLey } from '@/data/articulos';

interface BuscadorArticulosProps {
    articulos: ArticuloLey[];
    leyId: string;
    baseUrl?: string;
}

export default function BuscadorArticulos({ articulos, leyId, baseUrl = "/leyes/federal" }: BuscadorArticulosProps) {
    const [busqueda, setBusqueda] = useState('');

    const terminos = busqueda.toLowerCase().trim();
    const articulosFiltrados = articulos.filter(art => {
        if (!terminos) return true;
        return art.numero.toString().includes(terminos) ||
            art.contenido.toLowerCase().includes(terminos);
    });

    return (
        <div>
            {/* Motor de Búsqueda Activo */}
            <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 mb-12 shadow-inner">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Buscar Artículo en esta Ley
                </h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Ej. '123' o palabras clave como 'Herencias', 'Pensión'..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors pl-12"
                    />
                    <svg className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            {/* Índice Explorador de Artículos */}
            <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-2 font-[family-name:var(--font-outfit)]">
                            Índice de Artículos
                        </h3>
                        <p className="text-[var(--color-text-muted)]">
                            Lee artículo por artículo con Análisis y Jurisprudencias. Mostrando {articulosFiltrados.length} resultados.
                        </p>
                    </div>
                </div>

                {articulosFiltrados.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {articulosFiltrados.map((art) => (
                            <Link href={`${baseUrl}/${leyId}/${art.id}`} key={art.id} className="group flex flex-col justify-center items-center p-4 bg-slate-900/50 border border-white/5 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all font-bold text-white cursor-pointer relative overflow-hidden">
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                <span className="text-xs text-white/40 group-hover:text-emerald-400 mb-1 transition-colors">Artículo</span>
                                <span className="text-xl group-hover:text-emerald-300 transition-colors truncate max-w-full px-2">{art.numero}</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-white/5 p-8 rounded-2xl text-center text-white/50">
                        No se encontraron artículos con esos términos en esta ley.
                    </div>
                )}
            </div>
        </div>
    );
}
