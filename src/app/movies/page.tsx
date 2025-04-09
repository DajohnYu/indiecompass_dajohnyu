// src/app/movies/page.tsx
import { fetchMovies } from '@/app/lib/data/dataProvider';
import Link from 'next/link';

export default async function MoviesPage() {
  const movies = await fetchMovies();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Movies</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link 
            href={`/movies/${movie.id}`} 
            key={movie.id}
            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border"
          >
            {/* Rest of your component remains the same */}
            <div className="aspect-[2/3] bg-slate-200 relative">
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
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                {movie.synopsis}
              </p>
              <div className="text-indigo-600 text-sm group-hover:text-indigo-800 transition-colors">
                View details
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}