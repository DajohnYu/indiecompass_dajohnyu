// src/app/api/screenings/route.ts
import { fetchScreenings } from '@/app/lib/data/dataProvider';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const screenings = await fetchScreenings();
    return NextResponse.json(screenings);
  } catch (error) {
    console.error('Error fetching screenings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch screenings' },
      { status: 500 }
    );
  }
}