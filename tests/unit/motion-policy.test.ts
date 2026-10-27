import { describe, expect, it } from "vitest";
import { pointerOffset, sceneQuality } from "@/lib/animations/policy";

const desktop = { width: 1440, reducedMotion: false, saveData: false, memory: 8, cores: 8 };
describe("scene capability policy", () => {
  it.each([{ reducedMotion: true }, { width: 320 }, { width: 767 }, { saveData: true }, { memory: 2 }, { cores: 2 }])("uses a poster for %o", (change) => {
    expect(sceneQuality({ ...desktop, ...change })).toBe("poster");
  });
  it("selects bounded desktop quality tiers", () => {
    expect(sceneQuality(desktop)).toBe("high");
    expect(sceneQuality({ ...desktop, width: 1024 })).toBe("balanced");
    expect(sceneQuality({ ...desktop, memory: 4 })).toBe("balanced");
  });
  it("bounds pointer displacement and safely handles zero-size input", () => {
    expect(pointerOffset(50, 50, 100, 100)).toEqual({ x: 0, y: 0 });
    expect(pointerOffset(1000, -1000, 100, 100)).toEqual({ x: 8, y: -8 });
    expect(pointerOffset(0, 0, 0, 0)).toEqual({ x: -8, y: -8 });
  });
});
