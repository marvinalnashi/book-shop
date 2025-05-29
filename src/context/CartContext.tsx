'use client'

import { createContext, useContext, useEffect, useState } from 'react'

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
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within CartProvider')
    return context
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([])

    useEffect(() => {
        const stored = localStorage.getItem('cart')
        if (stored) setItems(JSON.parse(stored))
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

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}
