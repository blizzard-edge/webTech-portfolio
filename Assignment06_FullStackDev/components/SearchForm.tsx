import { redirect } from 'next/navigation'

/*
* Author: Caitlin Hagler
* IDE: VSCode
* Last Revision Date: November 20, 2026
* 
* Source
* Next.js Documentation - How to create forms with Server Actions
* https://nextjs.org/docs/app/guides/forms
* 
* Adaptation:
* Modified the official example to support CineView's OMDb movie search parameters.
*/

// Handles movie search form submissions.
async function searchMovies(formData: FormData) {
    'use server'

    // Create URL parameters for the movie search.
    const params = new URLSearchParams()

    // Retrieve and clean the submitted form values.
    const title = formData.get('title')?.toString().trim()
    const year = formData.get('year')?.toString().trim()

    // Add the OMDb search parameters when values are provided.
    if (title) params.set('s', title)
    if (year) params.set('y', year)

    // Redirect to the movie results page with the search parameters.
    redirect(`/movies${params.size ? `?${params.toString()}` : ''}`)
}

export default function SearchForm() {
    return (
    <form action={searchMovies}>
        <label>
        Title:
        <input 
            type="text" 
            name="title" 
            placeholder="Search by title" 
            required
        />
        <input 
        type="number" 
            name="year" 
            min="1888"
            max={new Date().getFullYear()}
            placeholder={`1888 - ${new Date().getFullYear()}`}
        />
        </label>
        <button type="submit">Search Movies</button>
    </form>
    )
}