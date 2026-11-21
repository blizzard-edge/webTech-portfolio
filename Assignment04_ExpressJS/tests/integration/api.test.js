const request = require("supertest");

jest.mock("../../src/services/xkcdService", () => ({
  getLatest: jest.fn(),
  getById: jest.fn(),
  getRandom: jest.fn(),
  search: jest.fn()
}));

const xkcdService = require("../../src/services/xkcdService");
const { app, stats } = require("../../src/app");

describe("Comic API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stats.totalRequests = 0;
    stats.endpointStats = {};
    stats.startTime = Date.now();
  });

  test("GET / returns HTML API documentation", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/html/);
    expect(response.text).toContain("Comic API Documentation");
    expect(response.text).toContain("/api/comics/search");
  });

  test("GET /api/health returns health information", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.timestamp).toBeDefined();
  });

  test("GET /api/comics/latest returns latest comic", async () => {
    xkcdService.getLatest.mockResolvedValue({ id: 300, title: "Latest" });

    const response = await request(app).get("/api/comics/latest");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(300);
    expect(xkcdService.getLatest).toHaveBeenCalledTimes(1);
  });

  test("GET /api/comics/:id parses the ID as an integer", async () => {
    xkcdService.getById.mockResolvedValue({ id: 42, title: "Test" });

    const response = await request(app).get("/api/comics/42");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(42);
    expect(xkcdService.getById).toHaveBeenCalledWith(42);
  });

  test("GET /api/comics/random returns a random comic", async () => {
    xkcdService.getRandom.mockResolvedValue({ id: 17, title: "Random" });

    const response = await request(app).get("/api/comics/random");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(17);
    expect(xkcdService.getRandom).toHaveBeenCalledTimes(1);
  });

  test("GET /api/comics/search uses default page and limit", async () => {
    xkcdService.search.mockResolvedValue({
      query: "python",
      results: [],
      total: 0,
      pagination: { page: 1, limit: 10, totalPages: 0 }
    });

    const response = await request(app)
      .get("/api/comics/search")
      .query({ q: "python" });

    expect(response.status).toBe(200);
    expect(xkcdService.search).toHaveBeenCalledWith("python", 1, 10);
  });

  test("GET /api/comics/search passes supplied pagination values", async () => {
    xkcdService.search.mockResolvedValue({
      query: "python",
      results: [],
      total: 0,
      pagination: { page: 2, limit: 5, totalPages: 0 }
    });

    const response = await request(app)
      .get("/api/comics/search")
      .query({ q: "python", page: 2, limit: 5 });

    expect(response.status).toBe(200);
    expect(xkcdService.search).toHaveBeenCalledWith("python", "2", "5");
  });

  test("GET /api/stats returns usage statistics", async () => {
    await request(app).get("/api/health");
    const response = await request(app).get("/api/stats");

    expect(response.status).toBe(200);
    expect(response.body.totalRequests).toBeDefined();
    expect(response.body.endpointStats).toBeDefined();
    expect(response.body.uptime).toEqual(expect.any(Number));
    expect(response.body.endpointStats["GET /api/health"]).toBe(1);
  });

  test("statistics middleware counts repeated endpoints", async () => {
    await request(app).get("/api/health");
    await request(app).get("/api/health");

    const response = await request(app).get("/api/stats");

    expect(response.body.endpointStats["GET /api/health"]).toBe(2);
  });

  test("service errors are passed to the error middleware", async () => {
    xkcdService.getById.mockRejectedValue(new Error("Comic not found"));

    const response = await request(app).get("/api/comics/999999");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Comic not found");
  });

  test("Invalid comic ID errors return 400", async () => {
    xkcdService.getById.mockRejectedValue(new Error("Invalid comic ID"));

    const response = await request(app).get("/api/comics/abc");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid comic ID");
  });

  test("unexpected errors return generic 500 response", async () => {
    xkcdService.getRandom.mockRejectedValue(new Error("Database secret"));

    const response = await request(app).get("/api/comics/random");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal server error");
    expect(JSON.stringify(response.body)).not.toContain("Database secret");
  });
});
