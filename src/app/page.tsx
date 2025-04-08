// app/page.tsx
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
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-2">IndieCompass</h1>
        <p className="text-xl text-gray-600">Discover independent cinema in Seattle</p>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Today's Screenings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysScreenings.length > 0 ? (
            todaysScreenings.map((screening) => {
              const movie = getMovieById(movies, screening.movieId);
              const theater = getTheaterById(theaters, screening.theaterId);
              
              return (
                <div key={screening.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <h3 className="text-lg font-medium">{movie?.title}</h3>
                    <p className="text-gray-500">{theater?.name}</p>
                    <p className="mt-2">{formatShowtimeDate(new Date(screening.startTime))}</p>
                    <div className="mt-4">
                      <Link 
                        href={`/movies/${movie?.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        More info
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No screenings scheduled for today.</p>
          )}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6">Featured Films</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.slice(0, 4).map((movie) => (
            <Link 
              href={`/movies/${movie.id}`} 
              key={movie.id}
              className="group"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                <div className="aspect-[2/3] bg-gray-200 relative">
                  {/* Placeholder for movie poster */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    {movie.title}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{movie.title}</h3>
                  <p className="text-sm text-gray-500">{movie.director}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}