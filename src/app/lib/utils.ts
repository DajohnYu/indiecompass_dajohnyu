// app/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isTomorrow } from 'date-fns';
import { Movie, Theater } from "./definitions";

// Combine tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date with nice relative names
export function formatShowtimeDate(date: Date): string {
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow, ${format(date, 'h:mm a')}`;
  } else {
    return format(date, 'EEE, MMM d, h:mm a');
  }
}

// Format a date with the specified format string
export function formatDate(date: Date, formatStr: string): string {
  return format(date, formatStr);
}

// Get a movie from an array by ID
export function getMovieById(movies: Movie[], id: string) {
  return movies.find(movie => movie.id === id);
}

// Get a theater from an array by ID
export function getTheaterById(theaters: Theater[], id: string) {
  return theaters.find(theater => theater.id === id);
}

export function searchMovies(movies: Movie[], query: string): Movie[] {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return [];
  
  return movies.filter(movie => {
    // Search by title
    if (movie.title.toLowerCase().includes(searchTerm)) return true;
    
    // Search by director
    if (movie.director.toLowerCase().includes(searchTerm)) return true;
    
    // Search by genre
    if (movie.genres.some(genre => genre.toLowerCase().includes(searchTerm))) return true;
    
    // Search by synopsis (for keywords)
    if (movie.synopsis.toLowerCase().includes(searchTerm)) return true;
    
    // Search by language
    if (movie.language.toLowerCase().includes(searchTerm)) return true;
    
    // Search by year
    if (movie.releaseYear.toString().includes(searchTerm)) return true;
    
    return false;
  });
}