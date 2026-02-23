export default function PreciosPage() {
    return (
        <main className="min-h-screen pb-20">
            {/* Header */}
            <div className="gradient-bg py-20 text-center border-b border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-outfit)] leading-tight">
                        Invierte en la <span className="gradient-gold">Eficacia Correcta</span>
                    </h1>
                    <p className="mt-6 text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
                        No arriesgues tu dinero o libertad con formatos viejos de internet. Elige el nivel de protección legal que tu asunto requiere hoy en 2026.
                    </p>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* V1 Gratis */}
                    <div className="glass-card p-8 rounded-3xl flex flex-col">
                        <div className="text-sm font-semibold text-green-400 mb-2">PARA ESTUDIANTES O ASUNTOS SIMPLES</div>
                        <h3 className="text-3xl font-bold text-white mt-2">V1 Nivel Básico</h3>
                        <div className="mt-6 mb-8">
                            <span className="text-5xl font-bold text-white">$0</span>
                            <span className="text-[var(--color-text-muted)] ml-2">por siempre</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-sm text-[var(--color-text-muted)]">
                            <li className="flex gap-3"><span className="text-green-400">✓</span> Formato funcional de llenado en blanco</li>
                            <li className="flex gap-3"><span className="text-green-400">✓</span> Enlaces a los artículos de ley vigentes</li>
                            <li className="flex gap-3"><span className="text-green-400">✓</span> Descarga PDF ilimitada (Con marca de agua)</li>
                            <li className="flex gap-3"><span className="text-red-400 opacity-60">✗</span> Sin jurisprudencia de la SCJN integrada</li>
                            <li className="flex gap-3"><span className="text-red-400 opacity-60">✗</span> Sin cláusulas blindadas ante crisis</li>
                        </ul>
                        <a href="/plantillas" className="w-full text-center py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
                            Explorar Catálogo Gratis
                        </a>
                    </div>

                    {/* V2 Negocios */}
                    <div className="glass-card p-8 rounded-3xl flex flex-col border-[var(--color-accent)]/50 relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(234,179,8,0.15)] glow-hover">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-[var(--color-accent)] text-[var(--color-primary-dark)] text-sm font-bold shadow-lg">
                            RECOMENDADO POR DESPACHOS
                        </div>
                        <div className="text-sm font-semibold text-[var(--color-accent)] mb-2 mt-2">EL FAVORITO DE LOS PROFESIONISTAS</div>
                        <h3 className="text-3xl font-bold text-white mt-2">V2 Negocios</h3>
                        <div className="mt-6 mb-8">
                            <span className="text-5xl font-bold text-white">$79</span>
                            <span className="text-[var(--color-text-muted)] ml-2">MXN / por plantilla</span>
                            <p className="text-xs text-[var(--color-text-muted)] mt-2">Pago único. Licencia de uso de por vida.</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-sm text-white">
                            <li className="flex gap-3"><span className="text-[var(--color-accent)]">✓</span> <b>Fundamentación Premium:</b> Argumentos robustos listos para el juez</li>
                            <li className="flex gap-3"><span className="text-[var(--color-accent)]">✓</span> <b>Jurisprudencia de la SCJN:</b> Entre 3 y 5 tesis de alto impacto citadas</li>
                            <li className="flex gap-3"><span className="text-[var(--color-accent)]">✓</span> <b>Calculadoras Avanzadas:</b> Liquidaciones, intereses y recargos directos</li>
                            <li className="flex gap-3"><span className="text-[var(--color-accent)]">✓</span> <b>Cláusulas Blindadas:</b> Protección anti-fraude, extinción de dominio, etc.</li>
                            <li className="flex gap-3"><span className="text-[var(--color-accent)]">✓</span> PDF limpio profesional <b>sin marca de agua</b></li>
                        </ul>
                        <a href="/plantillas" className="w-full text-center py-4 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary-dark)] font-bold hover:bg-[var(--color-accent-light)] transition-all shadow-xl shadow-[var(--color-accent)]/20">
                            Buscar el Machote que Necesito
                        </a>
                    </div>

                    {/* V3 Elite */}
                    <div className="glass-card p-8 rounded-3xl flex flex-col border-purple-500/30 glow-hover">
                        <div className="text-sm font-semibold text-purple-400 mb-2">PARA ABOGADOS Y EMPRESAS</div>
                        <h3 className="text-3xl font-bold text-white mt-2">V3 Elite (Tilde IA)</h3>
                        <div className="mt-6 mb-8">
                            <span className="text-5xl font-bold text-white">$499</span>
                            <span className="text-[var(--color-text-muted)] ml-2">MXN / por mes</span>
                            <p className="text-xs text-[var(--color-text-muted)] mt-2">Acceso completo a Inteligencia Artificial</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-sm text-[var(--color-text-muted)]">
                            <li className="flex gap-3"><span className="text-purple-400">✓</span> Acceso ilimitado a **Todas las Plantillas V2** sin cobros extra</li>
                            <li className="flex gap-3"><span className="text-purple-400">✓</span> <b>Wizards Inteligentes:</b> Contesta un quiz interactivo y la IA hace el documento</li>
                            <li className="flex gap-3"><span className="text-purple-400">✓</span> <b>Autollenado Predictivo IA:</b> Redacción de peritajes y agravios con Deep Learning</li>
                            <li className="flex gap-3"><span className="text-purple-400">✓</span> Descarga 100% Personalizada con <b>el Logo de tu Despacho</b></li>
                            <li className="flex gap-3"><span className="text-purple-400">✓</span> Selección y actualización de Jurisprudencias automatizado</li>
                        </ul>
                        <a href="/auth/login" className="w-full text-center py-4 rounded-xl block border border-purple-500 bg-purple-500/10 text-purple-300 font-bold hover:bg-purple-500/20 transition-all">
                            Adquirir Suscripción Elite
                        </a>
                    </div>

                </div>
            </div>

            {/* QA Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <h2 className="text-3xl font-bold text-white text-center mb-10 font-[family-name:var(--font-outfit)]">Preguntas Frecuentes de Pagos</h2>
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h4 className="text-lg font-bold text-white">¿Si compro una V2 de $79 es por mes o uso único?</h4>
                        <p className="mt-2 text-sm text-[var(--color-text-muted)]">Es de por vida. Al pagar tus 79 pesos, la plantilla V2 Premium se guarda para siempre en tu panel privado. Puedes utilizarla infinitas veces e imprimir cien copias si lo deseas sin cobros extra.</p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl">
                        <h4 className="text-lg font-bold text-white">¿Es seguro pagar con mi tarjeta?</h4>
                        <p className="mt-2 text-sm text-[var(--color-text-muted)]">Totalmente. No guardamos información financiera. Toda transacción (Débito, Crédito, Meses sin Intereses) se procesa bajo el blindaje y la seguridad total de la pasarela oficial de <b>Clip</b> y cuenta con protocolo SSL/HTTPS cifrado de grado bancario.</p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl">
                        <h4 className="text-lg font-bold text-white">¿Dan Factura (CFDI 4.0)?</h4>
                        <p className="mt-2 text-sm text-[var(--color-text-muted)]">Sí. Al concluir tu suscripción V3 o tu pago individual V2, dentro de tu panel encontrarás el botón automático de Facturación Constante con conceptos del SAT acordes a servicios digitales.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
