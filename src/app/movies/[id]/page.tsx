// src/app/movies/[id]/page.tsx
import { movies, screenings, theaters } from '@/app/lib/data/mockData';
import { formatShowtimeDate, getMovieById, getTheaterById } from '@/app/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Define props for the page component
export default function MoviePage({ params }: { params: { id: string } }) {
  const movie = getMovieById(movies, params.id);
  
  // If movie doesn't exist, show 404
  if (!movie) {
    notFound();
  }
  
  // Get all screenings for this movie, sorted by date
  const movieScreenings = screenings
    .filter(screening => screening.movieId === movie.id)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Group screenings by date
  const screeningsByDate = movieScreenings.reduce((acc, screening) => {
    const date = new Date(screening.startTime);
    const dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    
    acc[dateStr].push(screening);
    return acc;
  }, {} as Record<string, typeof screenings>);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link 
        href="/movies" 
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to all movies
      </Link>
      
      {/* Movie details header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-slate-200 md:w-1/3 flex items-center justify-center p-4">
            <div className="aspect-[2/3] w-full max-w-xs flex items-center justify-center text-slate-400 font-medium p-4 text-center">
              {movie.title}
              <span className="text-xs block mt-2">(Poster Placeholder)</span>
            </div>
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{movie.title}</h1>
                <p className="text-slate-600 mb-4">Directed by {movie.director}</p>
              </div>
              <span className="text-lg font-medium text-slate-700">{movie.releaseYear}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                  {genre}
                </span>
              ))}
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                {movie.duration} min
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                {movie.language}
              </span>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
              <p className="text-slate-700 leading-relaxed">{movie.synopsis}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Screenings section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Upcoming Screenings</h2>
        
        {Object.keys(screeningsByDate).length > 0 ? (
          Object.entries(screeningsByDate).map(([date, dateScreenings]) => (
            <div key={date} className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-slate-800">{date}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dateScreenings.map((screening) => {
                  const theater = getTheaterById(theaters, screening.theaterId);
                  return (
                    <div key={screening.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-indigo-700 font-semibold">
                          {new Date(screening.startTime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs rounded bg-slate-100 text-slate-700">
                          {screening.format}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{theater?.name}</p>
                        <p className="text-sm text-slate-500">Screen {screening.screenId.replace('screen-', '')}</p>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <Link
                          href={`/theaters/${theater?.id}`}
                          className="text-indigo-600 text-sm hover:text-indigo-800"
                        >
                          Theater info
                        </Link>
                        <a 
                          href={screening.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors"
                        >
                          Buy Tickets
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg border text-center">
            <p className="text-slate-700">No upcoming screenings scheduled for this movie.</p>
          </div>
        )}
      </section>
      
      {/* Additional movie information */}
      <section className="mt-12 bg-white rounded-lg shadow-sm p-6 border">
        <h2 className="text-xl font-semibold mb-4">More About This Film</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-900 mb-2">Movie Details</h3>
            <ul className="space-y-2 text-slate-700">
              <li><strong>Original Title:</strong> {movie.title}</li>
              <li><strong>Director:</strong> {movie.director}</li>
              <li><strong>Release Year:</strong> {movie.releaseYear}</li>
              <li><strong>Runtime:</strong> {movie.duration} minutes</li>
              <li><strong>Language:</strong> {movie.language}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-900 mb-2">About the Director</h3>
            <p className="text-slate-700">
              {movie.director} is a renowned filmmaker known for their distinctive style and artistic vision.
              {/* We would add real director information in a production environment */}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}