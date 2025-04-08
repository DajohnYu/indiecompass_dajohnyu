// app/lib/data/mockData.ts
import { Movie, Theater, Screening } from '@/app/lib/definitions';

export const theaters: Theater[] = [
  {
    id: 'siff-uptown',
    name: 'SIFF Cinema Uptown',
    address: '511 Queen Anne Ave N, Seattle, WA 98109',
    location: { lat: 47.6249, lng: -122.3561 },
    amenities: ['Wheelchair Accessible', 'Concessions', 'Bar']
  },
  {
    id: 'siff-egyptian',
    name: 'SIFF Cinema Egyptian',
    address: '805 E Pine St, Seattle, WA 98122',
    location: { lat: 47.6156, lng: -122.3231 },
    amenities: ['Wheelchair Accessible', 'Concessions']
  }
];

export const movies: Movie[] = [
  {
    id: 'movie1',
    title: 'The Seventh Seal',
    director: 'Ingmar Bergman',
    duration: 96,
    synopsis: 'A man seeks answers about life, death, and existence while playing chess with Death during the Black Plague.',
    posterUrl: '/images/seventh-seal.jpg',
    genres: ['Drama', 'Fantasy'],
    language: 'Swedish',
    releaseYear: 1957
  },
  {
    id: 'movie2',
    title: 'In the Mood for Love',
    director: 'Wong Kar-wai',
    duration: 98,
    synopsis: 'Two neighbors form a strong bond after both suspect extramarital activities of their spouses.',
    posterUrl: '/images/mood-for-love.jpg',
    genres: ['Drama', 'Romance'],
    language: 'Cantonese',
    releaseYear: 2000
  },
  // Add more movies here
];

// Generate screenings for the next 7 days
const today = new Date();
export const screenings: Screening[] = [];

// Helper to create screenings
for (let i = 0; i < 7; i++) {
  const date = new Date(today);
  date.setDate(date.getDate() + i);
  
  // Add a few screenings per day
  movies.forEach((movie, index) => {
    // Each movie shows 1-3 times per day at different theaters
    const numScreenings = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < numScreenings; j++) {
      const hour = 12 + Math.floor(Math.random() * 9); // Between 12pm and 8pm
      const startTime = new Date(date);
      startTime.setHours(hour, 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + movie.duration);
      
      screenings.push({
        id: `screening-${i}-${movie.id}-${j}`,
        movieId: movie.id,
        theaterId: theaters[j % theaters.length].id,
        screenId: `screen-${(j % 3) + 1}`,
        startTime,
        endTime,
        format: Math.random() > 0.2 ? 'Digital' : '35mm',
        specialEvent: Math.random() > 0.9,
        ticketUrl: 'https://siff.net/tickets'
      });
    }
  });
}