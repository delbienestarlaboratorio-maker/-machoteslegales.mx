'use client'

import dynamic from 'next/dynamic'

const LaboralCalculator = dynamic(() => import('@/components/calculators/LaboralCalculator'), { ssr: false })

interface Props {
    tier: 'v1' | 'v2' | 'v3'
}

export default function LaboralCalculatorSlugWrapper({ tier }: Props) {
    return <LaboralCalculator tier={tier} />
}
