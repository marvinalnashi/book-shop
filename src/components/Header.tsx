'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function Header() {
    const router = useRouter()
    const path = usePathname()

    return (
        <header className="fixed top-0 w-full bg-white border-b shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push('/')}>📚 Like a Book</h1>
                <div className="space-x-2">
                    <button
                        className={`px-4 py-2 rounded ${path === '/' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => router.push('/')}
                    >
                        Standard
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${path.startsWith('/metaphor') ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => router.push('/metaphor')}
                    >
                        Metaphor
                    </button>
                </div>
            </div>
        </header>
    )
}
