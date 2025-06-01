'use client'

import { useState } from 'react'
import BookCard from '@/components/BookCard'
import booksData from '../../../public/books.json'

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

export default function StandardPage() {
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
    const [sortField, setSortField] = useState<'title' | 'author' | 'year'>('title')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    const categories = ['Fantasy', 'Non-fiction', 'Thriller']
    const grouped = categories.reduce((acc, genre) => {
        const books = booksData.filter(book => book.genre === genre)
        books.sort((a, b) => {
            let result =
                sortField === 'year'
                    ? a.year - b.year
                    : a[sortField].localeCompare(b[sortField])
            return sortDirection === 'asc' ? result : -result
        })
        acc[genre] = books
        return acc
    }, {} as Record<string, Book[]>)

    const toggleExpand = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category],
        }))
    }

    return (
        <div className="space-y-12">
            <h2 className="text-2xl font-bold">All Books</h2>

            <div className="flex gap-4 mb-6">
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

            {categories.map(category => {
                const booksToShow = expandedCategories[category]
                    ? grouped[category]
                    : grouped[category].slice(0, 10)

                return (
                    <section key={category}>
                        <h3 className="text-xl font-bold mb-4">{category}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                            {booksToShow.map(book => (
                                <BookCard key={book.id} book={book} />
                            ))}
                            {!expandedCategories[category] && (
                                <button
                                    className="col-span-full text-right text-blue-600 hover:underline"
                                    onClick={() => toggleExpand(category)}
                                >
                                    View All
                                </button>
                            )}
                        </div>
                    </section>
                )
            })}
        </div>
    )
}
