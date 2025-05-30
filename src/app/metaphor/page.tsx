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
    const [currentPage, setCurrentPage] = useState(1)
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortOrder, setSortOrder] = useState<'title' | 'year'>('title')

    const router = useRouter()

    const filteredBooks = useMemo(() => {
        return books
            .filter((b) =>
                b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.author.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) =>
                sortOrder === 'title'
                    ? a.title.localeCompare(b.title)
                    : b.year - a.year
            )
    }, [searchQuery, sortOrder])

    const booksByGenre: Record<string, typeof books> = {}
    GENRES.forEach((genre) => {
        booksByGenre[genre] = filteredBooks.filter((b) => b.category === genre)
    })

    const handleClick = (id: number) => router.push(`/book/${id}`)

    return (
        <div className="px-6 py-24 relative z-10">
            <h2 className="text-2xl font-bold mb-4">All Book Categories</h2>

            <div className="flex flex-wrap items-center gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border px-4 py-2 rounded w-60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="border px-4 py-2 rounded"
                >
                    <option value="title">Sort by Title</option>
                    <option value="year">Sort by Year</option>
                </select>
            </div>

            {GENRES.map((genre) => {
                const visibleBooks = booksByGenre[genre].slice(
                    (currentPage - 1) * ITEMS_PER_PAGE,
                    currentPage * ITEMS_PER_PAGE
                )

                return (
                    <div key={genre} className="overflow-visible">
                        <div className="bookshelf-header">
                            <span className="text-lg font-bold text-white drop-shadow">{genre}</span>
                        </div>

                        <div className="bookshelf-body">
                            <motion.div
                                key={`${genre}-${currentPage}`}
                                initial={{ x: direction === 'forward' ? 300 : -300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: direction === 'forward' ? -300 : 300, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex gap-2 items-end overflow-visible"
                            >
                                {visibleBooks.map((book) => (
                                    <div
                                        key={book.id}
                                        className="relative group cursor-pointer perspective-[1000px] overflow-visible"
                                        onMouseEnter={() => setHoveredBookId(book.id)}
                                        onMouseLeave={() => setHoveredBookId(null)}
                                        onClick={() => handleClick(book.id)}
                                    >
                                        <motion.div
                                            className="transform-style-preserve-3d"
                                            initial={false}
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
                                                    onClick={(e) => e.stopPropagation()}
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
                    </div>
                )
            })}

            <div className="flex justify-center mt-6 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        onClick={() => {
                            setDirection(num > currentPage ? 'forward' : 'backward')
                            setCurrentPage(num)
                        }}
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
