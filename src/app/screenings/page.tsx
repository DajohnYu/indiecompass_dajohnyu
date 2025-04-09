'use client';
// src/app/screenings/page.tsx

import Link from 'next/link';
import { useState, useEffect } from 'react';
import DateSelector from '@/app/components/ui/DateSelector';
import { Movie, Theater, Screening } from '@/app/lib/definitions';

export default function ScreeningsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch initial data - movies and theaters
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [moviesResponse, theatersResponse] = await Promise.all([
          fetch('/api/movies'),
          fetch('/api/theaters')
        ]);
        
        if (!moviesResponse.ok || !theatersResponse.ok) {
          throw new Error('Failed to fetch initial data');
        }
        
        const moviesData = await moviesResponse.json();
        const theatersData = await theatersResponse.json();
        
        setMovies(moviesData);
        setTheaters(theatersData);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load content. Please try again later.');
      }
    }
    
    fetchInitialData();
  }, []);
  
  // Fetch screenings when date changes
  useEffect(() => {
    async function fetchScreeningsForDate() {
      try {
        setLoading(true);
        
        // Format date for the API
        const normalizedDate = new Date(selectedDate);
        normalizedDate.setHours(0, 0, 0, 0);
        const response = await fetch(`/api/screenings/by-date?date=${normalizedDate.toISOString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch screenings');
        }
        
        const screeningsData = await response.json();
        
        // Convert date strings to Date objects
        const parsedScreenings = screeningsData.map((screening: any) => ({
          ...screening,
          startTime: new Date(screening.startTime),
          endTime: new Date(screening.endTime)
        }));
        
        setScreenings(parsedScreenings);
        setError(null);
      } catch (err) {
        console.error('Error fetching screenings:', err);
        setError('Failed to load screenings. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchScreeningsForDate();
  }, [selectedDate]);
  
  // Helper functions
  const getMovieById = (id: string) => movies.find(movie => movie.id === id);
  const getTheaterById = (id: string) => theaters.find(theater => theater.id === id);
  
  // Group screenings by theater
  const screeningsByTheater = screenings.reduce((acc, screening) => {
    const theater = getTheaterById(screening.theaterId);
    const theaterId = theater?.id || 'unknown';
    
    if (!acc[theaterId]) {
      acc[theaterId] = {
        theater,
        screenings: []
      };
    }
    
    acc[theaterId].screenings.push(screening);
    return acc;
  }, {} as Record<string, { theater: Theater | undefined, screenings: Screening[] }>);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Screenings</h1>
      
      {/* Date Selector */}
      <DateSelector 
        onDateSelect={setSelectedDate}
        initialDate={selectedDate}
        numberOfDays={10}
      />
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-indigo-600">Loading screenings...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-white p-6 rounded-lg border border-red-200 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Screenings List */}
      {!loading && !error && Object.keys(screeningsByTheater).length > 0 ? (
        Object.entries(screeningsByTheater).map(([theaterId, { theater, screenings: theaterScreenings }]) => (
          <div key={theaterId} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                {theater?.name || 'Unknown Theater'}
              </h2>
              <Link 
                href={`/theaters/${theaterId}`}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Theater details
              </Link>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-700">Time</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Movie</th>
                    <th className="text-left p-4 font-semibold text-slate-700 hidden md:table-cell">Format</th>
                    <th className="text-left p-4 font-semibold text-slate-700 hidden lg:table-cell">Runtime</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Tickets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {theaterScreenings
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((screening) => {
                      const movie = getMovieById(screening.movieId);
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
                            <p className="text-sm text-slate-500 hidden sm:block">
                              {movie?.genres.slice(0, 2).join(', ')}
                            </p>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <span className="inline-block px-2 py-1 text-xs rounded bg-slate-100 text-slate-700">
                              {screening.format}
                            </span>
                            {screening.specialEvent && (
                              <span className="inline-block ml-2 px-2 py-1 text-xs rounded bg-amber-100 text-amber-800">
                                Special
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-slate-700 hidden lg:table-cell">
                            {movie?.duration} min
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
        ))
      ) : !loading && !error ? (
        <div className="bg-white p-8 rounded-lg border text-center">
          <p className="text-slate-700 mb-2">No screenings found for this date.</p>
          <p className="text-slate-500">Try selecting a different date.</p>
        </div>
      ) : null}
    </div>
  );
}