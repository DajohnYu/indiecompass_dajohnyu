// src/app/api/movies/route.ts
import { fetchMovies } from '@/app/lib/data/dataProvider';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const movies = await fetchMovies();
    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}