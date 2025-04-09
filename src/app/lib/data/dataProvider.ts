// src/app/lib/data/dataProvider.ts
import { getMovies, getTheaters, getScreenings } from '../services/csvDataService';
import { Movie, Theater, Screening } from '../definitions';

// Cache data to avoid reading files repeatedly
let moviesCache: Movie[] | null = null;
let theatersCache: Theater[] | null = null;
let screeningsCache: Screening[] | null = null;

export async function fetchMovies(): Promise<Movie[]> {
  if (!moviesCache) {
    moviesCache = await getMovies();
  }
  return moviesCache;
}

export async function fetchTheaters(): Promise<Theater[]> {
  if (!theatersCache) {
    theatersCache = await getTheaters();
  }
  return theatersCache;
}

export async function fetchScreenings(): Promise<Screening[]> {
  if (!screeningsCache) {
    screeningsCache = await getScreenings();
  }
  return screeningsCache;
}

export async function getMovieById(id: string): Promise<Movie | undefined> {
  const movies = await fetchMovies();
  return movies.find(movie => movie.id === id);
}

export async function getTheaterById(id: string): Promise<Theater | undefined> {
  const theaters = await fetchTheaters();
  return theaters.find(theater => theater.id === id);
}