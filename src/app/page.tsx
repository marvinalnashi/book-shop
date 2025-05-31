'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function LobbyPage() {
    const router = useRouter()

    useEffect(() => {
        if (!sessionStorage.getItem('sessionId')) {
            sessionStorage.setItem('sessionId', uuidv4())
        }
    }, [])

    const startSession = (mode: 'standard' | 'metaphor') => {
        sessionStorage.setItem('startTime', Date.now().toString())
        sessionStorage.setItem('mode', mode)
        router.push(mode === 'standard' ? '/standard' : '/metaphor')
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-8">
            <h1 className="text-3xl font-bold">Choose Interface</h1>
            <div className="flex gap-6">
                <button onClick={() => startSession('standard')} className="px-6 py-3 bg-blue-600 text-white rounded">Standard Interface</button>
                <button onClick={() => startSession('metaphor')} className="px-6 py-3 bg-green-600 text-white rounded">Metaphor-based Interface</button>
            </div>
        </div>
    )
}
