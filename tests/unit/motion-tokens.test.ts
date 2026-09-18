import { describe, it, expect } from "vitest";
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  getTransition,
  fadeInVariants,
  slideUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/modules/motion/domain/motion-tokens";

describe("Motion Tokens & Variants (F010)", () => {
  it("defines restrained, subtle duration and easing tokens", () => {
    expect(MOTION_DURATIONS.fast).toBeLessThanOrEqual(0.15);
    expect(MOTION_DURATIONS.normal).toBeLessThanOrEqual(0.25);
    expect(MOTION_DURATIONS.slow).toBeLessThanOrEqual(0.4);
    expect(MOTION_EASINGS.default).toEqual([0.16, 1, 0.3, 1]);
  });

  describe("getTransition", () => {
    it("returns standard subtle transition when reducedMotion is false", () => {
      const transition = getTransition("normal", false, 0.1);
      expect(transition.duration).toBe(0.25);
      expect(transition.delay).toBe(0.1);
      expect(transition.ease).toEqual([0.16, 1, 0.3, 1]);
    });

    it("returns immediate transition with zero delay when reducedMotion is true", () => {
      const transition = getTransition("normal", true, 0.1);
      expect(transition.duration).toBeLessThanOrEqual(0.01);
      expect(transition.delay).toBe(0);
      expect(transition.ease).toBe("linear");
    });
  });

  describe("fadeInVariants", () => {
    it("defines opacity transition for normal and reduced motion", () => {
      expect(fadeInVariants.hidden).toEqual({ opacity: 0 });
      const normalVisible = fadeInVariants.visible(false);
      expect(normalVisible.opacity).toBe(1);
      expect(normalVisible.transition.duration).toBe(0.25);

      const reducedVisible = fadeInVariants.visible(true);
      expect(reducedVisible.opacity).toBe(1);
      expect(reducedVisible.transition.duration).toBe(0.01);
    });
  });

  describe("slideUpVariants", () => {
    it("removes vertical translation when reducedMotion is true", () => {
      const normalHidden = slideUpVariants.hidden(false);
      expect(normalHidden.y).toBe(8);

      const reducedHidden = slideUpVariants.hidden(true);
      expect(reducedHidden.y).toBe(0);

      const normalExit = slideUpVariants.exit(false);
      expect(normalExit.y).toBe(-4);

      const reducedExit = slideUpVariants.exit(true);
      expect(reducedExit.y).toBe(0);
    });
  });

  describe("staggerContainerVariants & staggerItemVariants", () => {
    it("removes stagger delays when reducedMotion is true", () => {
      const normal = staggerContainerVariants.visible(false);
      expect(normal.transition.staggerChildren).toBe(0.05);

      const reduced = staggerContainerVariants.visible(true);
      expect(reduced.transition.staggerChildren).toBe(0);
    });

    it("removes item vertical offset when reducedMotion is true", () => {
      const normal = staggerItemVariants.hidden(false);
      expect(normal.y).toBe(6);

      const reduced = staggerItemVariants.hidden(true);
      expect(reduced.y).toBe(0);
    });
  });
});
