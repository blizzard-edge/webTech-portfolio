const axios = require("axios");

jest.mock("axios");

const {
  XKCDService,
  ValidationError
} = require("../../src/services/xkcdService");

describe("XKCDService", () => {
  let service;

  const comicData = (num, overrides = {}) => ({
    num,
    title: `Comic ${num}`,
    img: `https://imgs.xkcd.com/comics/${num}.png`,
    alt: `Alt ${num}`,
    transcript: `Transcript ${num}`,
    year: "2026",
    month: "9",
    day: "22",
    ...overrides
  });

  beforeEach(() => {
    service = new XKCDService();
    service.cacheTimeout = 60_000;
    jest.clearAllMocks();
  });

  describe("getById", () => {
    test("rejects zero as an invalid comic ID", async () => {
      await expect(service.getById(0)).rejects.toThrow("Invalid comic ID");
    });

    test.each([-1, 1.5, NaN, "abc", null, undefined])(
      "rejects invalid ID %p",
      async (id) => {
        await expect(service.getById(id)).rejects.toThrow("Invalid comic ID");
      }
    );

    test("accepts a positive integer", async () => {
      axios.get.mockResolvedValueOnce({ data: comicData(123) });

      const result = await service.getById(123);

      expect(result.id).toBe(123);
      expect(axios.get).toHaveBeenCalledWith(
        "https://xkcd.com/123/info.0.json"
      );
    });

    test("returns the processed comic object", async () => {
      axios.get.mockResolvedValueOnce({
        data: comicData(123, {
          title: "Test Comic",
          transcript: "A transcript",
          alt: "An alt"
        })
      });

      const result = await service.getById(123);

      expect(result).toEqual({
        id: 123,
        title: "Test Comic",
        image: "https://imgs.xkcd.com/comics/123.png",
        alt: "An alt",
        transcript: "A transcript",
        date: "2026-9-22",
        link: "https://xkcd.com/123/"
      });
    });

    test("uses the comic cache on repeated requests", async () => {
      axios.get.mockResolvedValueOnce({ data: comicData(123) });

      await service.getById(123);
      await service.getById(123);

      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    test("uses the required cache key", async () => {
      axios.get.mockResolvedValueOnce({ data: comicData(123) });

      await service.getById(123);

      expect(service.cache.has("comic-123")).toBe(true);
    });

    test("does not use an expired cache entry", async () => {
      service.cacheTimeout = 10;
      axios.get
        .mockResolvedValueOnce({ data: comicData(123, { title: "Old" }) })
        .mockResolvedValueOnce({ data: comicData(123, { title: "New" }) });

      await service.getById(123);
      service.cache.get("comic-123").timestamp = Date.now() - 100;
      const result = await service.getById(123);

      expect(result.title).toBe("New");
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    test("converts HTTP 404 into Comic not found", async () => {
      axios.get.mockRejectedValueOnce({
        response: { status: 404 },
        message: "Request failed"
      });

      await expect(service.getById(99999999)).rejects.toThrow("Comic not found");
    });

    test("handles other HTTP errors as operational errors", async () => {
      axios.get.mockRejectedValueOnce({
        response: { status: 500 },
        message: "Server error"
      });

      await expect(service.getById(123)).rejects.toMatchObject({
        isOperational: true,
        statusCode: 502
      });
    });

    test("handles network errors as operational errors", async () => {
      axios.get.mockRejectedValueOnce(new Error("Network failure"));

      await expect(service.getById(123)).rejects.toMatchObject({
        isOperational: true,
        statusCode: 503
      });
    });
  });

  describe("getRandom", () => {
    test("gets the latest comic before selecting a random ID", async () => {
      jest.spyOn(service, "getLatest").mockResolvedValue({ id: 100 });
      jest.spyOn(service, "getById").mockResolvedValue({ id: 26 });
      const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.25);

      await service.getRandom();

      expect(service.getLatest).toHaveBeenCalledTimes(1);
      expect(service.getById).toHaveBeenCalledWith(26);
      randomSpy.mockRestore();
    });

    test("generates a random ID between 1 and latest.id", async () => {
      jest.spyOn(service, "getLatest").mockResolvedValue({ id: 10 });
      jest.spyOn(service, "getById").mockResolvedValue({ id: 10 });
      const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.9999);

      await service.getRandom();

      expect(service.getById).toHaveBeenCalledWith(10);
      randomSpy.mockRestore();
    });

    test("propagates errors from getById", async () => {
      jest.spyOn(service, "getLatest").mockResolvedValue({ id: 10 });
      jest.spyOn(service, "getById").mockRejectedValue(new Error("Comic not found"));

      await expect(service.getRandom()).rejects.toThrow("Comic not found");
    });
  });

  describe("search", () => {
    test("rejects a missing query", async () => {
      await expect(service.search()).rejects.toBeInstanceOf(ValidationError);
    });

    test("rejects an empty query", async () => {
      await expect(service.search("   ")).rejects.toThrow();
    });

    test("rejects a query longer than 100 characters", async () => {
      await expect(service.search("a".repeat(101))).rejects.toThrow();
    });

    test("validates page and limit", async () => {
      await expect(service.search("test", 0, 10)).rejects.toThrow();
      await expect(service.search("test", 1, 0)).rejects.toThrow();
      await expect(service.search("test", 1, 101)).rejects.toThrow();
    });

    test("searches the most recent 100 comics", async () => {
      jest.spyOn(service, "getLatest").mockResolvedValue({ id: 200 });
      const getById = jest.spyOn(service, "getById").mockImplementation(async (id) => ({
        id,
        title: "No match",
        transcript: "No match"
      }));

      await service.search("python");

      expect(getById).toHaveBeenCalledTimes(100);
      expect(getById).toHaveBeenCalledWith(200);
      expect(getById).toHaveBeenCalledWith(101);
    });

    test("matches query against title case-insensitively", async () => {
      jest.spyOn(service, "getLatest").mockResolvedValue({ id: 3 });
      jest.spyOn(service, "getById").mockImplementation(async (id) => ({
        id,
        title: id === 3 ? "JavaScript Tips" : "Other",
        transcript: "Nothing relevant"
      }));

      const result = await service.search("javascript");

      expect(result.total).toBe(1);
      expect(result.results[0].id).toBe(3);
    });

    test("matches query against transcript case-insensitively", async () => {
      jest.spyOn(service, "getLatest").mockResolvedValue({ id: 2 });
      jest.spyOn(service, "getById").mockImplementation(async (id) => ({
        id,
        title: "Other",
        transcript: id === 2 ? "The PYTHON example" : "Nothing"
      }));

      const result = await service.search("python");

      expect(result.total).toBe(1);
      expect(result.results[0].id).toBe(2);
    });

    test("returns pagination information", async () => {
      jest.spyOn(service, "getLatest").mockResolvedValue({ id: 4 });
      jest.spyOn(service, "getById").mockImplementation(async (id) => ({
        id,
        title: "match",
        transcript: "match"
      }));

      const result = await service.search("match", 2, 2);

      expect(result.query).toBe("match");
      expect(result.total).toBe(4);
      expect(result.results).toHaveLength(2);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(2);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.hasPrevious).toBe(true);
      expect(result.pagination.hasNext).toBe(false);
    });

    test("continues searching when a recent comic is missing", async () => {
      jest.spyOn(service, "getLatest").mockResolvedValue({ id: 3 });
      jest.spyOn(service, "getById").mockImplementation(async (id) => {
        if (id === 2) throw new Error("Comic not found");
        return { id, title: "match", transcript: "" };
      });

      const result = await service.search("match");

      expect(result.total).toBe(2);
    });
  });

  describe("getLatest", () => {
    test("fetches and caches the latest comic", async () => {
      axios.get.mockResolvedValueOnce({ data: comicData(300) });

      const first = await service.getLatest();
      const second = await service.getLatest();

      expect(first.id).toBe(300);
      expect(second.id).toBe(300);
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith("https://xkcd.com/info.0.json");
    });
  });
});
