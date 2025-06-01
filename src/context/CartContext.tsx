'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface CartItem {
    id: number
    title: string
    author: string
    price: number
    cover: string
    quantity: number
    stock: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: number) => void
    updateQuantity: (id: number, quantity: number) => void
    clearCart: () => void
    cartCount: number
    startNewSession: () => void
    sessionId: string
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within CartProvider')
    return context
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([])
    const [sessionId, setSessionId] = useState<string>('')

    useEffect(() => {
        const storedCart = localStorage.getItem('cart')
        if (storedCart) setItems(JSON.parse(storedCart))

        const storedSession = sessionStorage.getItem('sessionId')
        if (storedSession) {
            setSessionId(storedSession)
        } else {
            const newSession = uuidv4()
            setSessionId(newSession)
            sessionStorage.setItem('sessionId', newSession)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items])

    const addItem = (item: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                )
            }
            return [...prev, item]
        })
    }

    const removeItem = (id: number) => {
        setItems(prev => prev.filter(i => i.id !== id))
    }

    const updateQuantity = (id: number, quantity: number) => {
        setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)))
    }

    const clearCart = () => setItems([])

    const startNewSession = () => {
        const newSession = uuidv4()
        sessionStorage.setItem('sessionId', newSession)
        setSessionId(newSession)
        location.reload()
    }

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            cartCount,
            startNewSession,
            sessionId
        }}>
            {children}
        </CartContext.Provider>
    )
}
