IndieCompass
============

A centralized platform for discovering independent cinema showtimes in Seattle.

Introduction
------------

IndieCompass is a web application that serves as a centralized platform for independent cinema showtimes in Seattle. The application bridges the gap between independent movie theaters, film distributors, and local audiences by providing a user-friendly interface to discover and explore independent film screenings.

### Purpose

The core functions of IndieCompass include:

-   Displaying showtimes from independent theaters in a unified, searchable interface
-   Providing detailed information about films and theaters
-   Allowing users to filter screenings by date
-   Enabling search functionality to find specific films
-   Collecting audience preference data to help theaters and distributors make informed decisions

The application is designed to be expandable, initially focusing on SIFF (Seattle International Film Festival) theaters with plans to incorporate additional independent venues in the future.

### Target Users

-   Independent cinema enthusiasts looking for showtime information
-   Theater operators who want to reach wider audiences
-   Film distributors seeking to connect with appropriate venues
-   The organization's staff who analyze audience preferences

Quick Start Guide
-----------------

Follow these steps to get IndieCompass up and running on your local machine:

### Prerequisites

-   Node.js version 20.x or higher (required for Next.js 14)
-   npm (comes with Node.js)
-   Git (to clone the repository)

### Installation

1.  Navigate to the project directory:

    bash

1.  `http://localhost:3000`

### Testing Different Features

1.  **Browse Movies**: Visit `/movies` to see all available films
2.  **View Movie Details**: Click on any movie to see details and showtimes
3.  **Browse Theaters**: Visit `/theaters` to see all theaters
4.  **Search**: Use the search bar in the header to find movies
5.  **Filter by Date**: Use the date selector on the home or screenings pages

Tech Stack
----------

IndieCompass is built using modern web technologies:

### Frontend

-   **React 18**: Component-based UI library
-   **Next.js 14**: React framework with server and client components
-   **TypeScript**: Statically typed JavaScript for improved code quality
-   **Tailwind CSS**: Utility-first CSS framework for styling

### Backend

-   **Next.js API Routes**: Serverless functions for API endpoints
-   **Node.js**: JavaScript runtime for server-side logic

### Data Storage

-   **CSV Files**: Current data storage mechanism
-   **File System Module**: For reading CSV data on the server

### Deployment

-   **Vercel**: Recommended deployment platform (compatible with Next.js)

### Development Tools

-   **npm**: Package manager
-   **Git**: Version control

Technical Architecture
----------------------

IndieCompass follows a hybrid rendering architecture with both server and client components. This approach provides optimal performance, SEO benefits, and interactive user experiences.

### Component Structure

[INSERT DIAGRAM]

### Data Flow

1.  **Server Components** (e.g., Movies Page, Theater Detail):

    -   Direct access to data via the Data Provider
    -   Pre-rendered on the server for better performance and SEO
    -   Delivered as HTML to the client
2.  **Client Components** (e.g., Home Page, Search Page):

    -   Fetch data through API Routes
    -   Manage their own state and render on the client side
    -   Provide interactive features like date selection and search
3.  **API Routes**:

    -   Serverless functions that run on-demand
    -   Access data via the Data Provider
    -   Return JSON data to client components
4.  **Data Provider**:

    -   Abstract layer between data source and application
    -   Uses CSV Data Service to read file data
    -   Provides methods for fetching all entities or specific entities by ID
5.  **CSV Data Service**:

    -   Reads and parses CSV files
    -   Transforms raw data into application data models
    -   Handles file system operations

### Key Design Patterns

-   **Server/Client Component Split**: Components are either server-rendered or client-rendered based on their needs
-   **Data Fetching Pattern**: Server components fetch directly; client components use API routes
-   **Compositional Pattern**: UI built from composable, reusable components
-   **Abstraction Layers**: Data access abstracted behind provider interfaces

Data Schema
-----------

IndieCompass uses three primary data models, each stored in its own CSV file:

### Movies

File: `src/data/csv/movies.csv`

