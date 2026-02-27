'use client'

import { useState, useEffect } from 'react'
import { testimonials, Testimonial } from '@/data/testimonials'

export default function TestimonialsSection() {
    const [displayedTestimonials, setDisplayedTestimonials] = useState<Testimonial[]>([])

    useEffect(() => {
        // Randomize the 50 testimonials and pick 9 to display in a masonry-like grid
        // so it looks fresh and dynamic every time the user loads the page
        const shuffled = [...testimonials].sort(() => 0.5 - Math.random())
        setDisplayedTestimonials(shuffled.slice(0, 9))
    }, [])

    return (
        <section className="py-20 bg-black/20 border-t border-b border-white/5 my-12 relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Más de <span className="text-[var(--color-accent)]">15,000+</span> descargas exitosas
                    </h2>
                    <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto text-lg">
                        Únete a miles de ciudadanos, abogados y empresarios mexicanos que protegen su patrimonio sin pagar honorarios excesivos.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <div className="flex items-center text-[#c9a84c] text-xl">
                            ★★★★★
                        </div>
                        <span className="text-sm font-semibold text-white">4.9/5</span>
                        <span className="text-xs text-[var(--color-text-muted)] ml-1">(542 reseñas verificadas)</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedTestimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-[var(--color-surface-light)] border border-white/5 rounded-2xl p-6 flex flex-col hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-[var(--color-accent)]/20 flex items-center justify-center border border-white/10">
                                        <span className="font-bold text-white/80 text-sm">
                                            {testimonial.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">{testimonial.name}</h4>
                                        <p className="text-[10px] text-[var(--color-text-muted)] tracking-wide uppercase">
                                            {testimonial.role} • {testimonial.specialty}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex text-[#c9a84c] text-xs">
                                    {'★'.repeat(testimonial.rating)}
                                </div>
                            </div>

                            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed flex-1 italic">
                                &quot;{testimonial.content}&quot;
                            </p>

                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    Compra Verificada
                                </span>
                                <span className="text-[10px] text-[var(--color-text-muted)]">
                                    {testimonial.date}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-flex items-center justify-center w-full">
                        <hr className="w-64 h-px my-8 bg-white/10 border-0" />
                        <span className="absolute px-3 font-medium text-white/50 -translate-x-1/2 bg-[var(--color-surface)] left-1/2 text-xs">
                            Mostrando 9 de 542 reseñas recientes
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
