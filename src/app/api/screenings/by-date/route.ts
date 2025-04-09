// src/app/api/screenings/by-date/route.ts
import { fetchScreenings } from '@/app/lib/data/dataProvider';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get the date from URL query parameter
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    if (!dateParam) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }
    
    const targetDate = new Date(dateParam);
    // Check if date is valid
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    // Set time to 00:00:00 to match the whole day
    targetDate.setHours(0, 0, 0, 0);
    
    const allScreenings = await fetchScreenings();
    
    // Filter screenings for the requested date
    const screeningsOnDate = allScreenings.filter(screening => {
      const screeningDate = new Date(screening.startTime);
      screeningDate.setHours(0, 0, 0, 0);
      return screeningDate.getTime() === targetDate.getTime();
    });
    
    return NextResponse.json(screeningsOnDate);
  } catch (error) {
    console.error('Error fetching screenings by date:', error);
    return NextResponse.json(
      { error: 'Failed to fetch screenings' },
      { status: 500 }
    );
  }
}