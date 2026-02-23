'use client'

import dynamic from 'next/dynamic'

const SearchBar = dynamic(() => import('@/components/SearchBar'), { ssr: false })

interface Props {
    variant?: 'hero' | 'nav' | 'page'
    placeholder?: string
}

export default function SearchBarWrapper({ variant = 'page', placeholder }: Props) {
    return <SearchBar variant={variant} placeholder={placeholder} />
}
