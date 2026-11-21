# Comic API Assignment

A RESTful API built with Express.js that serves [XKCD comics](https://xkcd.com/) with search functionality, caching, and usage statistics.

> **Student Instructions:** Read this document carefully before beginning the assignment. The repository contains a partially implemented application. Your task is to complete the TODO sections while keeping the existing project structure and tests working.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Implementation Requirements](#implementation-requirements)
- [API Endpoints Overview](#api-endpoints-overview)
- [Testing Strategy](#testing-strategy)
- [Implementation Tips](#implementation-tips)
- [Common Issues and Solutions](#common-issues-and-solutions)
- [Grading Rubric](#grading-rubric)
- [Submission Checklist](#submission-checklist)
- [Resources](#resources)
- [Support](#support)

---

# Setup Instructions

## 1. Clone and Install

```bash
git clone <repository-url>
cd comic-api-assignment
pnpm install
```

## 2. Environment Configuration

```bash
cp .env.example .env
# Edit .env file if needed
```

## 3. Start Development Server

```bash
pnpm run dev
```

Server will run on [http://localhost:3000](http://localhost:3000).

## 4. Run Tests

```bash
pnpm test
pnpm run test:watch
pnpm run test:coverage
```

---

# Project Structure

```text
comic-api-assignment/
├── .github/
│   └── workflows/
│       └── test.yml
├── src/
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── logging.js
│   ├── routes/
│   │   └── comics.js
│   ├── services/
│   │   └── xkcdService.js
│   └── app.js
├── tests/
│   ├── fixtures/
│   │   └── xkcd-comic.json
│   ├── integration/
│   │   └── api.test.js
│   └── unit/
│       └── xkcdService.test.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

You should primarily work in the files containing TODO comments.

---

# Implementation Requirements

This assignment requires implementing several key features:

- Health check endpoint **(provided)**
- Get latest comic endpoint **(provided)**
- Get comic by ID endpoint **(TODO)**
- Random comic endpoint **(TODO)**
- Comic search functionality **(TODO)**
- API usage statistics **(TODO)**
- Error handling middleware **(TODO)**
- Request logging middleware **(TODO)**

## 1. Complete XKCDService Methods

File:

```text
src/services/xkcdService.js
```

### `async getById(id)`

#### Validation requirements

- `id` must be a positive integer.
- Throw `"Invalid comic ID"` for invalid inputs.

#### Implementation requirements

1. Check the cache first using key:

```text
comic-${id}
```

2. Fetch from:

```text
https://xkcd.com/${id}/info.0.json
```

3. Handle 404 errors by throwing:

```text
Comic not found
```

4. Handle other HTTP errors appropriately.
5. Cache successful responses.
6. Return the processed comic object.

### `async getRandom()`

Implementation requirements:

1. Get the latest comic to determine the maximum ID.
2. Generate a random number between `1` and `latest.id`.
3. Use `getById()` to fetch the random comic.
4. Handle errors from `getById()` appropriately.

### `async search(query, page = 1, limit = 10)`

Implementation requirements:

1. Validate the query parameter.
   - Query must be provided.
   - Query length must be between 1 and 100 characters.
2. Calculate the offset:

```text
(page - 1) * limit
```

3. Search recent comics — the most recent 100 comics.
4. Match against:
   - comic title
   - comic transcript
5. Matching must be case-insensitive.
6. Return an object containing:

```javascript
{
  query,
  results: [],
  total,
  pagination: {}
}
```

7. Handle errors gracefully.

The pagination object should contain useful pagination information such as page, limit, total pages, and whether next/previous pages exist.

---

# 2. Complete Route Handlers

File:

```text
src/routes/comics.js
```

### GET `/api/comics/:id`

- Remove the existing 501 response.
- Parse `req.params.id` to an integer.
- Call:

```javascript
xkcdService.getById(parsedId)
```

- Return the comic as JSON.
- Pass errors to the error middleware using `next(error)`.

### GET `/api/comics/random`

- Remove the existing 501 response.
- Call:

```javascript
xkcdService.getRandom()
```

- Return the comic as JSON.
- Pass errors to the error middleware.

### GET `/api/comics/search`

- Remove the existing 501 response.
- from `req.query` Extract:
  - `q`
  - `page`
  - `limit`
- Set Defaults:

```text
page = 1
limit = 10
```

- Call:

```javascript
xkcdService.search(q, page, limit)
```

- Return search results as JSON.
- Pass errors to the error middleware.

---

# 3. Complete Middleware

## Logging Middleware

File:

```text
src/middleware/logging.js
```

Implementation requirements:

### Generate a unique request ID

Use:

```javascript
Math.random().toString(36).substr(2, 9)
```

### Store request information

Set:

```javascript
req.requestId
req.startTime = Date.now()
```

### Log incoming requests

Use Winston and include:

- `requestId`
- `method`
- `url`
- `ip`
- `userAgent`

Then call:

```javascript
next()
```

to continue processing the request.

---

## Error Handler

File:

```text
src/middleware/errorHandler.js
```

The error handler must support the following error types.

### 1. ValidationError

Return:

```text
HTTP 400
```

and include the validation message.

### 2. `"Comic not found"`

Return:

```text
HTTP 404
```

with a user-friendly error message.

### 3. `"Invalid comic ID"`

Return:

```text
HTTP 400
```

with a validation message.

### 4. Operational errors

If:

```javascript
err.isOperational === true
```

use:

```javascript
err.statusCode
```

as the HTTP status code.

### 5. Unexpected errors

Return:

```text
HTTP 500
```

with a generic message.

**Do not expose internal error details to API clients.**

### Error logging

Always log errors with:

- message
- stack
- URL
- HTTP method
- request ID

---

# 4. Add Statistics Tracking

File:

```text
src/app.js
```

Add the statistics middleware **after the logging middleware**.

The middleware should:

```javascript
app.use((req, res, next) =&gt; {
  stats.totalRequests++;
  const endpoint = `${req.method} ${req.path}`;
  stats.endpointStats[endpoint] = (stats.endpointStats[endpoint] || 0) + 1;
  next();
});
```

## Statistics Endpoint

Replace the existing 501 response in GET /api/stats with:

```javascript
app.get('/api/stats', (req, res) =&gt; {
  res.json({
    totalRequests: stats.totalRequests,
    endpointStats: stats.endpointStats,
    uptime: (Date.now() - stats.startTime) / 1000
  });
});
```

---

# API Endpoints Overview

| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | `/api/health` | Health check | ✅ Complete |
| GET | `/api/comics/latest` | Get latest comic | ✅ Complete |
| GET | `/api/comics/:id` | Get comic by ID | ❌ TODO |
| GET | `/api/comics/random` | Get random comic | ❌ TODO |
| GET | `/api/comics/search` | Search comics | ❌ TODO |
| GET | `/api/stats` | API statistics | ❌ TODO |
| GET | `/` | Documentation | ✅ Complete |

> **Important:** `/api/comics/random` and `/api/comics/search` should be defined before `/api/comics/:id` in the Express router so that `"random"` and `"search"` are not interpreted as comic IDs.

---

# Testing Strategy

Your implementation will be tested against:

## Integration Tests

File:

```text
tests/integration/api.test.js
```

Tests include:

- endpoint functionality
- error handling
- HTTP status codes
- request validation
- response formats
- statistics

## Unit Tests

File:

```text
tests/unit/xkcdService.test.js
```

Tests include:

- service method implementations
- caching behavior
- error handling
- input validation

## Running Tests

Run all tests:

```bash
pnpm test
```

Run a specific test file:

```bash
npx jest tests/integration/api.test.js
```

```bash
npx jest tests/unit/xkcdService.test.js
```

Run tests matching a pattern:

```bash
npx jest --testNamePattern="latest comic"
```

```bash
npx jest --testNamePattern="getById"
```

Run with verbose output:

```bash
pnpm test -- --verbose
```

Run and watch for changes:

```bash
pnpm run test:watch
```

Run coverage:

```bash
pnpm run test:coverage
```

---

# Implementation Tips

## Start Here

A recommended implementation order is:

1. Begin with `xkcdService.getById()` — many features depend on it.
2. Implement error handling early so debugging is easier.
3. Test each method individually.
4. Implement `getRandom()`.
5. Implement search.
6. Complete the route handlers.
7. Complete logging and error middleware.
8. Add statistics tracking.
9. Run the full test suite.

## Error Handling Pattern

A service may throw an error:

```javascript
if (!id || isNaN(id) || id < 1) {
  throw new Error("Invalid comic ID");
}
```

A route should pass errors to the middleware:

```javascript
try {
  const result = await service.method();
  res.json(result);
} catch (error) {
  next(error);
}
```

## Caching Pattern

A typical cache implementation uses:

```javascript
const cacheKey = `comic-${id}`;
const cached = this.cache.get(cacheKey);

if (
  cached &&
  Date.now() - cached.timestamp < this.cacheTimeout
) {
  return cached.data;
}
```

Remember to cache successful API responses.

---

# Common Issues and Solutions

## "Method not implemented" errors

Remove:

```javascript
throw new Error("method not implemented");
```

and replace it with your implementation.

## Validation errors

Check:

- input validation
- error messages
- error middleware
- HTTP status codes

## 404 / 500 errors

Verify that:

- the correct error is being thrown
- the error middleware is registered after the routes
- error messages match the expected behavior
- unexpected errors do not expose internal details

## Cache issues

Check that:

- cache keys are consistent
- timestamps are stored
- expired entries are not returned
- repeated requests can use cached data

## Route ordering issues

Express routes are matched in order.

Make sure these routes appear before:

```text
/:id
```

```text
/random
/search
```

Otherwise Express may interpret `"random"` or `"search"` as the `id` parameter.

---

# XKCD API Issues

## Rate limiting

The XKCD API is an external service. Use caching to reduce unnecessary API requests.

## Missing comics

Some comic IDs may not exist. A 404 response should be converted to:

```text
Comic not found
```

## Network failures

Network or external API failures should be handled by the service and passed to the error middleware.

---

# Grading Rubric

| Category | Weight | Criteria |
|---|---:|---|
| **Functionality** | 40% | All endpoints return expected responses, proper HTTP status codes, error handling works correctly, and caching is implemented |
| **Code Quality** | 25% | Clean, readable code, proper async/await usage, consistent error handling, and following the provided project patterns |
| **Testing** | 20% | Tests pass and edge cases are handled |
| **Documentation** | 15% | Code comments where needed, API documentation accessible, and README instructions followed |

---

# Submission Checklist

Before submitting, verify all of the following:

- [ ] All tests pass with `pnpm test`
- [ ] Server starts without errors with `pnpm start`
- [ ] API documentation is accessible at `http://localhost:3000`
- [ ] All TODO comments have been replaced with implementations
- [ ] Error handling works for invalid inputs
- [ ] Caching reduces repeated API calls
- [ ] Statistics tracking is functional
- [ ] Search supports pagination
- [ ] Search is case-insensitive
- [ ] Random comic selection works
- [ ] Unexpected errors do not expose internal details
- [ ] No unnecessary debugging `console.log()` statements remain

---

# Resources

- [Express.js Documentation](https://expressjs.com/)
- [XKCD JSON API Documentation](https://xkcd.com/json.html)
- [Express Validator](https://express-validator.github.io/)
- [Winston Logging](https://github.com/winstonjs/winston)
- [Jest Testing Framework](https://jestjs.io/)
- [Supertest](https://github.com/ladjs/supertest)

---

# Support

If you encounter issues:

1. Check the test error messages for guidance.
2. Review the provided code patterns.
3. Verify your implementation matches the requirements.
4. Use `console.log()` temporarily for debugging, then remove it before submission.
5. Test individual methods before running the full test suite.
6. Read the relevant test cases to understand the expected behavior.

**Remember:** The tests are designed to guide your implementation. Use test failures as feedback to understand what is expected.

## Academic Integrity

You may use documentation and approved learning resources to understand the technologies used in this assignment. Your submitted implementation should reflect your own understanding of the concepts and should comply with your instructor's course policies regarding AI-assisted development.
