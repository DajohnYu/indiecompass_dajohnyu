// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link';

// Load the Inter font (modern, clean font that works well for UI)
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IndieCompass | Independent Cinema in Seattle',
  description: 'Discover independent and arthouse cinema showtimes in Seattle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen`}>
        <header className="bg-indigo-950 text-white py-4 shadow-md">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">IndieCompass</h1>
              <p className="text-sm text-indigo-200">Seattle Independent Cinema</p>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li><Link href="/" className="hover:text-indigo-200 transition-colors">Home</Link></li>
                <li><Link href="/movies" className="hover:text-indigo-200 transition-colors">Movies</Link></li>
                <li><Link href="/screenings" className="hover:text-indigo-200 transition-colors">Showtimes</Link></li>
                <li><Link href="/theaters" className="hover:text-indigo-200 transition-colors">Theaters</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main>{children}</main>
        
        <footer className="bg-slate-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">IndieCompass</h3>
                <p className="text-slate-300">Your guide to independent cinema in Seattle.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-slate-300">info@indiecompass.com</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-slate-300 hover:text-white">Twitter</a>
                  <a href="#" className="text-slate-300 hover:text-white">Instagram</a>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-700 text-center text-slate-400">
              <p>© {new Date().getFullYear()} IndieCompass. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}