'use client'
import { useState } from 'react'
import Link from 'next/link'

/* ─── Datos LFT 2026 ─── */
const SALARIO_MINIMO_2026 = 315.04       // Art. 90 LFT — vigente 01/01/2026
const SALARIO_MINIMO_FRONTERA = 440.87   // ZLFN 2026

// Art. 76 LFT (Reforma Vacaciones Dignas 2023)
function diasVacaciones(anios: number): number {
    if (anios <= 0) return 0
    if (anios === 1) return 12
    if (anios === 2) return 14
    if (anios === 3) return 16
    if (anios === 4) return 18
    if (anios === 5) return 20
    if (anios <= 10) return 22
    if (anios <= 15) return 24
    if (anios <= 20) return 26
    if (anios <= 25) return 28
    if (anios <= 30) return 30
    return 32
}

type Motivo = 'despido' | 'renuncia'

interface Resultado {
    conceptos: {
        nombre: string
        formula: string
        articulo: string
        monto: number
    }[]
    total: number
}

function calcular(
    salarioDiario: number,
    aniosAntig: number,
    mesesFraccion: number,
    diasFraccionAnio: number,
    motivo: Motivo,
    frontera: boolean,
): Resultado {
    const conceptos: Resultado['conceptos'] = []
    const sdMin = frontera ? SALARIO_MINIMO_FRONTERA : SALARIO_MINIMO_2026
    const aniosCompletos = Math.floor(aniosAntig)
    const fraccionAnio = mesesFraccion / 12

    // ── 1. Indemnización constitucional (solo despido) ──
    if (motivo === 'despido') {
        const monto = salarioDiario * 90
        conceptos.push({
            nombre: '3 meses de salario (indemnización constitucional)',
            formula: `$${salarioDiario.toFixed(2)} × 90 días`,
            articulo: 'Art. 48 LFT',
            monto,
        })
    }

    // ── 2. 20 días por año (solo despido) ──
    if (motivo === 'despido') {
        const monto = salarioDiario * 20 * aniosAntig
        conceptos.push({
            nombre: '20 días por año trabajado',
            formula: `$${salarioDiario.toFixed(2)} × 20 × ${aniosAntig.toFixed(1)} años`,
            articulo: 'Art. 50, Fracción II LFT',
            monto,
        })
    }

    // ── 3. Prima de antigüedad ──
    // 12 días por año, tope doble salario mínimo
    // En despido: siempre se paga
    // En renuncia: solo si 15+ años de antigüedad
    if (motivo === 'despido' || aniosAntig >= 15) {
        const topeDiario = sdMin * 2
        const base = Math.min(salarioDiario, topeDiario)
        const monto = base * 12 * aniosAntig
        conceptos.push({
            nombre: 'Prima de antigüedad (12 días/año)',
            formula: `min($${salarioDiario.toFixed(2)}, $${topeDiario.toFixed(2)} tope) × 12 × ${aniosAntig.toFixed(1)} años`,
            articulo: 'Art. 162 LFT',
            monto,
        })
    }

    // ── 4. Aguinaldo proporcional ──
    const diasAguinaldo = (15 / 365) * diasFraccionAnio
    const montoAguinaldo = salarioDiario * diasAguinaldo
    conceptos.push({
        nombre: 'Aguinaldo proporcional',
        formula: `$${salarioDiario.toFixed(2)} × (15/365) × ${diasFraccionAnio} días trabajados`,
        articulo: 'Art. 87 LFT',
        monto: montoAguinaldo,
    })

    // ── 5. Vacaciones proporcionales ──
    const diasVac = diasVacaciones(aniosCompletos > 0 ? aniosCompletos : 1)
    const vacProporcional = (diasVac / 365) * diasFraccionAnio
    const montoVac = salarioDiario * vacProporcional
    conceptos.push({
        nombre: `Vacaciones proporcionales (${diasVac} días/año)`,
        formula: `$${salarioDiario.toFixed(2)} × (${diasVac}/365) × ${diasFraccionAnio} días`,
        articulo: 'Art. 76 LFT (Reforma 2023)',
        monto: montoVac,
    })

    // ── 6. Prima vacacional ──
    const montoPrimaVac = montoVac * 0.25
    conceptos.push({
        nombre: 'Prima vacacional (25%)',
        formula: `$${montoVac.toFixed(2)} × 25%`,
        articulo: 'Art. 80 LFT',
        monto: montoPrimaVac,
    })

    const total = conceptos.reduce((a, c) => a + c.monto, 0)
    return { conceptos, total }
}

