'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useEffect, useState } from 'react'

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const { items } = useCart()
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    const [activeTab, setActiveTab] = useState<'standard' | 'metaphor'>('standard')

    useEffect(() => {
        if (pathname.startsWith('/metaphor')) setActiveTab('metaphor')
        else setActiveTab('standard')
    }, [pathname])

    const switchInterface = (type: 'standard' | 'metaphor') => {
        setActiveTab(type)
        router.push(type === 'standard' ? '/' : '/metaphor')
    }

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow z-50">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    📚 <span>Like a Book</span>
                </Link>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            sessionStorage.clear()
                            location.reload()
                        }}
                        className="px-4 py-1 text-sm border border-gray-500 rounded hover:bg-gray-100"
                    >
                        Start New Session
                    </button>
                    <Link href="/cart" className="relative flex items-center gap-1 font-semibold text-gray-800">
                        🛒 Cart
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    )
}
