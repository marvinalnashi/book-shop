'use client'

import { useEffect, useState } from 'react'
import BookCard from '../components/BookCard'
import booksData from '../../public/books.json'

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
}

const ITEMS_PER_PAGE = 8

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('featured')
    const [currentPage, setCurrentPage] = useState(1)

    const [filteredBooks, setFilteredBooks] = useState<Book[]>(booksData)

    useEffect(() => {
        let result = [...booksData]

        if (searchQuery.trim()) {
            result = result.filter(b =>
                b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.author.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        if (sortBy === 'priceLow') {
            result.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'priceHigh') {
            result.sort((a, b) => b.price - a.price)
        }

        setFilteredBooks(result)
        setCurrentPage(1)
    }, [searchQuery, sortBy])

    const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE)
    const paginated = filteredBooks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const grouped = paginated.reduce((acc, book) => {
        acc[book.category] ||= []
        acc[book.category].push(book)
        return acc
    }, {} as Record<string, Book[]>)

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="🔍 Search by title or author..."
                    className="border px-4 py-2 rounded w-full sm:w-1/2 md:w-1/3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-700">Sort By:</label>
                    <select
                        className="border px-3 py-2 rounded"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="featured">Featured</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <h2 className="text-2xl font-bold">All Books</h2>

            {Object.entries(grouped).map(([category, list]) => (
                <section key={category}>
                    <h3 className="text-xl font-bold mb-4">{category}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {list.map(book => <BookCard key={book.id} book={book} />)}
                    </div>
                </section>
            ))}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 border rounded ${currentPage === i + 1 ? 'bg-black text-white' : 'text-gray-700'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
