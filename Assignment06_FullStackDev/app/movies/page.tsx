import FilterForm from "@/components/FilterForm";
import { searchMovies, OmdbError } from "@/lib/omdb";
import type { MovieSearchParams, MovieSearchResponse } from "@/types/movie";

/*
* Author: Caitlin Hagler, John Morales
* IDE: VSCode
* Last Revision Date: November 20, 2026
*
* Movie search page. Reads the search parameters from the URL
* (set by SearchForm / FilterForm), calls the OMDb API on the
* server, and displays the results or an error message.
*/

export const metadata = {
    title: "Search"
};

interface MoviesPageProps {
    searchParams: Promise<{
        s?: string;
        y?: string;
        type?: string;
        page?: string;
    }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
    const { s, y, type, page } = await searchParams;

    let results: MovieSearchResponse | null = null;
    let error: string | null = null;

    // Only search once the user has entered a title.
    if (s) {
        const params: MovieSearchParams = { s };
        if (y) params.y = y;
        if (type === "movie" || type === "series" || type === "episode") params.type = type;
        if (page) params.page = Number(page);

        try {
            results = await searchMovies(params);
        } catch (err) {
            error = err instanceof OmdbError ? err.message : "Something went wrong. Please try again.";
        }
    }

    return (
        <div>
            <h1>Search Movies</h1>
            <FilterForm />

            {error && <p role="alert">{error}</p>}

            {results && (
                <section>
                    <p>{results.totalResults} results for &quot;{s}&quot;</p>
                    <ul className="movie-list">
                        {results.Search.map((movie) => (
                            <li key={movie.imdbID}>
                                {movie.Poster !== "N/A" && (
                                    <img src={movie.Poster} alt={`Poster for ${movie.Title}`} width={100} />
                                )}
                                <p>{movie.Title} ({movie.Year}) - {movie.Type}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
