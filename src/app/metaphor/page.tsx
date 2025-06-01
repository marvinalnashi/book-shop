'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import books from '../../../public/books.json'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const GENRES = ['Fantasy', 'Thriller', 'Non-fiction']
const ITEMS_PER_PAGE = 20

export default function MetaphorPage() {
    const [hoveredBookId, setHoveredBookId] = useState<number | null>(null)
    const [sortField, setSortField] = useState<'title' | 'author' | 'year'>('title')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const router = useRouter()

    const sortedBooks = useMemo(() => {
        return [...books].sort((a, b) => {
            let comparison = 0
            if (sortField === 'year') {
                comparison = a.year - b.year
            } else {
                comparison = a[sortField].localeCompare(b[sortField])
            }
            return sortDirection === 'asc' ? comparison : -comparison
        })
    }, [sortField, sortDirection])

    const booksByGenre: Record<string, typeof books> = {}
    GENRES.forEach((genre) => {
        booksByGenre[genre] = sortedBooks.filter((b) => b.category === genre)
    })

    const handleClick = (id: number) => router.push(`/book/${id}`)

    return (
        <div className="px-6 py-24 relative z-10">
            <h2 className="text-2xl font-bold mb-4">All Book Categories</h2>

            <div className="flex flex-wrap items-center gap-4 mb-8">
                <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as any)}
                    className="border px-4 py-2 rounded"
                >
                    <option value="title">Sort by Title</option>
                    <option value="author">Sort by Author</option>
                    <option value="year">Sort by Year</option>
                </select>
                <select
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value as any)}
                    className="border px-4 py-2 rounded"
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            {GENRES.map((genre) => (
                <div key={genre} className="bookshelf-container">
                    <div className="genre-title">{genre}</div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="books-row"
                    >
                        {booksByGenre[genre].slice(0, ITEMS_PER_PAGE).map((book) => (
                            <div
                                key={book.id}
                                className="relative group cursor-pointer overflow-visible"
                                onMouseEnter={() => setHoveredBookId(book.id)}
                                onMouseLeave={() => setHoveredBookId(null)}
                                onClick={() => handleClick(book.id)}
                            >
                                <motion.div
                                    className="transform-style-preserve-3d"
                                    animate={
                                        hoveredBookId === book.id
                                            ? { rotateY: 90, translateZ: 60 }
                                            : { rotateY: 0, translateZ: 0 }
                                    }
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                >
                                    <Image
                                        src={book.spine}
                                        alt={book.title}
                                        width={50}
                                        height={180}
                                        className="h-[180px] w-[50px] object-contain"
                                    />
                                </motion.div>

                                <AnimatePresence>
                                    {hoveredBookId === book.id && (
                                        <motion.div
                                            className="absolute z-50 left-1/2 -translate-x-1/2 -top-[240px] w-48 bg-white border shadow-xl rounded"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.2 }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleClick(book.id)
                                            }}
                                        >
                                            <Image
                                                src={book.cover}
                                                alt={book.title}
                                                width={192}
                                                height={240}
                                                className="w-full h-auto rounded-t"
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
                    </motion.div>
                </div>
            ))}
        </div>
    )
}
