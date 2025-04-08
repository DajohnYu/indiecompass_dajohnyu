// src/app/page.tsx
import Link from 'next/link';
import { movies, screenings, theaters } from './lib/data/mockData';
import { formatShowtimeDate, getMovieById, getTheaterById } from './lib/utils';

export default function Home() {
  // Get today's screenings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysScreenings = screenings.filter(screening => {
    const screeningDate = new Date(screening.startTime);
    return screeningDate.getDate() === today.getDate() &&
           screeningDate.getMonth() === today.getMonth() &&
           screeningDate.getFullYear() === today.getFullYear();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <section className="relative bg-indigo-900 text-white rounded-xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-800 opacity-90"></div>
        <div className="relative p-8 md:p-12 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Independent Cinema</h1>
          <p className="text-xl text-indigo-100 mb-6">Your guide to unique film experiences in Seattle</p>
          <Link 
            href="/movies" 
            className="inline-block bg-white text-indigo-900 px-6 py-3 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
          >
            Browse All Movies
          </Link>
        </div>
      </section>
      
      {/* Today's Screenings */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Today's Screenings</h2>
          <Link 
            href="/screenings" 
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all screenings
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysScreenings.length > 0 ? (
            todaysScreenings.map((screening) => {
              const movie = getMovieById(movies, screening.movieId);
              const theater = getTheaterById(theaters, screening.theaterId);
              
              return (
                <div key={screening.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-slate-100 p-4 border-b">
                    <p className="text-indigo-800 font-medium">{formatShowtimeDate(new Date(screening.startTime))}</p>
                    <span className="inline-block px-2 py-1 text-xs rounded bg-slate-200 text-slate-700 mt-1">
                      {screening.format}
                    </span>
                    {screening.specialEvent && (
                      <span className="inline-block px-2 py-1 text-xs rounded bg-amber-100 text-amber-800 ml-2">
                        Special Event
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-slate-900">{movie?.title}</h3>
                    <p className="text-slate-500">{theater?.name}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <Link 
                        href={`/movies/${movie?.id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Movie details
                      </Link>
                      <a 
                        href={screening.ticketUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition-colors text-sm"
                      >
                        Get Tickets
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white p-6 rounded-lg border text-center">
              <p>No screenings scheduled for today.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Films */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Featured Films</h2>
          <Link 
            href="/movies" 
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all films
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.slice(0, 4).map((movie) => (
            <Link 
              href={`/movies/${movie.id}`} 
              key={movie.id}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[2/3] bg-slate-200 relative">
                {/* Placeholder for movie poster */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium p-4 text-center">
                  {movie.title}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-slate-900">{movie.title}</h3>
                <p className="text-sm text-slate-500 mb-2">{movie.director}</p>
                <div className="flex flex-wrap gap-1">
                  {movie.genres.slice(0, 2).map((genre, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}