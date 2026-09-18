import { describe, it, expect, beforeEach } from "vitest";
import { CacheService } from "@/lib/cache/cache-service";

describe("CacheService (F043)", () => {
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService();
  });

  it("stores and retrieves a cached value", () => {
    cache.set("test:1", { name: "Anas" }, { ttlMs: 5000, tags: ["content"] });
    const result = cache.get<{ name: string }>("test:1");
    expect(result).toEqual({ name: "Anas" });
  });

  it("returns null and records a miss for non-existent key", () => {
    const result = cache.get("non-existent");
    expect(result).toBeNull();
    const stats = cache.getStats();
    expect(stats.misses).toBe(1);
    expect(stats.hits).toBe(0);
  });

  it("expires cached value after TTL", async () => {
    cache.set("short:key", "value", { ttlMs: 15 });
    expect(cache.get("short:key")).toBe("value");

    await new Promise((resolve) => setTimeout(resolve, 25));

    expect(cache.get("short:key")).toBeNull();
  });

  it("getOrSet caches factory results on first call and avoids factory on second call", async () => {
    let callCount = 0;
    const factory = async () => {
      callCount++;
      return { answer: 42 };
    };

    const first = await cache.getOrSet("calc:key", factory, { ttlMs: 5000, tags: ["ai"] });
    const second = await cache.getOrSet("calc:key", factory, { ttlMs: 5000, tags: ["ai"] });

    expect(first).toEqual({ answer: 42 });
    expect(second).toEqual({ answer: 42 });
    expect(callCount).toBe(1);
  });

  it("invalidates all keys associated with a specific tag", () => {
    cache.set("proj:1", { id: "1" }, { tags: ["projects"] });
    cache.set("proj:2", { id: "2" }, { tags: ["projects"] });
    cache.set("sec:hero", { title: "Hero" }, { tags: ["content"] });

    const count = cache.invalidateTag("projects");
    expect(count).toBe(2);

    expect(cache.get("proj:1")).toBeNull();
    expect(cache.get("proj:2")).toBeNull();
    expect(cache.get("sec:hero")).toEqual({ title: "Hero" });
  });

  it("invalidates multiple tags simultaneously", () => {
    cache.set("proj:1", "p1", { tags: ["projects"] });
    cache.set("cv:1", "c1", { tags: ["cv"] });
    cache.set("ai:1", "a1", { tags: ["ai"] });

    const count = cache.invalidateTags(["projects", "cv"]);
    expect(count).toBe(2);

    expect(cache.get("proj:1")).toBeNull();
    expect(cache.get("cv:1")).toBeNull();
    expect(cache.get("ai:1")).toBe("a1");
  });

  it("clears entire cache completely", () => {
    cache.set("k1", "v1", { tags: ["content"] });
    cache.set("k2", "v2", { tags: ["projects"] });

    cache.clear();
    const stats = cache.getStats();

    expect(stats.totalKeys).toBe(0);
    expect(stats.tagsCount).toBe(0);
  });

  it("calculates accurate telemetry statistics and hit rate", () => {
    cache.set("key:1", "val");
    cache.get("key:1"); // hit 1
    cache.get("key:1"); // hit 2
    cache.get("key:missing"); // miss 1

    const stats = cache.getStats();
    expect(stats.hits).toBe(2);
    expect(stats.misses).toBe(1);
    expect(stats.hitRate).toBe(0.6667);
  });

  it("lists keys with optional tag filtering and search filtering", () => {
    cache.set("projects:slug-1", "data1", { tags: ["projects"] });
    cache.set("projects:slug-2", "data2", { tags: ["projects"] });
    cache.set("content:home", "data3", { tags: ["content"] });

    const allKeys = cache.listKeys();
    expect(allKeys.length).toBe(3);

    const projectKeys = cache.listKeys({ tag: "projects" });
    expect(projectKeys.length).toBe(2);

    const searchedKeys = cache.listKeys({ search: "slug-1" });
    expect(searchedKeys.length).toBe(1);
    expect(searchedKeys[0]?.key).toBe("projects:slug-1");
  });
});
