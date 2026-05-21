import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { checkRateLimit } from "../rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("autorise les requêtes sous la limite et décrémente le restant", () => {
    const key = `user-allow-${Math.random()}`;
    const first = checkRateLimit(key, 3, 1000);
    const second = checkRateLimit(key, 3, 1000);

    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(2);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(1);
  });

  it("bloque la requête au-delà de la limite puis se réinitialise après la fenêtre", () => {
    const key = `user-block-${Math.random()}`;

    checkRateLimit(key, 2, 1000);
    checkRateLimit(key, 2, 1000);
    const blocked = checkRateLimit(key, 2, 1000);

    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);

    // Avance le temps au-delà de la fenêtre
    vi.advanceTimersByTime(1500);

    const afterReset = checkRateLimit(key, 2, 1000);
    expect(afterReset.allowed).toBe(true);
    expect(afterReset.remaining).toBe(1);
  });
});
