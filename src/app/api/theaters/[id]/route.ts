// src/app/api/theaters/[id]/route.ts
import { getTheaterById } from '@/app/lib/data/dataProvider';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const theater = await getTheaterById(params.id);
    
    if (!theater) {
      return NextResponse.json(
        { error: 'Theater not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(theater);
  } catch (error) {
    console.error(`Error fetching theater ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch theater' },
      { status: 500 }
    );
  }
}