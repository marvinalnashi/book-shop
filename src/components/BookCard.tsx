'use client'

import { useRouter } from 'next/navigation'

export default function BookCard({ book }: { book: any }) {
    const router = useRouter()
    return (
        <div
            className="border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer bg-white"
            onClick={() => router.push(`/book/${book.id}`)}
        >
            <img src={book.cover} alt={book.title} className="w-full h-64 object-cover rounded-t" />
            <div className="p-4">
                <h4 className="font-semibold line-clamp-2">{book.title}</h4>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-xs text-gray-500">{book.year} · {book.genre}</p>
                <div className="mt-2">
                    {book.oldPrice && <span className="line-through text-sm text-gray-400 mr-2">€{book.oldPrice}</span>}
                    <span className="text-lg font-bold">€{book.price}</span>
                </div>
            </div>
        </div>
    )
}
