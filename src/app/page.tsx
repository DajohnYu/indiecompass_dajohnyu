'use client';
// src/app/page.tsx

import Link from 'next/link';
import { formatShowtimeDate } from './lib/utils';
import { useState, useEffect } from 'react';
import DateSelector from './components/ui/DateSelector';
import { Movie, Theater, Screening } from './lib/definitions';

export default function Home() {
  // Data state
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // Initialize with today at midnight for consistent comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch initial data
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        
        // Fetch data from our home API endpoint
        const response = await fetch('/api/home');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        
        // Convert date strings back to Date objects for screenings
        const parsedScreenings = data.todaysScreenings.map((screening: Record<string, unknown>) => ({
          ...screening,
          startTime: new Date(screening.startTime as string),
          endTime: new Date(screening.endTime as string)
        }));
        
        setMovies(data.featuredMovies);
        setTheaters(data.theaters);
        setScreenings(parsedScreenings);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchInitialData();
  }, []);
  
  // Fetch screenings when date changes
  useEffect(() => {
    async function fetchScreeningsForDate() {
      try {
        // Don't skip the initial load anymore - we want to ensure it always fetches
        setLoading(true);
        
        // Normalize date for consistent comparison
        const normalizedDate = new Date(selectedDate);
        normalizedDate.setHours(0, 0, 0, 0);
        
        // Use ISO string for API call
        const response = await fetch(`/api/screenings/by-date?date=${normalizedDate.toISOString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch screenings');
        }
        
        const screeningsData = await response.json();
        
        // Convert date strings to Date objects
        const parsedScreenings = screeningsData.map((screening: Record<string, unknown>) => ({
          ...screening,
          startTime: new Date(screening.startTime as string),
          endTime: new Date(screening.endTime as string)
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
    
    // Always fetch screenings when date changes, without conditions
    fetchScreeningsForDate();
    
  }, [selectedDate]); // Don't add loading or screenings.length to dependencies
  
  // Helper functions for getting related entities
  const getMovieById = (id: string) => movies.find(movie => movie.id === id);
  const getTheaterById = (id: string) => theaters.find(theater => theater.id === id);
  
  // If we're still doing initial loading
  if (loading && screenings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-indigo-600 mb-2">Loading...</p>
          <p className="text-slate-500">Please wait while we fetch the latest showtimes.</p>
        </div>
      </div>
    );
  }
  
  // If we encountered an error
  if (error && screenings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-8 text-center border border-red-200">
          <p className="text-red-600 mb-2">Error</p>
          <p className="text-slate-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
      
      {/* Date Selector and Screenings */}
      <section className="mb-12">
        <DateSelector 
          onDateSelect={setSelectedDate}
          initialDate={selectedDate}
        />
        
        {loading && screenings.length > 0 && (
          <div className="text-center py-4">
            <p className="text-indigo-600">Updating screenings...</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screenings.length > 0 ? (
            screenings.map((screening) => {
              const movie = getMovieById(screening.movieId);
              const theater = getTheaterById(screening.theaterId);
              
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
              <p>No screenings scheduled for this date.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-6">
          <Link
            href="/screenings"
            className="inline-block text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View all screenings →
          </Link>
        </div>
      </section>
      
      {/* Featured Films section */}
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
          {movies.map((movie) => (
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
                  {movie.genres.slice(0, 2).map((genre: string, idx: number) => (
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