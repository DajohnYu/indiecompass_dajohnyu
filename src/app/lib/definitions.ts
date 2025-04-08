// app/lib/definitions.ts
export interface Movie {
    id: string;
    title: string;
    director: string;
    duration: number;
    synopsis: string;
    posterUrl: string;
    genres: string[];
    language: string;
    releaseYear: number;
  }
  
  export interface Theater {
    id: string;
    name: string;
    address: string;
    location: {lat: number, lng: number};
    amenities: string[];
  }
  
  export interface Screening {
    id: string;
    movieId: string;
    theaterId: string;
    screenId: string;
    startTime: Date;
    endTime: Date;
    format: string; // e.g., "Digital", "35mm"
    specialEvent: boolean;
    ticketUrl: string;
  }