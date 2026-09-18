import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Badge,
  EmptyState,
  ErrorState,
  Skeleton,
} from "@/components/ui";

describe("Design System Primitives", () => {
  describe("Button", () => {
    it("renders children and handles click events", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByRole("button", { name: "Click Me" });
      expect(button).toBeInTheDocument();
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies loading state, disables button and displays spinner", () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Submit
        </Button>,
      );

      const button = screen.getByRole("button", { name: /submit/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("renders icons when provided", () => {
      render(
        <Button
          startIcon={<span data-testid="start-icon">Start</span>}
          endIcon={<span data-testid="end-icon">End</span>}
        >
          With Icons
        </Button>,
      );

      expect(screen.getByTestId("start-icon")).toBeInTheDocument();
      expect(screen.getByTestId("end-icon")).toBeInTheDocument();
    });

    it("supports various visual variants", () => {
      const { rerender } = render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-red-600");

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole("button")).toHaveClass("border-neutral-200");

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole("button")).toHaveClass("hover:bg-neutral-100");
    });
  });

  describe("Card", () => {
    it("renders complete card structure", () => {
      render(
        <Card data-testid="test-card">
          <CardHeader>
            <CardTitle>Project Title</CardTitle>
            <CardDescription>Project Description</CardDescription>
          </CardHeader>
          <CardContent>Main Content Body</CardContent>
          <CardFooter>Footer Content</CardFooter>
        </Card>,
      );

      expect(screen.getByTestId("test-card")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3, name: "Project Title" })).toBeInTheDocument();
      expect(screen.getByText("Project Description")).toBeInTheDocument();
      expect(screen.getByText("Main Content Body")).toBeInTheDocument();
      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });
  });

  describe("Input", () => {
    it("renders input and handles text entry", () => {
      render(<Input placeholder="Enter username" />);
      const input = screen.getByPlaceholderText("Enter username");
      expect(input).toBeInTheDocument();
      fireEvent.change(input, { target: { value: "testuser" } });
      expect(input).toHaveValue("testuser");
    });

    it("sets aria-invalid and error border when hasError is true", () => {
      render(<Input placeholder="Password" hasError />);
      const input = screen.getByPlaceholderText("Password");
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveClass("border-destructive");
    });

    it("respects disabled state", () => {
      render(<Input placeholder="Disabled" disabled />);
      const input = screen.getByPlaceholderText("Disabled");
      expect(input).toBeDisabled();
    });
  });

  describe("Badge", () => {
    it("renders with variant classes", () => {
      const { rerender } = render(<Badge variant="default">New</Badge>);
      expect(screen.getByText("New")).toHaveClass("bg-neutral-900");

      rerender(<Badge variant="success">Completed</Badge>);
      expect(screen.getByText("Completed")).toHaveClass("bg-emerald-100");

      rerender(<Badge variant="destructive">Failed</Badge>);
      expect(screen.getByText("Failed")).toHaveClass("bg-red-100");
    });
  });

  describe("EmptyState", () => {
    it("renders with status role, title, and action", () => {
      render(
        <EmptyState
          title="No projects found"
          description="Try changing your search filters."
          action={<Button size="sm">Reset Filters</Button>}
        />,
      );

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("No projects found")).toBeInTheDocument();
      expect(screen.getByText("Try changing your search filters.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Reset Filters" })).toBeInTheDocument();
    });
  });

  describe("ErrorState", () => {
    it("renders with alert role and triggers retry callback", () => {
      const handleRetry = vi.fn();
      render(
        <ErrorState
          title="Failed to load items"
          description="Server returned 500 error."
          retryText="Try Again"
          onRetry={handleRetry}
        />,
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Failed to load items")).toBeInTheDocument();
      expect(screen.getByText("Server returned 500 error.")).toBeInTheDocument();

      const retryBtn = screen.getByRole("button", { name: "Try Again" });
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe("Skeleton", () => {
    it("renders with aria-hidden and animation classes", () => {
      const { container } = render(<Skeleton className="h-4 w-32" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute("aria-hidden", "true");
      expect(skeleton).toHaveClass("animate-pulse");
    });
  });
});