export default function CalculadoraLaboral() {
    const [motivo, setMotivo] = useState<Motivo>('despido')
    const [nombre, setNombre] = useState('Juan Pérez López')
    const [salarioMensual, setSalarioMensual] = useState('15000')
    const [anios, setAnios] = useState('3')
    const [meses, setMeses] = useState('6')
    const [frontera, setFrontera] = useState(false)
    const [resultado, setResultado] = useState<Resultado | null>(null)
    const [showSalarioInfo, setShowSalarioInfo] = useState(false)
    const [showMesesInfo, setShowMesesInfo] = useState(false)

    function handleCalcular() {
        const salMensual = parseFloat(salarioMensual) || 0
        const salDiario = salMensual / 30
        const a = parseFloat(anios) || 0
        const m = parseFloat(meses) || 0
        const aniosTotal = a + m / 12
        const diasFraccion = Math.round(m * 30.4167)
        const res = calcular(salDiario, aniosTotal, m, diasFraccion, motivo, frontera)
        setResultado(res)
    }

    const fmt = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 })

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <nav className="text-sm text-[var(--color-text-muted)] mb-6">
                <Link href="/" className="hover:text-white">Inicio</Link>
                <span className="mx-2">/</span>
                <span className="text-white">Calculadora Laboral</span>
            </nav>

            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-outfit)] text-white leading-tight">
                    Calculadora de Liquidación Laboral
                    <span className="gradient-gold"> México 2026</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)]  max-w-2xl mx-auto">
                    Calcula tu finiquito o liquidación conforme a la Ley Federal del Trabajo vigente.
                    Salario mínimo 2026: <strong className="text-white">${SALARIO_MINIMO_2026}/día</strong> (${SALARIO_MINIMO_FRONTERA} frontera norte).
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-semibold">Actualizada con la Reforma de Vacaciones Dignas 2023 · LFT 2026</span>
                </div>
            </div>

            {/* Ad Slot — después del header */}
            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            {/* Selector motivo */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                    onClick={() => { setMotivo('despido'); setResultado(null) }}
                    className={`py-4 rounded-2xl font-semibold text-sm transition-all border ${motivo === 'despido'
                        ? 'bg-red-500/20 border-red-500/40 text-red-400 shadow-lg shadow-red-500/10'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                >
                    🔴 Me Despidieron
                    <span className="block text-xs font-normal mt-1 opacity-70">Liquidación completa</span>
                </button>
                <button
                    onClick={() => { setMotivo('renuncia'); setResultado(null) }}
                    className={`py-4 rounded-2xl font-semibold text-sm transition-all border ${motivo === 'renuncia'
                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 shadow-lg shadow-blue-500/10'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                >
                    🔵 Renuncié
                    <span className="block text-xs font-normal mt-1 opacity-70">Finiquito</span>
                </button>
            </div>

            {/* Formulario */}
            <div className="glass-card p-6 md:p-8 rounded-2xl mb-8">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    📋 Tus datos laborales
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nombre */}
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            Tu nombre <span className="text-white/30">(opcional)</span>
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Juan Pérez López"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder:text-white/20"
                        />
                    </div>

                    {/* Salario mensual */}
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            Salario mensual bruto (MXN) <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            value={salarioMensual}
                            onChange={(e) => setSalarioMensual(e.target.value)}
                            placeholder="Ej: 15000"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder:text-white/20"
                        />
                        <div className="mt-1">
                            <button
                                type="button"
                                onClick={() => setShowSalarioInfo(!showSalarioInfo)}
                                className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                💡 ¿Cuál es mi salario bruto? ¿Antes o después de deducciones?
                                <span className={`transition-transform ${showSalarioInfo ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {showSalarioInfo && (
                                <div className="mt-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div>
                                        <h4 className="text-white font-bold text-sm mb-1">📌 Resumen rápido</h4>
                                        <p className="text-white/80">
                                            Usa tu <strong className="text-[var(--color-accent)]">salario bruto mensual</strong> — el monto
                                            <strong> ANTES</strong> de que te descuenten IMSS, ISR, Infonavit, etc.
                                            Es el número más grande que aparece en tu recibo de nómina.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                                            <h5 className="text-emerald-400 font-bold mb-1">✅ Salario BRUTO (usa este)</h5>
                                            <p className="text-white/70">Lo que tu patrón pactó pagarte. Incluye:</p>
                                            <ul className="text-white/60 mt-1 space-y-0.5 list-disc pl-4">
                                                <li>Sueldo base mensual</li>
                                                <li>Bonos fijos / comisiones garantizadas</li>
                                                <li>Prestaciones en dinero (vales, ayudas)</li>
                                            </ul>
                                            <p className="text-emerald-400 font-semibold mt-2">Ejemplo: $15,000/mes</p>
                                        </div>
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                            <h5 className="text-red-400 font-bold mb-1">❌ Salario NETO (no uses este)</h5>
                                            <p className="text-white/70">Lo que recibes en tu cuenta. Ya se descontó:</p>
                                            <ul className="text-white/60 mt-1 space-y-0.5 list-disc pl-4">
                                                <li>ISR (Impuesto Sobre la Renta)</li>
                                                <li>Cuota IMSS del trabajador</li>
                                                <li>Crédito Infonavit (si aplica)</li>
                                            </ul>
                                            <p className="text-red-400 font-semibold mt-2">Ejemplo: $13,200/mes</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-3">
                                        <h4 className="text-white font-bold text-sm mb-2">📖 ¿Por qué se usa el salario bruto?</h4>
                                        <p className="text-white/70 leading-relaxed">
                                            La Ley Federal del Trabajo define el <strong className="text-white">salario</strong> en el
                                            <strong className="text-blue-400"> Art. 82 LFT</strong> como: <em>&ldquo;la retribución que
                                                debe pagar el patrón al trabajador por su trabajo&rdquo;</em>. Este es el monto total convenido,
                                            no lo que queda después de impuestos.
                                        </p>
                                        <p className="text-white/70 leading-relaxed mt-2">
                                            El <strong className="text-blue-400">Art. 84 LFT</strong> establece que el salario se integra
                                            con <em>&ldquo;los pagos hechos en efectivo por cuota diaria, gratificaciones, percepciones,
                                                habitación, primas, comisiones, prestaciones en especie y cualquiera otra cantidad o prestación
                                                que se entregue al trabajador por su trabajo&rdquo;</em>.
                                        </p>
                                        <p className="text-white/70 leading-relaxed mt-2">
                                            Todos los cálculos de liquidación, finiquito, indemnización y prima de antigüedad se hacen
                                            sobre el <strong className="text-[var(--color-accent)]">Salario Diario Integrado (SDI)</strong>,
                                            que se obtiene del salario bruto dividido entre 30 días (<strong className="text-blue-400">Art. 89 LFT</strong>).
                                            Las deducciones de IMSS e ISR son obligaciones fiscales del trabajador y no reducen la base de cálculo laboral.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-3">
                                        <h5 className="text-white font-bold mb-1">💰 ¿Cómo saber cuál es mi salario bruto?</h5>
                                        <p className="text-white/70">
                                            Revisa tu <strong className="text-white">recibo de nómina (CFDI de nómina)</strong> — busca el
                                            concepto &ldquo;Sueldo&rdquo; o &ldquo;Percepciones Totales&rdquo;. Si no tienes recibos,
                                            consulta tu contrato individual de trabajo donde se estipula el salario pactado.
                                            También puedes verlo en el portal del IMSS como &ldquo;Salario Base de Cotización&rdquo; × 30 días.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Años */}
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            Años trabajados <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            value={anios}
                            onChange={(e) => setAnios(e.target.value)}
                            placeholder="Ej: 3"
                            min="0"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder:text-white/20"
                        />
                    </div>

                    {/* Meses adicionales */}
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            Meses adicionales
                        </label>
                        <input
                            type="number"
                            value={meses}
                            onChange={(e) => setMeses(e.target.value)}
                            placeholder="Ej: 6"
                            min="0"
                            max="11"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder:text-white/20"
                        />
                        <div className="mt-1">
                            <button
                                type="button"
                                onClick={() => setShowMesesInfo(!showMesesInfo)}
                                className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                💡 ¿Cómo cuento mi antigüedad laboral?
                                <span className={`transition-transform ${showMesesInfo ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {showMesesInfo && (
                                <div className="mt-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div>
                                        <h4 className="text-white font-bold text-sm mb-1">📌 Resumen rápido</h4>
                                        <p className="text-white/80">
                                            Separa tu tiempo trabajado en <strong className="text-[var(--color-accent)]">años completos</strong> y
                                            <strong className="text-[var(--color-accent)]"> meses restantes</strong>. Los meses son importantes
                                            porque determinan tu aguinaldo, vacaciones y prima vacacional proporcionales.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-3">
                                        <h5 className="text-white font-bold mb-2">📝 Ejemplos</h5>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-white/50 w-40">Entré en Enero 2023, salí en Julio 2026:</span>
                                                <span className="text-[var(--color-accent)] font-bold">3 años + 6 meses</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-white/50 w-40">Entré hace 8 meses:</span>
                                                <span className="text-[var(--color-accent)] font-bold">0 años + 8 meses</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-white/50 w-40">Trabajé exactamente 5 años:</span>
                                                <span className="text-[var(--color-accent)] font-bold">5 años + 0 meses</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-3">
                                        <h4 className="text-white font-bold text-sm mb-2">📖 ¿Por qué importan los meses?</h4>
                                        <p className="text-white/70 leading-relaxed">
                                            La <strong className="text-blue-400">Ley Federal del Trabajo (Art. 158 LFT)</strong> define la
                                            antigüedad como el <em>"tiempo de servicios efectivamente prestados"</em>. Cada mes trabajado
                                            genera derechos proporcionales:
                                        </p>
                                        <ul className="text-white/60 mt-2 space-y-1 list-disc pl-4">
                                            <li><strong className="text-white">Aguinaldo proporcional</strong> — Se calcula sobre los días efectivamente trabajados en el año (Art. 87 LFT)</li>
                                            <li><strong className="text-white">Vacaciones proporcionales</strong> — Fracción correspondiente según tu antigüedad total (Art. 76 LFT)</li>
                                            <li><strong className="text-white">Prima de antigüedad</strong> — 12 días por cada año completo de servicios (Art. 162 LFT)</li>
                                            <li><strong className="text-white">20 días por año</strong> — En caso de despido, también se calcula la fracción de año (Art. 50 LFT)</li>
                                        </ul>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-3">
                                        <h5 className="text-white font-bold mb-1">💡 ¿Cómo saber mi fecha de ingreso?</h5>
                                        <p className="text-white/70">
                                            Revisa tu <strong className="text-white">contrato individual de trabajo</strong>, tu
                                            <strong className="text-white"> alta en el IMSS</strong> (en la plataforma IDSE o pide tu
                                            constancia), o tu <strong className="text-white">primer recibo de nómina</strong>.
                                            Si no tienes documentos, puedes solicitar tu historial laboral en la AFORE o en la Subdelegación del IMSS.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Zona frontera */}
                <div className="mt-5 flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={frontera}
                            onChange={(e) => setFrontera(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                    </label>
                    <span className="text-sm text-[var(--color-text-muted)]">
                        Trabajo en la Zona Libre de la Frontera Norte
                    </span>
                </div>

                {/* Botón calcular */}
                <button
                    onClick={handleCalcular}
                    className="w-full mt-8 py-4 rounded-2xl bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-[var(--color-primary-dark)] font-bold text-lg transition-all hover:shadow-lg hover:shadow-[var(--color-accent)]/20"
                >
                    ⚖️ Calcular mi {motivo === 'despido' ? 'Liquidación' : 'Finiquito'}
                </button>
            </div>

            {/* Resultados */}
            {resultado && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header resultado */}
                    <div className="glass-card p-6 rounded-2xl border-[var(--color-accent)]/30 border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white">
                                {motivo === 'despido' ? '📊 Tu Liquidación' : '📊 Tu Finiquito'}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${motivo === 'despido'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                {motivo === 'despido' ? 'DESPIDO INJUSTIFICADO' : 'RENUNCIA VOLUNTARIA'}
                            </span>
                        </div>

                        {nombre && (
                            <p className="text-sm text-[var(--color-text-muted)] mb-4">
                                Cálculo para: <strong className="text-white">{nombre}</strong> · Salario: <strong className="text-white">${parseFloat(salarioMensual).toLocaleString('es-MX')}/mes</strong> · Antigüedad: <strong className="text-white">{anios} años {meses ? `y ${meses} meses` : ''}</strong>
                            </p>
                        )}

                        {/* Tabla de conceptos */}
                        <div className="space-y-3">
                            {resultado.conceptos.map((c, i) => (
                                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-white">{c.nombre}</h3>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-1">{c.formula}</p>
                                            <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                                                📖 {c.articulo}
                                            </span>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="text-lg font-bold text-[var(--color-accent)]">{fmt(c.monto)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="mt-6 p-5 rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-sm text-[var(--color-text-muted)]">
                                        TOTAL APROXIMADO {motivo === 'despido' ? 'DE LIQUIDACIÓN' : 'DE FINIQUITO'}
                                    </span>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                        * Monto bruto antes de ISR. El cálculo final puede variar según prestaciones superiores a la ley.
                                    </p>
                                </div>
                                <span className="text-3xl font-bold text-[var(--color-accent)]">
                                    {fmt(resultado.total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CTA Plantilla */}
                    <div className="glass-card p-6 rounded-2xl border-emerald-500/20 border bg-emerald-500/5">
                        <div className="flex flex-col md:flex-row items-center gap-5">
                            <div className="text-4xl">📄</div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-white font-bold text-lg">¿Necesitas la demanda laboral o carta de renuncia?</h3>
                                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                                    Tenemos plantillas profesionales con fundamento legal y jurisprudencia SCJN.
                                    {motivo === 'despido'
                                        ? ' Demanda por despido injustificado lista para llenar ante la Junta de Conciliación.'
                                        : ' Carta de renuncia voluntaria y solicitud de finiquito conforme a la LFT.'
                                    }
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                                <Link
                                    href="/plantillas/laboral"
                                    className="px-6 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-[var(--color-primary-dark)] font-bold text-sm transition-all text-center"
                                >
                                    Ver Plantillas Laborales →
                                </Link>
                                <span className="text-xs text-center text-[var(--color-text-muted)]">V1 Gratis · V2 desde $79 MXN</span>
                            </div>
                        </div>
                    </div>

                    {/* Info legal */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-4">📖 Fundamento Legal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[var(--color-text-muted)]">
                            <div className="bg-white/5 p-3 rounded-lg">
                                <strong className="text-white">Art. 48 LFT</strong> — Indemnización constitucional de 3 meses de salario por despido injustificado.
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <strong className="text-white">Art. 50, Fr. II LFT</strong> — 20 días de salario por cada año de servicios prestados.
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <strong className="text-white">Art. 76 LFT (Reforma 2023)</strong> — Tabla de vacaciones: 12 días el 1er año, incremento gradual hasta 32 días.
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <strong className="text-white">Art. 80 LFT</strong> — Prima vacacional del 25% sobre salarios del período de vacaciones.
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <strong className="text-white">Art. 87 LFT</strong> — Aguinaldo mínimo de 15 días de salario, pagadero antes del 20 de diciembre.
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <strong className="text-white">Art. 162 LFT</strong> — Prima de antigüedad: 12 días por año, tope 2× salario mínimo. En renuncia solo con 15+ años.
                            </div>
                        </div>
                    </div>

                    {/* Tabla vacaciones */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-4">📅 Tabla de Vacaciones 2026 (Art. 76 LFT)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-2 px-3 text-left text-[var(--color-text-muted)] font-semibold">Antigüedad</th>
                                        <th className="py-2 px-3 text-right text-[var(--color-text-muted)] font-semibold">Días</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['1 año', 12], ['2 años', 14], ['3 años', 16],
                                        ['4 años', 18], ['5 años', 20], ['6-10 años', 22],
                                        ['11-15 años', 24], ['16-20 años', 26], ['21-25 años', 28],
                                        ['26-30 años', 30], ['31-35 años', 32],
                                    ].map(([label, dias]) => {
                                        const aniosNum = parseInt(anios) || 0
                                        const isActive = (
                                            (label === '1 año' && aniosNum === 1) ||
                                            (label === '2 años' && aniosNum === 2) ||
                                            (label === '3 años' && aniosNum === 3) ||
                                            (label === '4 años' && aniosNum === 4) ||
                                            (label === '5 años' && aniosNum === 5) ||
                                            (label === '6-10 años' && aniosNum >= 6 && aniosNum <= 10) ||
                                            (label === '11-15 años' && aniosNum >= 11 && aniosNum <= 15) ||
                                            (label === '16-20 años' && aniosNum >= 16 && aniosNum <= 20) ||
                                            (label === '21-25 años' && aniosNum >= 21 && aniosNum <= 25) ||
                                            (label === '26-30 años' && aniosNum >= 26 && aniosNum <= 30) ||
                                            (label === '31-35 años' && aniosNum >= 31)
                                        )
                                        return (
                                            <tr key={label as string} className={`border-b border-white/5 ${isActive ? 'bg-[var(--color-accent)]/10' : ''}`}>
                                                <td className={`py-2 px-3 ${isActive ? 'text-[var(--color-accent)] font-bold' : 'text-white/80'}`}>
                                                    {isActive && '→ '}{label as string}
                                                </td>
                                                <td className={`py-2 px-3 text-right ${isActive ? 'text-[var(--color-accent)] font-bold' : 'text-white/60'}`}>
                                                    {dias as number} días
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* SEO Content */}
            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">
                    ¿Cuánto me toca de liquidación si me despiden en México?
                </h2>
                <p className="text-[var(--color-text-muted)] text-sm">
                    Si fuiste despedido injustificadamente, conforme a la Ley Federal del Trabajo tienes derecho a recibir
                    una indemnización constitucional de 3 meses de salario (Art. 48 LFT), más 20 días de salario por cada
                    año trabajado (Art. 50 LFT), más prima de antigüedad de 12 días por año (Art. 162 LFT), aguinaldo
                    proporcional (Art. 87 LFT) y vacaciones proporcionales con prima vacacional del 25% (Arts. 76 y 80 LFT).
                    Nuestra calculadora utiliza el salario mínimo 2026 de ${SALARIO_MINIMO_2026} MXN diarios y la tabla
                    de vacaciones actualizada con la reforma de Vacaciones Dignas de 2023.
                </p>
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)] mt-8">
                    ¿Cuánto me toca de finiquito si renuncio?
                </h2>
                <p className="text-[var(--color-text-muted)] text-sm">
                    Al renunciar voluntariamente tienes derecho a tu finiquito, que incluye: aguinaldo proporcional (15 días/año),
                    vacaciones proporcionales según tu antigüedad, prima vacacional del 25%, y si tienes más de 15 años
                    de antigüedad, prima de antigüedad de 12 días por año. El finiquito NO incluye la indemnización
                    constitucional de 3 meses ni los 20 días por año — esos solo aplican en despido injustificado.
                </p>
            </section>

            {/* Ad Slot — después de SEO */}
            <div className="w-full min-h-[90px] mt-8">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            {/* Enlaces a plantillas populares */}
            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Plantillas Laborales Populares</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Demanda por Despido Injustificado', slug: 'demanda-despido-injustificado', desc: 'Demanda laboral completa ante JFCA' },
                        { title: 'Carta de Renuncia Voluntaria', slug: 'carta-renuncia-voluntaria', desc: 'Renuncia formal con solicitud de finiquito' },
                        { title: 'Convenio Laboral', slug: 'convenio-laboral-conciliacion', desc: 'Acuerdo ante la Junta de Conciliación' },
                        { title: 'Demanda Pago de Salarios Caídos', slug: 'demanda-pago-salarios-caidos', desc: 'Reclamo de salarios devengados' },
                        { title: 'Acta de Abandono de Trabajo', slug: 'acta-abandono-trabajo', desc: 'Constancia patronal por ausencia' },
                        { title: 'Solicitud de Reinstalación', slug: 'solicitud-reinstalacion-laboral', desc: 'Petición de reingreso al puesto' },
                    ].map((t) => (
                        <Link
                            key={t.slug}
                            href={`/plantillas/laboral/${t.slug}`}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[var(--color-accent)]/30 transition-all group"
                        >
                            <span className="text-lg flex-shrink-0">📄</span>
                            <div>
                                <p className="text-sm font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors">{t.title}</p>
                                <p className="text-xs text-white/50 mt-0.5">{t.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <Link
                    href="/plantillas/laboral"
                    className="block mt-4 text-center text-sm text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 font-semibold"
                >
                    Ver todas las plantillas laborales →
                </Link>
            </section>

            {/* Ad Slot — final */}
            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
        </main>
    )
}
