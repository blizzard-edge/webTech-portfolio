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
* Modified the official example to support CineView's OMDb filtering parameters.
*/

// Handles movie search form submissions.
async function filterMovies(formData: FormData) {
    'use server'

    // Create URL parameters for the movie filter.
    const params = new URLSearchParams()

    // Retrieve and clean the submitted form values.
    const title = formData.get('title')?.toString().trim()
    const year = formData.get('year')?.toString().trim()
    const type = formData.get('type')?.toString()

    // Add the OMDb filter parameters when values are provided.
    if (title) params.set('s', title)
    if (year) params.set('y', year)
    if (type) params.set('type', type)

    // Redirect to the movie results page with the filtering parameters.
    redirect(`/movies${params.size ? `?${params.toString()}` : ''}`)
}

export default function FilterForm() {
    return (
    <form action={filterMovies}>
        <label>
        Title:
        <input 
            type="text" 
            name="title" 
            placeholder="Enter a title" 
            required
        />
        </label>
        <label>
        Year:
        <input
            type="number"
            name="year"
            min="1888"
            max={new Date().getFullYear()}
            placeholder={`1888 - ${new Date().getFullYear()}`}
        />
        </label>
        <label>
        Type:
        <select name="type" defaultValue="movie">
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
        </select>
        </label>
        <button type="submit">Search</button>
    </form>
    )
}