| Field | Type | Description |
| --- | --- | --- |
| id | string | Unique identifier for the movie |
| title | string | Movie title |
| director | string | Director's name |
| duration | number | Runtime in minutes |
| synopsis | string | Brief description of the film |
| posterUrl | string | Path to movie poster image |
| genres | string | Comma-separated list of genres |
| language | string | Primary language of the film |
| releaseYear | number | Year the film was released |

Example:

csv

`id,title,director,duration,synopsis,posterUrl,genres,language,releaseYear
movie1,The Seventh Seal,Ingmar Bergman,96,"A man seeks answers about life, death, and existence...",/images/seventh-seal.jpg,"Drama,Fantasy",Swedish,1957`

### Theaters

File: `src/data/csv/theaters.csv`

| Field | Type | Description |
| --- | --- | --- |
| id | string | Unique identifier for the theater |
| name | string | Theater name |
| address | string | Physical address |
| location_lat | number | Latitude coordinate |
| location_lng | number | Longitude coordinate |
| amenities | string | Comma-separated list of amenities |

Example:

csv

`id,name,address,location_lat,location_lng,amenities
siff-uptown,SIFF Cinema Uptown,511 Queen Anne Ave N Seattle WA 98109,47.6249,-122.3561,"Wheelchair Accessible,Concessions,Bar"`

### Screenings

File: `src/data/csv/screenings.csv`

| Field | Type | Description |
| --- | --- | --- |
| id | string | Unique identifier for the screening |
| movieId | string | Reference to movie.id |
| theaterId | string | Reference to theater.id |
| screenId | string | Identifier for the screen within the theater |
| startTime | datetime | Screening start time (ISO format) |
| endTime | datetime | Screening end time (ISO format) |
| format | string | Screening format (e.g., "Digital", "35mm") |
| specialEvent | boolean | Whether the screening is a special event |
| ticketUrl | string | URL to purchase tickets |

Example:

csv

`id,movieId,theaterId,screenId,startTime,endTime,format,specialEvent,ticketUrl
screening-1,movie1,siff-uptown,screen-1,2025-04-08T19:00:00,2025-04-08T20:36:00,Digital,false,https://siff.net/tickets`

### Data Relationships

-   **One-to-Many**: A Movie can have many Screenings
-   **One-to-Many**: A Theater can have many Screenings
-   **Foreign Keys**:
    -   `movieId` in Screenings references `id` in Movies
    -   `theaterId` in Screenings references `id` in Theaters

Extending the Application
-------------------------

### Adding More Theaters

To add additional independent theaters:

1.  Add new entries to `theaters.csv`
2.  Add related screenings to `screenings.csv` with the new theater ID

### Updating Data Sources

The application is designed to easily transition from CSV files to a database:

1.  Create a new data service (e.g., `databaseDataService.ts`) that implements the same interface as the CSV service
2.  Update the data provider to use the new service
3.  The rest of the application will continue to work without changes

### Adding Real Images

To replace the placeholder images with real movie posters and theater images:

1.  Add image files to the `public/images/` directory
2.  Update the `posterUrl` references in the movies.csv file
3.  Add image references for theaters in a similar manner

### Implementing Advanced Features

Future enhancements might include:

-   User accounts and preferences
-   Rating and review systems
-   Direct ticket purchasing
-   Analytics dashboard for theater operators
-   Integration with a database instead of CSV files

-   `cd indiecompass`

    -   Install dependencies:

    bash

    -   `npm install`

    -   Ensure data directories exist:

    bash

    -   `mkdir -p src/data/csv`

    -   Create CSV data files:

    Create the following files with the provided data structure:

    -   `src/data/csv/movies.csv`
    -   `src/data/csv/theaters.csv`
    -   `src/data/csv/screenings.csv`

    Use the examples from the [Data Schema](https://chat.mtfarm.me/c/f6cdc413-654e-4b44-8cd6-cd2659297078#data-schema) section or use the sample data provided in the repository.

    -   Start the development server:

    bash

    -   `npm run dev`

    -   Open your browser and navigate to:

    javascript

====================================================================================
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
