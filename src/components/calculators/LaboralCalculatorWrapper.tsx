'use client'

import dynamic from 'next/dynamic'

const LaboralCalculator = dynamic(() => import('@/components/calculators/LaboralCalculator'), { ssr: false })

export default function LaboralCalculatorWrapper() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded text-xs font-semibold font-[family-name:var(--font-outfit)] bg-green-500/20 text-green-400">
                    HERRAMIENTA GRATUITA
                </span>
                <div className="h-px flex-1 bg-white/10" />
            </div>
            <LaboralCalculator tier="v1" />
        </div>
    )
}
