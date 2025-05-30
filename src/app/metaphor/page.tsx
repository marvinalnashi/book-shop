'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import books from '../../../public/books.json'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Book {
    id: number
    title: string
    author: string
    year: number
    genre: string
    category: string
    price: number
    oldPrice?: number
    cover: string
    spine: string
}

const GENRES = ['Fantasy', 'Thriller', 'Non-fiction']
const ITEMS_PER_PAGE = 20

export default function MetaphorPage() {
    const [hoveredBookId, setHoveredBookId] = useState<number | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const router = useRouter()

    const booksByGenre: Record<string, Book[]> = {}
    GENRES.forEach((genre) => {
        booksByGenre[genre] = books.filter((b) => b.category === genre)
    })

    const handleClick = (id: number) => router.push(`/book/${id}`)

    return (
        <div className="space-y-12 px-6 py-8">
            <h2 className="text-2xl font-bold">All Book Categories</h2>

            {GENRES.map((genre) => (
                <div key={genre} className="relative space-y-2">
                    <div className="text-xl font-semibold text-gray-800">{genre}</div>

                    <div
                        className="relative bg-cover bg-no-repeat bg-center py-6 px-4"
                        style={{ backgroundImage: "url('/Shelf Template_v2.svg')" }}
                    >
                        <div className="flex gap-2 items-end">
                            {booksByGenre[genre]
                                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                                .map((book) => (
                                    <div
                                        key={book.id}
                                        className="relative group cursor-pointer"
                                        onMouseEnter={() => setHoveredBookId(book.id)}
                                        onMouseLeave={() => setHoveredBookId(null)}
                                        onClick={() => handleClick(book.id)}
                                    >
                                        <Image
                                            src={book.spine}
                                            alt={book.title}
                                            width={50}
                                            height={180}
                                            className="h-[180px] object-contain transition-transform group-hover:-translate-y-2"
                                        />

                                        <AnimatePresence>
                                            {hoveredBookId === book.id && (
                                                <motion.div
                                                    className="absolute -top-[230px] -left-16 w-44 z-50 bg-white rounded shadow-xl border"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Image
                                                        src={book.cover}
                                                        alt={book.title}
                                                        width={176}
                                                        height={200}
                                                        className="w-full rounded-t"
                                                    />
                                                    <div className="p-2 text-xs">
                                                        <p className="font-semibold">{book.title}</p>
                                                        <p className="text-gray-600">{book.author}</p>
                                                        <p className="text-gray-500">
                                                            {book.year} · {book.genre}
                                                        </p>
                                                        <div className="text-sm font-bold text-blue-600 mt-1">
                                                            €{book.price}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex justify-center mt-6 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`w-8 h-8 rounded-full text-sm ${
                            currentPage === num ? 'bg-black text-white' : 'bg-gray-300 text-black'
                        }`}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    )
}
