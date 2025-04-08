// app/lib/data/mockData.ts
import { Movie, Theater, Screening } from '@/app/lib/definitions';

export const theaters: Theater[] = [
    {
      id: 'siff-uptown',
      name: 'SIFF Cinema Uptown',
      address: '511 Queen Anne Ave N, Seattle, WA 98109',
      location: { lat: 47.6249, lng: -122.3561 },
      amenities: ['Wheelchair Accessible', 'Concessions', 'Bar', 'Reserved Seating', 'Dolby Sound']
    },
    {
      id: 'siff-egyptian',
      name: 'SIFF Cinema Egyptian',
      address: '805 E Pine St, Seattle, WA 98122',
      location: { lat: 47.6156, lng: -122.3231 },
      amenities: ['Wheelchair Accessible', 'Concessions', 'Historic Venue', '35mm Projection']
    },
    {
      id: 'northwest-film-forum',
      name: 'Northwest Film Forum',
      address: '1515 12th Ave, Seattle, WA 98122',
      location: { lat: 47.6142, lng: -122.3168 },
      amenities: ['Wheelchair Accessible', 'Concessions', 'Member Discounts', 'Art Gallery']
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
    {
      id: 'movie3',
      title: 'Parasite',
      director: 'Bong Joon-ho',
      duration: 132,
      synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
      posterUrl: '/images/parasite.jpg',
      genres: ['Thriller', 'Drama', 'Comedy'],
      language: 'Korean',
      releaseYear: 2019
    },
    {
      id: 'movie4',
      title: 'Portrait of a Lady on Fire',
      director: 'Céline Sciamma',
      duration: 122,
      synopsis: 'On an isolated island in Brittany at the end of the eighteenth century, a female painter is obliged to paint a wedding portrait of a young woman.',
      posterUrl: '/images/portrait.jpg',
      genres: ['Drama', 'Romance'],
      language: 'French',
      releaseYear: 2019
    },
    {
      id: 'movie5',
      title: 'Moonlight',
      director: 'Barry Jenkins',
      duration: 111,
      synopsis: 'A young African-American man grapples with his identity and sexuality while experiencing the everyday struggles of childhood, adolescence, and burgeoning adulthood.',
      posterUrl: '/images/moonlight.jpg',
      genres: ['Drama'],
      language: 'English',
      releaseYear: 2016
    },
    {
      id: 'movie6',
      title: 'An Unfinished Film',
      director: 'Lou Ye',
      duration: 124,
      synopsis: 'A gripping tale of personal and political turbulence in contemporary China.',
      posterUrl: '/images/unfinished-film.jpg',
      genres: ['Drama', 'Political'],
      language: 'Mandarin',
      releaseYear: 2023
    }
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