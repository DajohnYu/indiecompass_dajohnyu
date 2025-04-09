'use client';
// src/app/search/page.tsx

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Movie } from '@/app/lib/definitions';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch all movies and filter on the client side
        // In a production app, we would create a dedicated search API endpoint
        const response = await fetch('/api/movies');
        
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        
        const allMovies = await response.json();
        
        // Perform search filtering on the client side
        const filteredMovies = allMovies.filter((movie: Movie) => {
          const searchTerm = query.toLowerCase();
          
          // Search in multiple fields
          return movie.title.toLowerCase().includes(searchTerm) ||
                 movie.director.toLowerCase().includes(searchTerm) ||
                 movie.synopsis.toLowerCase().includes(searchTerm) ||
                 movie.genres.some((genre: string) => genre.toLowerCase().includes(searchTerm)) ||
                 movie.language.toLowerCase().includes(searchTerm) ||
                 movie.releaseYear.toString().includes(searchTerm);
        });
        
        setResults(filteredMovies);
        setError(null);
      } catch (err) {
        console.error('Error searching movies:', err);
        setError('Failed to search movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    performSearch();
  }, [query]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        {query && !loading && (
          <p className="text-slate-600">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="bg-white p-6 rounded-lg border text-center">
          <p className="text-indigo-600">Searching...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-white p-6 rounded-lg border border-red-200">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Results */}
      {!loading && !error && results.length > 0 ? (
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
                <h3 className="font-medium text-slate-900 mb-1">
                  {movie.title}
                </h3>
                <p className="text-sm text-slate-500 mb-2">
                  {movie.director} • {movie.releaseYear}
                </p>
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
      ) : !loading && query ? (
        <div className="bg-white p-8 rounded-lg border text-center">
          <h2 className="text-xl font-medium mb-2">No results found</h2>
          <p className="text-slate-600 mb-4">
            We couldn&apos;t find any movies matching &ldquo;{query}&rdquo;.
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
        </div>
      ) : !loading && !query ? (
        <div className="bg-white p-6 rounded-lg border text-center">
          <p className="text-slate-700">Please enter a search term to find movies.</p>
        </div>
      ) : null}
      
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