'use client';
// src/app/components/ClientHeader.tsx

import Link from 'next/link';
import SearchBar from './ui/SearchBar';

export default function ClientHeader() {
  return (
    <header className="bg-indigo-950 text-white py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              <Link href="/">IndieCompass</Link>
            </h1>
            <p className="text-sm text-indigo-200">Seattle Independent Cinema</p>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <nav>
              <ul className="flex space-x-6">
                <li><Link href="/" className="hover:text-indigo-200 transition-colors">Home</Link></li>
                <li><Link href="/movies" className="hover:text-indigo-200 transition-colors">Movies</Link></li>
                <li><Link href="/screenings" className="hover:text-indigo-200 transition-colors">Showtimes</Link></li>
                <li><Link href="/theaters" className="hover:text-indigo-200 transition-colors">Theaters</Link></li>
              </ul>
            </nav>
            <SearchBar className="w-56" />
          </div>
          
          {/* Mobile Navigation & Search */}
          <div className="flex flex-col space-y-2 md:hidden">
            <SearchBar />
            <nav className="mt-2">
              <ul className="flex space-x-4 justify-start">
                <li><Link href="/" className="text-sm hover:text-indigo-200 transition-colors">Home</Link></li>
                <li><Link href="/movies" className="text-sm hover:text-indigo-200 transition-colors">Movies</Link></li>
                <li><Link href="/screenings" className="text-sm hover:text-indigo-200 transition-colors">Showtimes</Link></li>
                <li><Link href="/theaters" className="text-sm hover:text-indigo-200 transition-colors">Theaters</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}