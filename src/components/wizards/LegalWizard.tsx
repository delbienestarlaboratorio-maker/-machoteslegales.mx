'use client'

import { useState } from 'react'

export interface WizardOption {
    label: string
    description?: string
    icon?: string
    /** Si tiene next, continúa el cuestionario */
    next?: WizardStep
    /** Si tiene link, navega al template */
    link?: string
    /** Tier sugerido */
    tier?: 'v1' | 'v2' | 'v3'
}

export interface WizardStep {
    question: string
    subtitle?: string
    options: WizardOption[]
}

// ═════════════════════════════════════
//  CONFIGURACIONES POR MATERIA
// ═════════════════════════════════════

export const WIZARD_CONFIGS: Record<string, WizardStep> = {
    amparo: {
        question: '¿Qué tipo de amparo necesitas?',
        subtitle: 'Selecciona el tipo para personalizar tu plantilla',
        options: [
            {
                label: 'Amparo Indirecto', icon: '🛡️', description: 'Contra actos de autoridades que no sean sentencias definitivas',
                next: {
                    question: '¿Contra qué materia de autoridad?',
                    options: [
                        {
                            label: 'Administrativa', icon: '🏛️', description: 'SAT, INM, IMSS, Municipios, etc.',
                            next: {
                                question: '¿Es por alguno de estos actos?',
                                options: [
                                    { label: 'Crédito fiscal / Embargo', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                                    { label: 'Negativa de trámite', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                                    { label: 'Multa o sanción', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                                    { label: 'Otro acto administrativo', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                                ],
                            },
                        },
                        {
                            label: 'Penal', icon: '⚖️', description: 'Auto de vinculación, orden de aprehensión, etc.',
                            next: {
                                question: '¿Es por alguno de estos delitos?',
                                subtitle: 'Selecciona el delito más cercano a tu caso',
                                options: [
                                    { label: 'Robo', icon: '🔓', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                                    { label: 'Fraude', icon: '💰', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                                    { label: 'Lesiones', icon: '🩹', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                                    { label: 'Abuso de confianza', icon: '🤝', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                                    { label: 'Amenazas', icon: '⚠️', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                                    { label: 'Homicidio', icon: '⚰️', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                                    { label: 'Otro delito', icon: '📋', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                                ],
                            },
                        },
                        { label: 'Laboral', icon: '💼', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                        { label: 'Civil / Familiar', icon: '👨‍👩‍👧', link: '/plantillas/amparo/demanda-amparo-indirecto-completa', tier: 'v2' },
                    ],
                },
            },
            {
                label: 'Amparo Directo', icon: '📜', description: 'Contra sentencias definitivas o laudos',
                link: '/plantillas/amparo/demanda-amparo-directo', tier: 'v1',
            },
        ],
    },

    familiar: {
        question: '¿Qué trámite de Derecho Familiar necesitas?',
        subtitle: 'Elige el procedimiento para guiarte a la plantilla correcta',
        options: [
            {
                label: 'Divorcio', icon: '💔',
                next: {
                    question: '¿Qué tipo de divorcio?',
                    options: [
                        {
                            label: 'Divorcio Incausado (sin causa)', description: 'No requiere acreditar causa, solo la voluntad de una parte',
                            next: {
                                question: '¿Hay hijos menores de edad?',
                                options: [
                                    { label: 'Sí, hay hijos menores', link: '/plantillas/familiar/divorcio-incausado-con-hijos', tier: 'v2' },
                                    { label: 'No hay hijos menores', link: '/plantillas/familiar/divorcio-incausado', tier: 'v2' },
                                ],
                            },
                        },
                        { label: 'Divorcio Administrativo', description: 'Ante el registro civil, sin hijos y de mutuo acuerdo', link: '/plantillas/familiar/divorcio-administrativo', tier: 'v1' },
                        { label: 'Divorcio Voluntario Judicial', description: 'De mutuo acuerdo ante juez', link: '/plantillas/familiar/divorcio-voluntario', tier: 'v1' },
                    ],
                },
            },
            {
                label: 'Pensión Alimenticia', icon: '🍽️',
                next: {
                    question: '¿Qué necesitas sobre pensión alimenticia?',
                    options: [
                        { label: 'Demanda de pensión alimenticia', link: '/plantillas/familiar/demanda-pension-alimenticia', tier: 'v1' },
                        { label: 'Aumento de pensión', link: '/plantillas/familiar/incidente-aumento-pension-alimenticia', tier: 'v1' },
                        { label: 'Reducción de pensión', link: '/plantillas/familiar/reduccion-pension', tier: 'v2' },
                    ],
                },
            },
            { label: 'Custodia y Guarda', icon: '👧', link: '/plantillas/familiar/custodia-menores', tier: 'v2' },
            { label: 'Adopción', icon: '🤱', link: '/plantillas/familiar/solicitud-adopcion', tier: 'v2' },
        ],
    },

    civil: {
        question: '¿Qué tipo de documento civil necesitas?',
        options: [
            {
                label: 'Demanda Civil', icon: '📋',
                next: {
                    question: '¿En qué etapa procesal te encuentras?',
                    options: [
                        { label: 'Demanda inicial', description: 'Primer escrito ante el juzgado', link: '/plantillas/civil/demanda-civil-inicial', tier: 'v1' },
                        { label: 'Contestación de demanda', description: 'Responder a una demanda recibida', link: '/plantillas/civil/contestacion-demanda', tier: 'v2' },
                        { label: 'Ofrecimiento de pruebas', description: 'Etapa probatoria', link: '/plantillas/civil/ofrecimiento-pruebas', tier: 'v2' },
                        { label: 'Alegatos', description: 'Etapa de cierre', link: '/plantillas/civil/alegatos', tier: 'v2' },
                    ],
                },
            },
            { label: 'Contrato de Arrendamiento', icon: '🏠', link: '/plantillas/civil/contrato-arrendamiento', tier: 'v1' },
            { label: 'Poder General (Pleitos y Cobranzas)', icon: '📝', link: '/plantillas/civil/poder-general-pleitos-cobranzas', tier: 'v1' },
            { label: 'Contrato de Compraventa', icon: '💰', link: '/plantillas/civil/contrato-compraventa', tier: 'v1' },
        ],
    },

    penal: {
        question: '¿Qué documento penal necesitas?',
        subtitle: 'Selecciona la acción legal que quieres iniciar',
        options: [
            {
                label: 'Denuncia / Querella', icon: '📢',
                next: {
                    question: '¿Por qué delito?',
                    subtitle: 'Selecciona el delito más cercano a tu caso para obtener la plantilla específica',
                    options: [
                        { label: 'Robo', icon: '🔓', link: '/plantillas/penal/denuncia-robo', tier: 'v1' },
                        { label: 'Fraude', icon: '💰', link: '/plantillas/penal/querella-fraude', tier: 'v1' },
                        { label: 'Amenazas', icon: '⚠️', link: '/plantillas/penal/querella-amenazas', tier: 'v1' },
                        { label: 'Abuso de confianza', icon: '🤝', link: '/plantillas/penal/querella-abuso-confianza', tier: 'v2' },
                        { label: 'Lesiones', icon: '🩹', link: '/plantillas/penal/denuncia-lesiones', tier: 'v2' },
                        { label: 'Violencia familiar', icon: '🏠', link: '/plantillas/penal/denuncia-violencia-familiar', tier: 'v2' },
                        { label: 'Daño en propiedad ajena', icon: '🏚️', link: '/plantillas/penal/denuncia-dano-propiedad', tier: 'v1' },
                        { label: 'Otro delito', icon: '📋', link: '/plantillas/penal/querella-generica', tier: 'v2' },
                    ],
                },
            },
            { label: 'Acuerdo reparatorio', icon: '🤝', link: '/plantillas/penal/acuerdo-reparatorio', tier: 'v2' },
            { label: 'Procedimiento abreviado', icon: '⚡', link: '/plantillas/penal/solicitud-procedimiento-abreviado', tier: 'v1' },
            { label: 'Solicitud de reparación del daño', icon: '💰', link: '/plantillas/penal/solicitud-reparacion-dano', tier: 'v2' },
        ],
    },

    laboral: {
        question: '¿Qué necesitas en materia laboral?',
        options: [
            {
                label: 'Demanda laboral', icon: '📋',
                next: {
                    question: '¿Cuál es el motivo de la demanda?',
                    options: [
                        { label: 'Despido injustificado', icon: '❌', link: '/plantillas/laboral/demanda-despido-injustificado', tier: 'v1' },
                        { label: 'Falta de pago de salarios', icon: '💵', link: '/plantillas/laboral/demanda-pago-salarios', tier: 'v2' },
                        { label: 'Reinstalación', icon: '🔄', link: '/plantillas/laboral/demanda-reinstalacion', tier: 'v2' },
                        { label: 'Rescisión por culpa del patrón', icon: '🚪', link: '/plantillas/laboral/demanda-rescision', tier: 'v2' },
                    ],
                },
            },
            { label: 'Carta Finiquito', icon: '📄', link: '/plantillas/laboral/carta-finiquito', tier: 'v1' },
            { label: 'Convenio de Terminación', icon: '🤝', link: '/plantillas/laboral/convenio-terminacion-laboral', tier: 'v1' },
            { label: 'Conciliación Prejudicial', icon: '⚖️', link: '/plantillas/laboral/solicitud-conciliacion-prejudicial', tier: 'v1' },
        ],
    },

    mercantil: {
        question: '¿Qué documento mercantil necesitas?',
        options: [
            { label: 'Demanda Ejecutiva Mercantil', icon: '⚡', link: '/plantillas/mercantil/demanda-ejecutiva-mercantil', tier: 'v1' },
            { label: 'Pagaré', icon: '📃', link: '/plantillas/mercantil/pagare', tier: 'v1' },
            { label: 'Acta Constitutiva (SA de CV)', icon: '🏢', link: '/plantillas/mercantil/acta-constitutiva-sa-cv', tier: 'v1' },
            { label: 'Asamblea General Ordinaria', icon: '👥', link: '/plantillas/mercantil/acta-asamblea-ordinaria', tier: 'v2' },
        ],
    },

    fiscal: {
        question: '¿Qué trámite fiscal necesitas?',
        options: [
            { label: 'Amparo contra el SAT', icon: '🛡️', link: '/plantillas/fiscal/amparo-contra-sat', tier: 'v1' },
            { label: 'Compensación de impuestos', icon: '💰', link: '/plantillas/fiscal/solicitud-compensacion-impuestos', tier: 'v1' },
            { label: 'Recurso de revocación fiscal', icon: '📋', link: '/plantillas/fiscal/recurso-revocacion', tier: 'v2' },
            { label: 'Condonación de multas', icon: '✅', link: '/plantillas/fiscal/solicitud-condonacion-multas', tier: 'v2' },
        ],
    },
}

interface LegalWizardProps {
    specialty: string
}

export default function LegalWizard({ specialty }: LegalWizardProps) {
    const rootStep = WIZARD_CONFIGS[specialty]
    const [history, setHistory] = useState<WizardStep[]>([])
    const currentStep = history.length > 0 ? history[history.length - 1] : rootStep

    if (!rootStep) return null

    function handleSelect(opt: WizardOption) {
        if (opt.next) {
            setHistory([...history, opt.next])
        } else if (opt.link) {
            window.location.href = opt.link
        }
    }

    function goBack() {
        setHistory(history.slice(0, -1))
    }

    const tierBadge = (tier?: string) => {
        if (!tier) return null
        const styles: Record<string, { bg: string; text: string; label: string }> = {
            v1: { bg: 'rgba(255,255,255,0.1)', text: '#e2e8f0', label: 'Gratis' },
            v2: { bg: 'rgba(201,168,76,0.2)', text: '#c9a84c', label: '$79' },
            v3: { bg: 'rgba(147,130,220,0.2)', text: '#a78bfa', label: 'PRO' },
        }
        const s = styles[tier] ?? styles.v1
        return (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0" style={{ background: s.bg, color: s.text }}>
                {tier.toUpperCase()} {s.label}
            </span>
        )
    }

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold font-[family-name:var(--font-outfit)] text-white">
                    🧭 Asistente Legal
                </h3>
                <span className="text-xs font-bold px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                    INTERACTIVO
                </span>
            </div>

            {history.length > 0 && (
                <button
                    onClick={goBack}
                    className="text-xs text-[var(--color-accent)] hover:underline mb-4 flex items-center gap-1"
                >
                    ← Regresar
                </button>
            )}

            <p className="text-white font-semibold mb-1">{currentStep?.question}</p>
            {currentStep?.subtitle && (
                <p className="text-xs text-[var(--color-text-muted)] mb-4">{currentStep.subtitle}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {currentStep?.options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleSelect(opt)}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--color-surface-light)] border border-white/5 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-light)]/80 text-left transition-all group"
                    >
                        {opt.icon && <span className="text-xl flex-shrink-0">{opt.icon}</span>}
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white group-hover:text-[var(--color-accent)] transition-colors">
                                {opt.label}
                            </div>
                            {opt.description && (
                                <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5 line-clamp-2">{opt.description}</div>
                            )}
                        </div>
                        {tierBadge(opt.tier)}
                        {opt.next && <span className="text-xs text-[var(--color-text-muted)]">→</span>}
                    </button>
                ))}
            </div>
        </div>
    )
}
