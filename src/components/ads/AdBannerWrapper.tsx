'use client'

import dynamic from 'next/dynamic'

const AdBanner = dynamic(() => import('@/components/ads/AdBanner'), { ssr: false })

interface Props {
    format?: 'horizontal' | 'vertical' | 'rectangle'
}

export default function AdBannerWrapper({ format = 'horizontal' }: Props) {
    return <AdBanner format={format} />
}
