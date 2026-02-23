'use client'

import dynamic from 'next/dynamic'

const LegalWizard = dynamic(() => import('@/components/wizards/LegalWizard'), { ssr: false })

interface Props {
    specialty: string
}

export default function LegalWizardWrapper({ specialty }: Props) {
    return <LegalWizard specialty={specialty} />
}
