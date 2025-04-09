// src/app/theaters/[id]/page.tsx
import { getTheaterById, fetchScreenings, getMovieById } from '@/app/lib/data/dataProvider';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Screening } from '@/app/lib/definitions';

export default async function TheaterPage({ params }: { params: { id: string } }) {
  const theater = await getTheaterById(params.id);
  
  // If theater doesn't exist, show 404
  if (!theater) {
    notFound();
  }
  
  // Get all screenings
  const allScreenings = await fetchScreenings();
  
  // Filter for this theater
  const theaterScreenings = allScreenings
    .filter(screening => screening.theaterId === theater.id)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  // Group screenings by date
  const screeningsByDate = theaterScreenings.reduce((acc, screening) => {
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
  }, {} as Record<string, Screening[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link 
        href="/theaters" 
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to all theaters
      </Link>
      
      {/* Theater details header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-slate-200 md:w-1/3 flex items-center justify-center p-4">
            <div className="w-full h-52 flex items-center justify-center text-slate-400 font-medium p-4 text-center">
              {theater.name}
              <span className="text-xs block mt-2">(Image Placeholder)</span>
            </div>
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{theater.name}</h1>
            <p className="text-slate-600 mb-6">{theater.address}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {theater.amenities.map((amenity: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                  {amenity}
                </span>
              ))}
            </div>
            
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <div className="h-40 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                Map placeholder (would integrate Google Maps here)
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Screenings section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Upcoming Screenings</h2>
        
        {Object.keys(screeningsByDate).length > 0 ? (
          Object.entries(screeningsByDate).map(async ([date, dateScreenings]) => {
            // Pre-fetch movies for this date's screenings
            const moviePromises = dateScreenings.map(screening => 
              getMovieById(screening.movieId)
            );
            const movies = await Promise.all(moviePromises);
            
            return (
              <div key={date} className="mb-8">
                <h3 className="text-xl font-medium mb-4 text-slate-800">{date}</h3>
                <div className="border rounded-lg overflow-hidden shadow-sm mb-8">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-700">Time</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Movie</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Screen</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Format</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Tickets</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dateScreenings.map((screening, index) => {
                        const movie = movies[index];
                        return (
                          <tr key={screening.id} className="hover:bg-slate-50">
                            <td className="p-4 font-medium text-indigo-700">
                              {new Date(screening.startTime).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="p-4">
                              <Link href={`/movies/${movie?.id}`} className="font-medium text-slate-900 hover:text-indigo-600 transition-colors">
                                {movie?.title}
                              </Link>
                              <p className="text-sm text-slate-500">
                                {movie?.duration} min • {movie?.genres.slice(0, 2).join(', ')}
                              </p>
                            </td>
                            <td className="p-4 text-slate-700">
                              {screening.screenId.replace('screen-', '')}
                            </td>
                            <td className="p-4">
                              <span className="inline-block px-2 py-1 text-xs rounded bg-slate-100 text-slate-700">
                                {screening.format}
                              </span>
                              {screening.specialEvent && (
                                <span className="inline-block px-2 py-1 text-xs rounded bg-amber-100 text-amber-800 ml-2">
                                  Special
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <a 
                                href={screening.ticketUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors inline-block"
                              >
                                Buy Tickets
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-6 rounded-lg border text-center">
            <p className="text-slate-700">No upcoming screenings scheduled at this theater.</p>
          </div>
        )}
      </section>
      
      {/* Additional theater information */}
      <section className="mt-12 bg-white rounded-lg shadow-sm p-6 border">
        <h2 className="text-xl font-semibold mb-4">About This Theater</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-900 mb-2">Theater Details</h3>
            <ul className="space-y-2 text-slate-700">
              <li><strong>Name:</strong> {theater.name}</li>
              <li><strong>Address:</strong> {theater.address}</li>
              <li><strong>Screens:</strong> 3</li>
              <li><strong>Parking:</strong> Available nearby</li>
              <li><strong>Public Transit:</strong> Accessible by bus routes 5, 26, 28</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-900 mb-2">About</h3>
            <p className="text-slate-700">
              {theater.name} is a beloved independent cinema dedicated to bringing the best of arthouse, international, 
              and independent films to Seattle audiences. With comfortable seating, state-of-the-art projection, 
              and a curated selection of films, we strive to provide a unique cinema experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}