import './globals.css'
import type {Metadata} from 'next'
import Header from '../components/Header'

export const metadata: Metadata = {
    title: 'Like a Book',
    description: 'Book shop research website',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="bg-white text-gray-900">
        <Header/>
        <main className="pt-20 px-6 max-w-7xl mx-auto">{children}</main>
        </body>
        </html>
    )
}
