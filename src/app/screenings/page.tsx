'use client';
// src/app/screenings/page.tsx

import { movies, screenings, theaters } from '@/app/lib/data/mockData';
import { formatShowtimeDate, getMovieById, getTheaterById } from '@/app/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import DateSelector from '@/app/components/ui/DateSelector';

export default function ScreeningsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Filter screenings by the selected date
  const filteredScreenings = screenings.filter(screening => {
    const screeningDate = new Date(screening.startTime);
    return screeningDate.toDateString() === selectedDate.toDateString();
  });
  
  // Group screenings by theater
  const screeningsByTheater = filteredScreenings.reduce((acc, screening) => {
    const theater = getTheaterById(theaters, screening.theaterId);
    const theaterId = theater?.id || 'unknown';
    
    if (!acc[theaterId]) {
      acc[theaterId] = {
        theater,
        screenings: []
      };
    }
    
    acc[theaterId].screenings.push(screening);
    return acc;
  }, {} as Record<string, { theater: typeof theaters[0] | undefined, screenings: typeof screenings }>);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Screenings</h1>
      
      {/* Date Selector */}
      <DateSelector 
        onDateSelect={setSelectedDate}
        initialDate={selectedDate}
        numberOfDays={10}
      />
      
      {/* Screenings List */}
      {Object.keys(screeningsByTheater).length > 0 ? (
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
                      const movie = getMovieById(movies, screening.movieId);
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
      ) : (
        <div className="bg-white p-8 rounded-lg border text-center">
          <p className="text-slate-700 mb-2">No screenings found for this date.</p>
          <p className="text-slate-500">Try selecting a different date.</p>
        </div>
      )}
    </div>
  );
}