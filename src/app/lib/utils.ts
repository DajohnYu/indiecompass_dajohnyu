// app/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isTomorrow } from 'date-fns';

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
export function getMovieById(movies: any[], id: string) {
  return movies.find(movie => movie.id === id);
}

// Get a theater from an array by ID
export function getTheaterById(theaters: any[], id: string) {
  return theaters.find(theater => theater.id === id);
}