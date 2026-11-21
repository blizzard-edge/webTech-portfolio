# GroupProject
**Project Name & Description:**  What the project is and what problem it solves

  CineView is a full-stack movie and television discovery application that uses the OMDb API to help users search and explore movies and shows.
  
  The application provides a simple interface for searching titles and filtering results by release year and media type. Its goal is to make discovering and exploring entertainment easier through an accessible, responsive web application.
  
---------------------------------------------------------------

**Live Demo / Screenshots:** Link to live site or visual preview

  *  N/A currently

---------------------------------------------------------------
**Tech Stack:** Core tools, frameworks, and languages used 

  *  Next.js: React framework for full-stack application development.
  *  React: Component-based user interface development.
  *  Typescript: Static typing and improved code maintainability.
  *  HeroUI: UI component library.
  *  Tailwind CSS: Utility-first CSS framework
  *  pnpm: Package management.
  *  OMDb API: Movie and show information.
  *  Render: Application hosting and deployment.

---------------------------------------------------------------
**Prerequisites:** System requirements (e.g., Node.js version, database setup)

  * Node.js 20.9 or later
  * pnpm package manager
  * An OMDb API key, available from http://www.omdbapi.com/
  * Git for cloning the repository

---------------------------------------------------------------
**Installation & Setup:** Commands to clone the repo and install dependencies

  1.  Clone the repository: 
    
    git clone <repository-url>
        
  2.  Navigate to the project directory:

    cd <project-directory>
      
  3.  Install dependencies: 
    
    pnpm install
      
  4.  Create a .env.local file in the project root and configure the required environment variables.

---------------------------------------------------------------
 **Environment Variables:** Required .env keys (without secret values)
 
CineView requires an OMDb API key to retrieve movie and television information.
  1.  Create a .env.local file in the root directory: 
    
    OMDB_API_KEY=your_api_key_here
      
  2.  Replace your_api_key_here with your own OMDb API key.
  3.  Important: Do not commit .env.local or expose your API key in client-side code.

---------------------------------------------------------------
**Usage / Running Locally:** Command to start the development server

  1.  Start the development server: pnpm dev
  2.  Open http://localhost:3000 in your browser to access CineView.
 
Building / Deployment
  1.  To create a production build: 
      
    pnpm build

  2.  To run the production build locally:

    pnpm start
            
---------------------------------------------------------------
**Building / Deployment:** Commands for production build and hosting steps

CineView is intended to be deployed using Render.
  
  1.  Connect the project repository to Render.
  2.  Configure the appropriate Node.js environment.
  3.  Set the build command to pnpm install && pnpm build.
  4.  Set the start command to pnpm start.
  5.  Add OMDB_API_KEY to the environment variables in the Render dashboard.
  6.  Deploy the application.
