'use client';
// src/app/search/page.tsx

import { movies } from '@/app/lib/data/mockData';
import { searchMovies } from '@/app/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<typeof movies>([]);
  
  useEffect(() => {
    if (query) {
      const searchResults = searchMovies(movies, query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        {query && (
          <p className="text-slate-600">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </p>
        )}
      </div>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((movie) => (
            <Link 
              href={`/movies/${movie.id}`} 
              key={movie.id}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="aspect-[2/3] bg-slate-200 relative">
                {/* Placeholder for movie poster */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium p-4 text-center">
                  {movie.title}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-slate-900 mb-1">{movie.title}</h3>
                <p className="text-sm text-slate-500 mb-2">{movie.director} • {movie.releaseYear}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {movie.genres.slice(0, 2).map((genre: string, idx: number) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                      {genre}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-600 line-clamp-3 mb-3 leading-snug">
                  {movie.synopsis}
                </p>
                <div className="text-indigo-600 text-sm group-hover:text-indigo-800 transition-colors">
                  View details
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg border text-center">
          {query ? (
            <>
              <h2 className="text-xl font-medium mb-2">No results found</h2>
              <p className="text-slate-600 mb-4">
                We couldn't find any movies matching "{query}".
              </p>
              <div className="text-slate-700">
                <p className="mb-2">Suggestions:</p>
                <ul className="list-disc list-inside text-left max-w-md mx-auto">
                  <li>Check your spelling</li>
                  <li>Try different keywords</li>
                  <li>Try a more general search</li>
                  <li>Try searching for a movie title, director, or genre</li>
                </ul>
              </div>
            </>
          ) : (
            <p className="text-slate-700">Please enter a search term to find movies.</p>
          )}
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link 
          href="/movies" 
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Browse all movies
        </Link>
      </div>
    </div>
  );
}