// src/app/theaters/page.tsx
import { theaters } from '@/app/lib/data/mockData';
import Link from 'next/link';

export default function TheatersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Theaters</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {theaters.map((theater) => (
          <Link 
            href={`/theaters/${theater.id}`} 
            key={theater.id}
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow border group"
          >
            <div className="h-48 bg-slate-200 relative">
              {/* Placeholder for theater image */}
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium p-4 text-center">
                {theater.name}
                <span className="text-xs block mt-2">(Image Placeholder)</span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors">
                {theater.name}
              </h2>
              <p className="text-slate-600 mb-4">{theater.address}</p>
              <div className="flex flex-wrap gap-2">
                {theater.amenities.map((amenity, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                    {amenity}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-indigo-600 text-sm group-hover:text-indigo-800 font-medium transition-colors">
                View showtimes
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}