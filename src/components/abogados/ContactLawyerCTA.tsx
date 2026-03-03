import Link from 'next/link';
import React from 'react';

export default function ContactLawyerCTA() {
    return (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden my-12 group">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        Red Nacional de Abogados
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-3 font-[family-name:var(--font-outfit)]">
                        ¿Este documento superó tus conocimientos legales?
                    </h3>
                    <p className="text-[var(--color-text-muted)] text-sm md:text-base leading-relaxed max-w-2xl">
                        Un error de redacción puede costarte tu patrimonio. Contacta a un abogado <strong>experto y verificado</strong> en tu estado ahora mismo. Ellos harán el trabajo pesado por ti.
                    </p>
                </div>

                <div className="shrink-0 w-full md:w-auto flex flex-col items-center gap-3">
                    <Link
                        href="/abogados"
                        className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-8 py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_15px_30px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 transform hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Encontrar Especialista
                    </Link>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                        Consulta sin costo oculto
                    </span>
                </div>
            </div>
        </div>
    );
}
