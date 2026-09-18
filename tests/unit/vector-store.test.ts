import { describe, it, expect, beforeEach } from "vitest";
import { QdrantVectorStore } from "@/lib/qdrant/vector-store";

describe("Vector Store Adapter (F022)", () => {
  let store: QdrantVectorStore;
  const collectionName = "test_collection";

  beforeEach(async () => {
    store = new QdrantVectorStore({ forceInMemory: true });
    await store.createCollectionIfNotExists(collectionName, 4);
    store.clearInMemoryStore(collectionName);
  });

  it("creates collection and retrieves info", async () => {
    const info = await store.getCollectionInfo(collectionName);
    expect(info).not.toBeNull();
    expect(info?.pointsCount).toBe(0);
    expect(info?.status).toBe("green");
  });

  it("upserts points and verifies points count", async () => {
    await store.upsertPoints(collectionName, [
      {
        id: "pt-1",
        vector: [1, 0, 0, 0],
        payload: { title: "First Point", sourceType: "project" },
      },
      {
        id: "pt-2",
        vector: [0, 1, 0, 0],
        payload: { title: "Second Point", sourceType: "cv" },
      },
    ]);

    const info = await store.getCollectionInfo(collectionName);
    expect(info?.pointsCount).toBe(2);
  });

  it("performs cosine similarity search accurately", async () => {
    await store.upsertPoints(collectionName, [
      {
        id: "pt-exact",
        vector: [1, 0, 0, 0],
        payload: { name: "Exact Match" },
      },
      {
        id: "pt-orthogonal",
        vector: [0, 1, 0, 0],
        payload: { name: "Orthogonal" },
      },
      {
        id: "pt-partial",
        vector: [0.7071, 0.7071, 0, 0],
        payload: { name: "Partial Match" },
      },
    ]);

    // Query along [1, 0, 0, 0]
    const results = await store.search(collectionName, [1, 0, 0, 0], 3);
    expect(results).toHaveLength(3);

    // Exact match should have score ~1.0
    expect(results[0]?.id).toBe("pt-exact");
    expect(results[0]?.score).toBeCloseTo(1.0, 3);

    // Partial match should be second
    expect(results[1]?.id).toBe("pt-partial");
    expect(results[1]?.score).toBeCloseTo(0.7071, 3);

    // Orthogonal should be last with score 0
    expect(results[2]?.id).toBe("pt-orthogonal");
    expect(results[2]?.score).toBeCloseTo(0.0, 3);
  });

  it("applies metadata filters during search", async () => {
    await store.upsertPoints(collectionName, [
      {
        id: "doc-1",
        vector: [1, 0, 0, 0],
        payload: { sourceType: "project", tag: "ai" },
      },
      {
        id: "doc-2",
        vector: [0.99, 0.01, 0, 0],
        payload: { sourceType: "cv", tag: "ai" },
      },
      {
        id: "doc-3",
        vector: [0.95, 0.05, 0, 0],
        payload: { sourceType: "project", tag: "web" },
      },
    ]);

    // Search only for sourceType = "project"
    const results = await store.search(collectionName, [1, 0, 0, 0], 10, {
      must: [{ key: "sourceType", match: { value: "project" } }],
    });

    expect(results).toHaveLength(2);
    results.forEach((r) => {
      expect(r.payload?.["sourceType"]).toBe("project");
    });
  });

  it("deletes points by ID", async () => {
    await store.upsertPoints(collectionName, [
      { id: "pt-del-1", vector: [1, 0, 0, 0], payload: {} },
      { id: "pt-del-2", vector: [0, 1, 0, 0], payload: {} },
    ]);

    await store.deletePoints(collectionName, ["pt-del-1"]);
    const info = await store.getCollectionInfo(collectionName);
    expect(info?.pointsCount).toBe(1);

    const searchRes = await store.search(collectionName, [1, 0, 0, 0], 10);
    expect(searchRes.some((p) => p.id === "pt-del-1")).toBe(false);
  });

  it("deletes points by filter key and value", async () => {
    await store.upsertPoints(collectionName, [
      { id: "p1", vector: [1, 0, 0, 0], payload: { docId: "doc-abc" } },
      { id: "p2", vector: [0, 1, 0, 0], payload: { docId: "doc-abc" } },
      { id: "p3", vector: [0, 0, 1, 0], payload: { docId: "doc-xyz" } },
    ]);

    await store.deleteByFilter(collectionName, "docId", "doc-abc");
    const info = await store.getCollectionInfo(collectionName);
    expect(info?.pointsCount).toBe(1);

    const remaining = await store.search(collectionName, [0, 0, 1, 0], 10);
    expect(remaining[0]?.id).toBe("p3");
  });
});
