/*
* Author: Caitlin Hagler
* IDE: VSCode
* Last Revision Date: November 16, 2026
* 
* Defines TypeScript interfaces for OMDb API responses.
*/

import "server-only";

import {
    MovieSearchParams,
    MovieSearchResponse,
    MovieDetails,
    MovieApiError
} from "@/types/movie";

const OMDB_BASE_URL = "https://www.omdbapi.com/";

// Custom error for OMDb API failures.
export class OmdbError extends Error {
    // Initializes a new instance of the OmdbError class with a specific message.
    constructor(message: string) {
        super(message);
        this.name = "OmdbError";
    }
}

// Retrieves the API key from environment variables.
function getApiKey(): string {
    const apiKey = process.env.OMDB_API_KEY;

    // Validate that the API key is present
    if (!apiKey) {
        throw new OmdbError("OMDb API key is missing.");
    }

    return apiKey;
}

// Sends a request to the OMDb API.
async function fetchOmdb<T extends { Response: "True" }>(params: Record<string, string>): Promise<T> {
    // Construct query parameters for the API request
    const searchParams = new URLSearchParams({
        ...params,
        apikey: getApiKey()
    });

    // Send the request to the OMDb API
    const response = await fetch(
        `${OMDB_BASE_URL}?${searchParams.toString()}`,
        { cache: "no-store" }
    );

    // Check for HTTP errors
    if (!response.ok) {
        throw new OmdbError(
            `OMDb request failed: ${response.status}`
        );
    }

    const data = await response.json() as T | MovieApiError;

    // Check for API error response
    if (data.Response === "False") {
        throw new OmdbError(data.Error);
    }

    return data as T;
}

// Searches for movies and television titles.
export async function searchMovies(params: MovieSearchParams): Promise<MovieSearchResponse> {
    // Validate search term input
    if (!params.s.trim()) {
        throw new OmdbError("A search term is required.");
    }

    // Construct query parameters for the API request
    const query: Record<string, string> = {
        s: params.s.trim()
    };

    // Add optional parameters if provided
    if (params.type) query.type = params.type;
    if (params.y) query.y = params.y;
    if (params.page) query.page = String(params.page);

    return fetchOmdb<MovieSearchResponse>(query);
}

// Retrieves detailed information using an IMDb ID.
export async function getMovieById(imdbID: string, plot: "short" | "full" = "short"): Promise<MovieDetails> {
    // Validate IMDb ID input
    if (!imdbID.trim()) {
        throw new OmdbError("An IMDb ID is required.");
    }

    // Validate plot parameter
    return fetchOmdb<MovieDetails>({
        i: imdbID.trim(),
        plot
    });
}