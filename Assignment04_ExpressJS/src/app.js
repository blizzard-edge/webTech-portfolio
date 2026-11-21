require("dotenv").config();

const express = require("express");
const comicsRouter = require("./routes/comics");
const loggingMiddleware = require("./middleware/logging");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const stats = {
  totalRequests: 0,
  endpointStats: {},
  startTime: Date.now()
};

app.use(express.json());

// Provided middleware
app.use(loggingMiddleware);

// TODO: Add the statistics middleware here, after logging middleware.
// Requirements:
// - Increment stats.totalRequests
// - Track `${req.method} ${req.path}` in stats.endpointStats
// - Call next()
app.use((req, res, next) => {
  // Increment the total request count and track endpoint statistics.
  stats.totalRequests++;

  // Create an endpoint key using the HTTP method and request path.
  const endpoint = `${req.method} ${req.path}`;

  // Increment the request count for this endpoint.
  stats.endpointStats[endpoint] = (stats.endpointStats[endpoint] || 0) + 1;

  // Pass control to the next middleware or route handler.
  next();
});

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Comic API Documentation</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #222; }
        h1 { margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #f4f4f4; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
        a { color: #1565c0; }
        .method { font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Comic API</h1>
      <p>A RESTful API for retrieving and searching XKCD comics.</p>
      <h2>API Endpoints</h2>
      <table>
        <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td class="method">GET</td><td><a href="/api/health"><code>/api/health</code></a></td><td>Health check</td></tr>
          <tr><td class="method">GET</td><td><a href="/api/comics/latest"><code>/api/comics/latest</code></a></td><td>Get the latest comic</td></tr>
          <tr><td class="method">GET</td><td><code>/api/comics/:id</code></td><td>Get a comic by ID</td></tr>
          <tr><td class="method">GET</td><td><code>/api/comics/random</code></td><td>Get a random comic</td></tr>
          <tr><td class="method">GET</td><td><code>/api/comics/search?q=term&page=1&limit=10</code></td><td>Search comics</td></tr>
          <tr><td class="method">GET</td><td><a href="/api/stats"><code>/api/stats</code></a></td><td>View API usage statistics</td></tr>
        </tbody>
      </table>
      <h2>Search</h2>
      <p>Search recent XKCD comics by title or transcript.</p>
      <p>Example: <a href="/api/comics/search?q=python"><code>/api/comics/search?q=python</code></a></p>
      <h2>Technology</h2>
      <ul><li>Node.js</li><li>Express.js</li><li>XKCD JSON API</li><li>Winston</li></ul>
    </body>
    </html>
  `);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/comics", comicsRouter);

// TODO: Replace the 501 response with the statistics endpoint.
// Return totalRequests, endpointStats, and uptime.
app.get("/api/stats", (req, res) => {
  // Return API usage statistics, including total requests, endpoint counts, and uptime.
  res.json({ 
    // Total number of requests received since the server started.
    totalRequests: stats.totalRequests,

    // Number of requests received for each HTTP method and endpoint.
    endpointStats: stats.endpointStats,

    // Uptime in seconds since the server started.
    uptime: (Date.now() - stats.startTime) / 1000
  });
});

app.use(errorHandler);

module.exports = { app, stats };

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Comic API running on http://localhost:${port}`));
}
