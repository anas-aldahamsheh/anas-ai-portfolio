import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  AdminEditProvider,
  AdminToolbar,
  EditableRegion,
  ContextualEditorDialog,
} from "@/modules/admin/presentation";
import type { EditableRef } from "@/modules/admin/domain/inline-edit";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
    push: vi.fn(),
  }),
}));

describe("Global Admin Inline Edit Mode UI Integration (F013)", () => {
  const sampleEditableRef: EditableRef = {
    entityType: "section",
    entityId: "sec-hero-1",
    fieldOrBlockId: "header",
    locale: "en",
    version: 1,
    title: "Hero Section",
    initialData: {
      title: "Full-Stack AI Engineer",
      subtitle: "Production portfolio",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ensures guests and non-admins never see edit handles or admin toolbar", () => {
    render(
      <AdminEditProvider isAdmin={false}>
        <div>
          <AdminToolbar locale="en" />
          <EditableRegion editableRef={sampleEditableRef}>
            <h2>Full-Stack AI Engineer</h2>
          </EditableRegion>
          <ContextualEditorDialog />
        </div>
      </AdminEditProvider>,
    );

    // Guest sees public content cleanly
    expect(screen.getByText("Full-Stack AI Engineer")).toBeInTheDocument();

    // Admin toolbar should NOT be in the DOM
    expect(
      screen.queryByRole("complementary", { name: /admin inline editing toolbar/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit Mode")).not.toBeInTheDocument();

    // No edit buttons or edit handles should exist
    expect(screen.queryByRole("button", { name: /edit hero section/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders admin toolbar for authenticated admins and allows toggling edit mode", () => {
    render(
      <AdminEditProvider isAdmin={true} initialEditMode={false}>
        <div>
          <AdminToolbar locale="en" />
          <EditableRegion editableRef={sampleEditableRef}>
            <h2>Full-Stack AI Engineer</h2>
          </EditableRegion>
          <ContextualEditorDialog />
        </div>
      </AdminEditProvider>,
    );

    // Toolbar is visible
    expect(screen.getByText("Admin")).toBeInTheDocument();
    const toggleBtn = screen.getByRole("button", { name: /edit mode/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute("aria-pressed", "false");

    // Before activating edit mode, edit handle is not visible
    expect(screen.queryByRole("button", { name: /edit hero section/i })).not.toBeInTheDocument();

    // Click toggle to enable edit mode
    fireEvent.click(toggleBtn);

    // Now toggle button indicates active state
    expect(screen.getByRole("button", { name: /editing active/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    // The edit affordance is now present with accessible aria-label
    const editHandle = screen.getByRole("button", { name: /edit hero section/i });
    expect(editHandle).toBeInTheDocument();
  });

  it("opens contextual editor on handle click and closes on Escape key", async () => {
    render(
      <AdminEditProvider isAdmin={true} initialEditMode={true}>
        <div>
          <AdminToolbar locale="en" />
          <EditableRegion editableRef={sampleEditableRef}>
            <h2>Full-Stack AI Engineer</h2>
          </EditableRegion>
          <ContextualEditorDialog />
        </div>
      </AdminEditProvider>,
    );

    const editHandle = screen.getByRole("button", { name: /edit hero section/i });
    fireEvent.click(editHandle);

    // Contextual editor dialog opens
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hero Section" })).toBeInTheDocument();

    // Input is pre-populated with initial title
    const input = screen.getByDisplayValue("Full-Stack AI Engineer");
    expect(input).toBeInTheDocument();

    // Press Escape to close modal
    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("submits updated content to the inline-edit endpoint upon saving", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        entityType: "section",
        entityId: "sec-hero-1",
        fieldOrBlockId: "header",
        version: 2,
        updatedAt: new Date().toISOString(),
        data: { title: "Updated Architect Title" },
      }),
    });
    global.fetch = fetchMock;

    render(
      <AdminEditProvider isAdmin={true} initialEditMode={true}>
        <div>
          <AdminToolbar locale="en" />
          <EditableRegion editableRef={sampleEditableRef}>
            <h2>Full-Stack AI Engineer</h2>
          </EditableRegion>
          <ContextualEditorDialog />
        </div>
      </AdminEditProvider>,
    );

    // Open editor
    fireEvent.click(screen.getByRole("button", { name: /edit hero section/i }));

    // Change input value
    const input = screen.getByDisplayValue("Full-Stack AI Engineer");
    fireEvent.change(input, { target: { value: "Updated Architect Title" } });

    // Submit form
    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/admin/inline-edit",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("Updated Architect Title"),
        }),
      );
    });

    // Modal closes after successful save
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
