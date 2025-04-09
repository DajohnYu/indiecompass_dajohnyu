// src/app/api/home/route.ts
import { fetchMovies, fetchTheaters, fetchScreenings } from '@/app/lib/data/dataProvider';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [movies, theaters, screenings] = await Promise.all([
      fetchMovies(),
      fetchTheaters(),
      fetchScreenings()
    ]);
    
    // For the home page, we'll just send the first few featured movies
    const featuredMovies = movies.slice(0, 4);
    
    // Get today's screenings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysScreenings = screenings.filter(screening => {
      const screeningDate = new Date(screening.startTime);
      screeningDate.setHours(0, 0, 0, 0);
      return screeningDate.getTime() === today.getTime();
    });
    
    return NextResponse.json({
      featuredMovies,
      theaters,
      todaysScreenings
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}