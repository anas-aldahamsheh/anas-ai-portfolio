import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MotionProvider, useMotion } from "@/modules/motion/presentation/motion-provider";
import {
  FadeIn,
  SlideIn,
  StaggerContainer,
  StaggerItem,
  PresenceTransition,
} from "@/components/motion";

function TestConsumer() {
  const { isReducedMotion, intensity, shouldAnimate } = useMotion();
  return (
    <div>
      <span data-testid="reduced-motion">{String(isReducedMotion)}</span>
      <span data-testid="intensity">{intensity}</span>
      <span data-testid="should-animate">{String(shouldAnimate)}</span>
    </div>
  );
}

describe("Motion System Integration (F010)", () => {
  it("provides default motion context", () => {
    render(
      <MotionProvider>
        <TestConsumer />
      </MotionProvider>,
    );

    expect(screen.getByTestId("intensity")).toHaveTextContent("normal");
    expect(screen.getByTestId("should-animate")).toHaveTextContent("true");
  });

  it("honors overrideIntensity='none' by disabling animation", () => {
    render(
      <MotionProvider overrideIntensity="none">
        <TestConsumer />
      </MotionProvider>,
    );

    expect(screen.getByTestId("intensity")).toHaveTextContent("none");
    expect(screen.getByTestId("should-animate")).toHaveTextContent("false");
    expect(screen.getByTestId("reduced-motion")).toHaveTextContent("true");
  });

  it("renders FadeIn children correctly", () => {
    render(
      <MotionProvider>
        <FadeIn>
          <div data-testid="fade-content">Fade In Content</div>
        </FadeIn>
      </MotionProvider>,
    );

    expect(screen.getByTestId("fade-content")).toBeInTheDocument();
  });

  it("renders SlideIn children correctly", () => {
    render(
      <MotionProvider>
        <SlideIn>
          <div data-testid="slide-content">Slide In Content</div>
        </SlideIn>
      </MotionProvider>,
    );

    expect(screen.getByTestId("slide-content")).toBeInTheDocument();
  });

  it("renders StaggerContainer and StaggerItem children", () => {
    render(
      <MotionProvider>
        <StaggerContainer data-testid="stagger-container">
          <StaggerItem>
            <div data-testid="item-1">Item 1</div>
          </StaggerItem>
          <StaggerItem>
            <div data-testid="item-2">Item 2</div>
          </StaggerItem>
        </StaggerContainer>
      </MotionProvider>,
    );

    expect(screen.getByTestId("stagger-container")).toBeInTheDocument();
    expect(screen.getByTestId("item-1")).toBeInTheDocument();
    expect(screen.getByTestId("item-2")).toBeInTheDocument();
  });

  it("does not render content when isVisible is initially false", () => {
    render(
      <MotionProvider>
        <PresenceTransition isVisible={false}>
          <div data-testid="hidden-content">Hidden Content</div>
        </PresenceTransition>
      </MotionProvider>,
    );

    expect(screen.queryByTestId("hidden-content")).not.toBeInTheDocument();
  });

  it("handles PresenceTransition conditional unmounting when animation is disabled", () => {
    const { rerender } = render(
      <MotionProvider overrideIntensity="none">
        <PresenceTransition isVisible={true}>
          <div data-testid="presence-content">Visible Content</div>
        </PresenceTransition>
      </MotionProvider>,
    );

    expect(screen.getByTestId("presence-content")).toBeInTheDocument();

    rerender(
      <MotionProvider overrideIntensity="none">
        <PresenceTransition isVisible={false}>
          <div data-testid="presence-content">Visible Content</div>
        </PresenceTransition>
      </MotionProvider>,
    );

    expect(screen.queryByTestId("presence-content")).not.toBeInTheDocument();
  });
});
