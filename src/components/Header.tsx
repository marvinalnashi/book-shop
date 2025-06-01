'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
    const pathname = usePathname()
    const { cartCount, startNewSession, sessionId } = useCart()
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [enteredPassword, setEnteredPassword] = useState('')
    const [passwordAccepted, setPasswordAccepted] = useState(false)

    const [showFinishModal, setShowFinishModal] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(sessionId || '')
        setCopied(true)
    }

    return (
        <header className="bg-white shadow-md mb-6 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2">
                <img
                    src="/logo.png"
                    alt="Website logo"
                    className="h-10 w-auto object-contain"
                />
            </Link>


            <nav className="flex items-center gap-4">
                <Link href="/cart" className="relative">
                    🛒
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cartCount}
            </span>
                    )}
                </Link>

                <button
                    onClick={() => setShowPasswordModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Start New Session
                </button>

                <button
                    onClick={() => setShowFinishModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Finish
                </button>
            </nav>

            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-lg font-semibold mb-4">Enter Admin Password</h2>
                        <input
                            type="password"
                            value={enteredPassword}
                            onChange={(e) => {
                                setEnteredPassword(e.target.value)
                                if (e.target.value === '1234') setPasswordAccepted(true)
                                else setPasswordAccepted(false)
                            }}
                            placeholder="Password"
                            className="border px-3 py-2 w-full rounded mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="bg-gray-200 px-3 py-2 rounded"
                            >
                                Cancel
                            </button>
                            {passwordAccepted && (
                                <button
                                    onClick={() => {
                                        startNewSession()
                                        setShowPasswordModal(false)
                                        setEnteredPassword('')
                                        setPasswordAccepted(false)
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                                >
                                    Proceed
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showFinishModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-lg font-semibold mb-4">Session Completed</h2>
                        <p className="mb-2">
                            Your User ID (Session ID):
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm break-all">{sessionId}</code>
                            <button
                                onClick={handleCopy}
                                className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 text-sm"
                            >
                                Copy
                            </button>
                        </div>
                        {copied && (
                            <a
                                href="https://survey.uu.nl/jfe/form/SV_cGwEXdRDbNGfYKG"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded block text-center"
                            >
                                Go to Survey
                            </a>
                        )}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowFinishModal(false)}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
