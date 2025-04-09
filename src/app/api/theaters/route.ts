// src/app/api/theaters/route.ts
import { fetchTheaters } from '@/app/lib/data/dataProvider';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const theaters = await fetchTheaters();
    return NextResponse.json(theaters);
  } catch (error) {
    console.error('Error fetching theaters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theaters' },
      { status: 500 }
    );
  }
}