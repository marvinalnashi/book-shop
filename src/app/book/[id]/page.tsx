'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { notFound } from 'next/navigation'

interface Book {
    id: number
    title: string
    author: string
    year: number
    genre: string
    language: string
    pages: number
    publisher: string
    origin: string
    price: number
    oldPrice?: number
    description: string
    cover: string
    quantity: number
}

export default function BookPage() {
    const { id } = useParams()
    const router = useRouter()
    const [book, setBook] = useState<Book | null>(null)
    const [qty, setQty] = useState(1)
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description')
    const { addItem } = useCart()

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/books.json')
            const data = await res.json()
            const found = data.find((b: Book) => b.id === Number(id))
            if (!found) return notFound()
            setBook(found)
        }
        fetchData()
    }, [id])

    if (!book) return <div className="text-center py-20 text-gray-500">Loading...</div>

    const handleAddToCart = () => {
        addItem({
            id: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            cover: book.cover,
            quantity: qty,
            stock: book.quantity,
        })
        router.push('/cart')
    }

    return (
        <div className="grid md:grid-cols-2 gap-10 mt-6">
            <div>
                <img src={book.cover} alt={book.title} className="w-full max-h-[600px] object-contain rounded" />
            </div>

            <div>
                <h2 className="text-3xl font-bold">{book.title}</h2>
                <p className="text-lg text-gray-700 mt-2">
                    {book.author} · {book.language} · {book.pages}p · {book.year}
                </p>
                <p className="mt-4 text-gray-700">{book.description}</p>
                <div className="mt-4 text-xl">
                    {book.oldPrice && <span className="line-through text-gray-400 mr-2">€{book.oldPrice}</span>}
                    <span className="font-semibold text-blue-600">€{book.price}</span>
                </div>

                <div className="mt-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                    <div className="flex items-center mt-1 space-x-2">
                        <select
                            id="quantity"
                            name="quantity"
                            className="border rounded px-2 py-1 w-20"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                        >
                            {Array.from({ length: book.quantity }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-500">Available: {book.quantity}</span>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        onClick={handleAddToCart}
                        className="bg-yellow-500 text-white font-bold py-2 px-6 rounded hover:bg-yellow-600"
                    >
                        Add to cart
                    </button>
                    <button className="bg-black text-white font-bold py-2 px-6 rounded hover:bg-gray-800">
                        Buy now
                    </button>
                </div>

                <div className="mt-10">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-6">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`pb-2 font-semibold ${
                                    activeTab === 'description'
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500'
                                }`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`pb-2 font-semibold ${
                                    activeTab === 'reviews'
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500'
                                }`}
                            >
                                Reviews (0)
                            </button>
                        </nav>
                    </div>

                    <div className="mt-4 text-sm text-gray-700">
                        {activeTab === 'description' ? (
                            <div className="space-y-1">
                                <p><strong>Author(s):</strong> {book.author}</p>
                                <p><strong>Publisher:</strong> {book.publisher}</p>
                                <p><strong>Language:</strong> {book.language}</p>
                                <p><strong>Ships From:</strong> {book.origin}</p>
                            </div>
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
