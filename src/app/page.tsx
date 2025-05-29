import books from '../../public/books.json'
import BookCard from '../components/BookCard'

export default function HomePage() {
  const grouped = books.reduce((acc, book) => {
    acc[book.category] ||= []
    acc[book.category].push(book)
    return acc
  }, {} as Record<string, typeof books>)

  return (
      <div className="space-y-12">
        <h2 className="text-2xl font-semibold">All Books</h2>

        {Object.entries(grouped).map(([category, list]) => (
            <section key={category}>
              <h3 className="text-xl font-bold mb-4">{category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {list.map(book => <BookCard key={book.id} book={book} />)}
              </div>
            </section>
        ))}
      </div>
  )
}
