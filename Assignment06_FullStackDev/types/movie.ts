/*
* Author: Caitlin Hagler
* IDE: VSCode
* Last Revision Date: November 16, 2026
* 
* Defines TypeScript interfaces for OMDb API responses.
*/

// Interface for individual movie search results
export interface MovieSearchResult {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

// Interface for movie ratings
export interface MovieRating {
    Source: string;
    Value: string;
}

// Interface for detailed movie information
export interface MovieDetails {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: MovieRating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD?: string;
    BoxOffice?: string;
    Production?: string;
    Website?: string;
    Response: "True";
}

// Interface for movie search response
export interface MovieSearchResponse {
    Search: MovieSearchResult[];
    totalResults: string;
    Response: "True";
}

// Interface for movie lookup response
export interface MovieApiError {
    Response: "False";
    Error: string;
}

// Interface for movie search parameters
export interface MovieSearchParams {
    s: string;
    type?: "movie" | "series" | "episode";
    y?: string;
    page?: number;
}

// Interface for movie lookup parameters
export interface MovieLookupParams {
    i: string;
    plot?: "short" | "full";
}
