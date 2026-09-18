import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST as jobFitRoute } from "@/app/api/job-fit/route";
import { jobFitService } from "@/ai/job-fit/job-fit-service";

describe("Job Fit API Route POST /api/job-fit (F034)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects invalid payloads with status 400 when job description is too short", async () => {
    const req = new NextRequest("http://localhost/api/job-fit", {
      method: "POST",
      body: JSON.stringify({
        jobDescription: "Too short",
      }),
    });

    const res = await jobFitRoute(req);
    expect(res.status).toBe(400);

    const json = (await res.json()) as { success: boolean; error: string };
    expect(json.success).toBe(false);
    expect(json.error).toContain("Invalid job description");
  });

  it("successfully processes valid job description and returns structured match result", async () => {
    vi.spyOn(jobFitService, "analyze").mockResolvedValueOnce({
      summary: {
        totalRequirements: 2,
        supportedCount: 2,
        partiallySupportedCount: 0,
        notFoundCount: 0,
        matchScore: 100,
        overview: "Complete match for full-stack role.",
        strengths: ["TypeScript", "Next.js"],
        gapsOrConsiderations: [],
      },
      requirements: [
        {
          id: "req-1",
          requirement: "Next.js and React expertise",
          status: "supported",
          confidence: 0.96,
          explanation: "Evidenced by portfolio architecture.",
          citations: [
            {
              sourceId: "proj-1",
              sourceType: "project",
              title: "AI Portfolio",
            },
          ],
        },
      ],
      telemetry: {
        retrievedCount: 5,
        rerankedCount: 3,
        tokenCount: 150,
        durationMs: 40,
        language: "en",
      },
    });

    const req = new NextRequest("http://localhost/api/job-fit", {
      method: "POST",
      body: JSON.stringify({
        jobDescription:
          "We are seeking a Senior Full-Stack Engineer with deep Next.js and React expertise to build modern web systems.",
        locale: "en",
      }),
    });

    const res = await jobFitRoute(req);
    expect(res.status).toBe(200);

    const json = (await res.json()) as {
      success: boolean;
      data: {
        summary: { matchScore: number };
        requirements: Array<{ requirement: string }>;
      };
    };

    expect(json.success).toBe(true);
    expect(json.data.summary.matchScore).toBe(100);
    expect(json.data.requirements[0]?.requirement).toBe("Next.js and React expertise");
  });

  it("handles unexpected service exceptions returning HTTP 500 without leaking sensitive data", async () => {
    vi.spyOn(jobFitService, "analyze").mockRejectedValueOnce(new Error("Database connection lost"));

    const req = new NextRequest("http://localhost/api/job-fit", {
      method: "POST",
      body: JSON.stringify({
        jobDescription:
          "Looking for an engineering leader with deep systems experience in distributed architectures.",
      }),
    });

    const res = await jobFitRoute(req);
    expect(res.status).toBe(500);

    const json = (await res.json()) as { success: boolean; error: string };
    expect(json.success).toBe(false);
    expect(json.error).toBe("Internal server error occurred while analyzing job alignment");
  });
});
