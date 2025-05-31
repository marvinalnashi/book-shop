'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { saveSessionTime } from '@/lib/firebase'

export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart } = useCart()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = subtotal > 50 ? 5 : 0
    const total = subtotal - discount

    const handleCheckout = async () => {
        setLoading(true)
        setTimeout(async () => {
            const sessionId = sessionStorage.getItem('sessionId')
            const startTime = parseInt(sessionStorage.getItem('startTime') || '0', 10)
            const mode = sessionStorage.getItem('mode') as 'standard' | 'metaphor'
            const duration = Date.now() - startTime

            if (sessionId && mode && startTime > 0) {
                await saveSessionTime(sessionId, mode, duration)
            }

            clearCart()
            router.push('/')
        }, 1500)
    }

    return (
        <div className="py-10 space-y-8">
            <h2 className="text-3xl font-bold">Checkout</h2>
            <div className="grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-6">
                    <h3 className="text-xl font-semibold">Cart ({items.length})</h3>
                    {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center border p-4 rounded-lg">
                            <div className="flex gap-4 items-center">
                                <img src={item.cover} className="w-16 h-20 object-cover rounded" />
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-sm text-gray-500">{item.author}</p>
                                    <p className="mt-1 text-gray-700">€{item.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    className="px-2 py-1 border rounded"
                                    onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}
                                >−</button>
                                <span>{item.quantity}</span>
                                <button
                                    className="px-2 py-1 border rounded"
                                    onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.stock))}
                                >+</button>
                            </div>
                            <p className="w-24 text-right font-semibold">
                                €{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <button className="text-red-500" onClick={() => removeItem(item.id)}>🗑</button>
                        </div>
                    ))}
                    <button onClick={() => router.push('/')} className="text-blue-600">← Continue shopping</button>
                </div>

                <div className="border rounded-lg p-6 space-y-4 shadow-md">
                    <h4 className="text-lg font-semibold">Order summary</h4>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Discount</span>
                        <span>-€{discount.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-green-600">€{total.toFixed(2)}</span>
                    </div>
                    <button
                        className="w-full bg-black text-white py-2 rounded mt-4 hover:bg-gray-800"
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Check Out'}
                    </button>
                </div>
            </div>
        </div>
    )
}
