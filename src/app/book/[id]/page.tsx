import books from '../../../../public/books.json'

export default function BookPage({ params }: { params: { id: string } }) {
    const book = books.find(b => b.id === Number(params.id))
    if (!book) return <div>Book not found</div>

    return (
        <div className="grid md:grid-cols-2 gap-10 mt-6">
            <div>
                <img src={book.cover} alt={book.title} className="w-full max-h-[600px] object-contain rounded" />
                <div className="mt-4 flex gap-2 overflow-x-auto">
                    <img src={book.cover} className="w-16 border-2 border-blue-500 rounded" />
                    <img src={book.spine} className="w-16 rounded" />
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold">{book.title}</h2>
                <p className="text-lg text-gray-700 mt-2">{book.author} · {book.language} · {book.pages}p · {book.year}</p>
                <p className="mt-4 text-gray-700">{book.description}</p>
                <div className="mt-4 text-xl">
                    {book.oldPrice && <span className="line-through text-gray-400 mr-2">€{book.oldPrice}</span>}
                    <span className="font-semibold text-blue-600">€{book.price}</span>
                </div>

                <div className="mt-6 flex gap-4">
                    <button className="bg-yellow-500 text-white font-bold py-2 px-6 rounded hover:bg-yellow-600">Add to cart</button>
                    <button className="bg-black text-white font-bold py-2 px-6 rounded hover:bg-gray-800">Buy now</button>
                </div>

                <div className="mt-8 text-sm text-gray-600 space-y-1">
                    <p><strong>Publisher:</strong> {book.publisher}</p>
                    <p><strong>Ships From:</strong> {book.origin}</p>
                </div>
            </div>
        </div>
    )
}
