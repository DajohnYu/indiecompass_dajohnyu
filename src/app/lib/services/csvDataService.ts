// src/app/lib/services/csvDataService.ts
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Movie, Theater, Screening } from '../definitions';

const CSV_DIR = path.join(process.cwd(), 'src/data/csv');

export async function getMovies(): Promise<Movie[]> {
  try {
    const filePath = path.join(CSV_DIR, 'movies.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    return records.map((record: any) => ({
      ...record,
      duration: parseInt(record.duration),
      releaseYear: parseInt(record.releaseYear),
      genres: record.genres.split(',')
    }));
  } catch (error) {
    console.error('Error reading movies CSV:', error);
    return [];
  }
}

export async function getTheaters(): Promise<Theater[]> {
  try {
    const filePath = path.join(CSV_DIR, 'theaters.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    return records.map((record: any) => ({
      id: record.id,
      name: record.name,
      address: record.address,
      location: {
        lat: parseFloat(record.location_lat), 
        lng: parseFloat(record.location_lng)
      },
      amenities: record.amenities.split(',')
    }));
  } catch (error) {
    console.error('Error reading theaters CSV:', error);
    return [];
  }
}

export async function getScreenings(): Promise<Screening[]> {
  try {
    const filePath = path.join(CSV_DIR, 'screenings.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    return records.map((record: any) => ({
      ...record,
      startTime: new Date(record.startTime),
      endTime: new Date(record.endTime),
      specialEvent: record.specialEvent.toLowerCase() === 'true'
    }));
  } catch (error) {
    console.error('Error reading screenings CSV:', error);
    return [];
  }
}