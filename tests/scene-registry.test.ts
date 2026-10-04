import { describe, expect, it, vi } from "vitest";
import { createSceneRegistry } from "@/lib/scene-registry";

describe("createSceneRegistry", () => {
  it("starts idle with no active slots", () => {
    const registry = createSceneRegistry();
    expect(registry.getState()).toEqual({ status: "idle", activeSlots: [] });
  });

  it("moves to requested when a slot asks for the canvas", () => {
    const registry = createSceneRegistry();
    registry.request();
    expect(registry.getState().status).toBe("requested");
  });

  it("only becomes ready after the canvas was requested", () => {
    const registry = createSceneRegistry();
    registry.markReady();
    expect(registry.getState().status).toBe("idle");
    registry.request();
    registry.markReady();
    expect(registry.getState().status).toBe("ready");
  });

  it("keeps the ready status when another slot requests the canvas", () => {
    const registry = createSceneRegistry();
    registry.request();
    registry.markReady();
    registry.request();
    expect(registry.getState().status).toBe("ready");
  });

  it("treats a failure as final so slots keep their fallback", () => {
    const registry = createSceneRegistry();
    registry.request();
    registry.markFailed();
    registry.request();
    registry.markReady();
    expect(registry.getState().status).toBe("failed");
  });

  it("tracks active slots without duplicates", () => {
    const registry = createSceneRegistry();
    registry.setActive("hero", true);
    registry.setActive("hero", true);
    registry.setActive("triage", true);
    expect(registry.getState().activeSlots).toEqual(["hero", "triage"]);
    registry.setActive("hero", false);
    expect(registry.getState().activeSlots).toEqual(["triage"]);
  });

  it("returns the same snapshot when nothing changed", () => {
    const registry = createSceneRegistry();
    registry.setActive("hero", true);
    const before = registry.getState();
    registry.setActive("hero", true);
    registry.setActive("missing", false);
    expect(registry.getState()).toBe(before);
  });

  it("never mutates a previous snapshot", () => {
    const registry = createSceneRegistry();
    const first = registry.getState();
    registry.setActive("hero", true);
    expect(first.activeSlots).toEqual([]);
  });

  it("notifies listeners only on real changes and supports unsubscribing", () => {
    const registry = createSceneRegistry();
    const listener = vi.fn();
    const unsubscribe = registry.subscribe(listener);
    registry.request();
    registry.request();
    registry.setActive("hero", true);
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    registry.setActive("hero", false);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
