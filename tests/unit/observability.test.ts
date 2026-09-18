import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "@/lib/observability/request-context";
import { MetricsCollector } from "@/lib/observability/metrics";
import { Tracer } from "@/lib/observability/tracer";

describe("Observability System (F045)", () => {
  describe("RequestContext", () => {
    it("preserves incoming x-request-id and traceparent headers", () => {
      const req = new NextRequest("http://localhost:3000/api/chat", {
        headers: {
          "x-request-id": "req-custom-12345",
          "traceparent": "trace-custom-67890",
        },
      });

      const ctx = RequestContext.fromRequest(req);
      expect(ctx.requestId).toBe("req-custom-12345");
      expect(ctx.traceId).toBe("trace-custom-67890");
    });

    it("generates deterministic random request ID when header is missing", () => {
      const req = new NextRequest("http://localhost:3000/api/chat");
      const ctx = RequestContext.fromRequest(req);

      expect(ctx.requestId).toMatch(/^req_/);
      expect(ctx.traceId).toMatch(/^trace_/);
    });

    it("attaches correlation headers to outgoing NextResponse", () => {
      const ctx = {
        requestId: "req-alpha-1",
        traceId: "trace-alpha-1",
        startTime: Date.now() - 50,
      };

      const res = NextResponse.json({ ok: true });
      RequestContext.attachHeaders(res, ctx);

      expect(res.headers.get("X-Request-Id")).toBe("req-alpha-1");
      expect(res.headers.get("X-Trace-Id")).toBe("trace-alpha-1");
      expect(res.headers.get("X-Response-Time")).toMatch(/ms$/);
    });
  });

  describe("MetricsCollector", () => {
    let metrics: MetricsCollector;

    beforeEach(() => {
      metrics = new MetricsCollector();
    });

    it("records requests, calculates percentiles and aggregates status counts", () => {
      metrics.recordHttpRequest("GET", "/api/chat", 200, 20);
      metrics.recordHttpRequest("GET", "/api/chat", 200, 40);
      metrics.recordHttpRequest("POST", "/api/chat", 200, 60);
      metrics.recordHttpRequest("POST", "/api/chat", 500, 100);

      const snapshot = metrics.getMetricsSnapshot();
      expect(snapshot.totalRequests).toBe(4);
      expect(snapshot.requestsByStatus["2xx"]).toBe(3);
      expect(snapshot.requestsByStatus["5xx"]).toBe(1);
      expect(snapshot.httpLatency.min).toBe(20);
      expect(snapshot.httpLatency.max).toBe(100);
      expect(snapshot.httpLatency.p50).toBe(60);
    });

    it("formats metrics into Prometheus exposition text format", () => {
      metrics.recordHttpRequest("GET", "/api/projects", 200, 15);
      const text = metrics.toPrometheusFormat();

      expect(text).toContain("# HELP http_requests_total");
      expect(text).toContain('http_requests_total{status="2xx"} 1');
      expect(text).toContain("http_request_duration_ms_avg");
      expect(text).toContain("nodejs_heap_used_bytes");
    });
  });

  describe("Tracer", () => {
    let tracer: Tracer;

    beforeEach(() => {
      tracer = new Tracer();
    });

    it("measures execution duration and records attributes in span", async () => {
      const result = await tracer.traceSpan("retrieval_stage", async (span) => {
        span.setAttribute("candidates_count", 15);
        await new Promise((r) => setTimeout(r, 10));
        return { hits: 15 };
      });

      expect(result.hits).toBe(15);
      const spans = tracer.getRecentSpans();
      expect(spans.length).toBe(1);
      expect(spans[0]?.name).toBe("retrieval_stage");
      expect(spans[0]?.status).toBe("OK");
      expect(spans[0]?.durationMs).toBeGreaterThanOrEqual(5);
      expect(spans[0]?.attributes?.["candidates_count"]).toBe(15);
    });

    it("records error status when traced function throws", async () => {
      await expect(
        tracer.traceSpan("failing_stage", async () => {
          throw new Error("Simulated failure");
        }),
      ).rejects.toThrow("Simulated failure");

      const spans = tracer.getRecentSpans();
      expect(spans.length).toBe(1);
      expect(spans[0]?.status).toBe("ERROR");
      expect(spans[0]?.attributes?.["error"]).toContain("Simulated failure");
    });
  });
});
