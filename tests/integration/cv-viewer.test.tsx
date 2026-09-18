import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CvViewer } from "@/modules/cv/presentation";
import { BASELINE_PUBLISHED_CV } from "@/modules/cv/infrastructure/cv-service";
import { LocalizationProvider } from "@/modules/localization/presentation/localization-provider";
import { AdminEditProvider } from "@/modules/admin/presentation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
  }),
}));

describe("CV Viewer & Presentation Integration (F014)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders CV viewer with published metadata and direct download action for guests", () => {
    render(
      <LocalizationProvider
        locale="en"
        dictionary={{
          "cv.title": "Curriculum Vitae",
          "cv.subtitle": "View and download the latest verified resume",
          "cv.download": "Download Resume (PDF)",
          "cv.open_fullscreen": "Open in New Window",
          "cv.version_label": "Version {version}",
          "cv.filesize_label": "Size: {size}",
          "cv.published_date": "Published: {date}",
        }}
      >
        <AdminEditProvider isAdmin={false}>
          <CvViewer cv={BASELINE_PUBLISHED_CV} locale="en" />
        </AdminEditProvider>
      </LocalizationProvider>,
    );

    // Title and Subtitle
    expect(screen.getByRole("heading", { name: "Curriculum Vitae" })).toBeInTheDocument();
    expect(screen.getByText("View and download the latest verified resume")).toBeInTheDocument();

    // Version and file size badges
    expect(screen.getAllByText("Version 1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Size: 462.0 KB")).toBeInTheDocument();

    // Download buttons exist and link to download endpoint
    const downloadLinks = screen.getAllByRole("link", { name: /download resume/i });
    expect(downloadLinks.length).toBeGreaterThanOrEqual(1);
    expect(downloadLinks[0]).toHaveAttribute("href", "/api/cv/download?download=1");

    // Open fullscreen link points to view endpoint
    const openLinks = screen.getAllByRole("link", { name: /open in new window/i });
    expect(openLinks.length).toBeGreaterThanOrEqual(1);
    expect(openLinks[0]).toHaveAttribute("href", "/api/cv/download");
    expect(openLinks[0]).toHaveAttribute("target", "_blank");

    // Guests must NEVER see admin controls
    expect(screen.queryByText(/admin cv management/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /upload new version/i })).not.toBeInTheDocument();
  });

  it("renders admin management controls when authenticated admin has edit mode active", () => {
    render(
      <LocalizationProvider locale="en" dictionary={{}}>
        <AdminEditProvider isAdmin={true} initialEditMode={true}>
          <CvViewer
            cv={BASELINE_PUBLISHED_CV}
            versions={[
              {
                id: "ver-1",
                versionNumber: 1,
                fileName: "Anas_CV.pdf",
                fileSize: 462 * 1024,
                fileUrl: "/api/cv/download",
                mimeType: "application/pdf",
                createdAt: new Date().toISOString(),
              },
            ]}
            locale="en"
          />
        </AdminEditProvider>
      </LocalizationProvider>,
    );

    // Admin controls are now visible
    expect(screen.getByText(/admin cv management/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload new version/i })).toBeInTheDocument();
    expect(screen.getByText("Anas_CV.pdf")).toBeInTheDocument();
  });

  it("supports Arabic dynamic localization seamlessly", () => {
    render(
      <LocalizationProvider
        locale="ar"
        dictionary={{
          "cv.title": "السيرة الذاتية المهنية",
          "cv.subtitle": "عرض وتحميل السيرة الذاتية",
          "cv.download": "تحميل السيرة الذاتية (PDF)",
          "cv.version_label": "الإصدار {version}",
        }}
      >
        <AdminEditProvider isAdmin={false}>
          <CvViewer cv={BASELINE_PUBLISHED_CV} locale="ar" />
        </AdminEditProvider>
      </LocalizationProvider>,
    );

    expect(screen.getByRole("heading", { name: "السيرة الذاتية المهنية" })).toBeInTheDocument();
    expect(screen.getByText("عرض وتحميل السيرة الذاتية")).toBeInTheDocument();
    expect(screen.getAllByText("الإصدار 1").length).toBeGreaterThanOrEqual(1);
  });
});
