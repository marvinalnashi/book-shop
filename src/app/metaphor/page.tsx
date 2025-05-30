'use client'

import { useEffect, useRef, useState } from 'react'
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

const GENRES = ['Non-fiction', 'Fantasy', 'Thriller']
const ITEMS_PER_PAGE = 25

export default function MetaphorPage() {
    const [hoveredBook, setHoveredBook] = useState<Book | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const router = useRouter()

    const booksByGenre: Record<string, Book[]> = {}
    GENRES.forEach((genre) => {
        booksByGenre[genre] = books.filter((b) => b.category === genre)
    })

    const handleClick = (id: number) => router.push(`/book/${id}`)

    return (
        <div className="space-y-16 py-6">
            <h2 className="text-2xl font-bold">All Book Categories</h2>

            {GENRES.map((genre) => (
                <div key={genre} className="relative space-y-2">
                    <div className="text-xl font-semibold text-gray-800">{genre}</div>

                    <div className="relative bg-cover bg-no-repeat bg-center" style={{ backgroundImage: "url('/Shelf Template_v2.svg')" }}>
                        <div className="flex gap-2 p-4 overflow-x-hidden">
                            {booksByGenre[genre].slice(0, ITEMS_PER_PAGE).map((book) => (
                                <motion.div
                                    key={book.id}
                                    className="relative cursor-pointer"
                                    onMouseEnter={() => setHoveredBook(book)}
                                    onMouseLeave={() => setHoveredBook(null)}
                                    onClick={() => handleClick(book.id)}
                                    initial={{ y: 0 }}
                                    whileHover={{ y: -14 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Image
                                        src={book.spine}
                                        alt={book.title}
                                        width={50}
                                        height={150}
                                        className="transition-transform"
                                    />

                                    <AnimatePresence>
                                        {hoveredBook?.id === book.id && (
                                            <motion.div
                                                className="absolute left-14 top-0 z-20 w-40 rounded bg-white shadow-lg border border-gray-300"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Image
                                                    src={book.cover}
                                                    alt={book.title}
                                                    width={160}
                                                    height={200}
                                                    className="rounded-t"
                                                />
                                                <div className="p-2 text-xs">
                                                    <p className="font-semibold line-clamp-2">{book.title}</p>
                                                    <p className="text-gray-600">{book.author}</p>
                                                    <p className="text-gray-500">{book.year} · {book.genre}</p>
                                                    <div className="text-sm font-bold text-blue-600 mt-1">€{book.price}</div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex justify-center mt-8 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`w-8 h-8 rounded-full ${
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
