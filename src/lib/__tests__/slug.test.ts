import { describe, it, expect } from "vitest";
import { slugify } from "../slug";

describe("slugify", () => {
  it("normalise les accents, la casse et les espaces", () => {
    expect(slugify("Élève à l'école")).toBe("eleve-a-lecole");
  });

  it("remplace & par 'et', supprime les caractères spéciaux et trim les tirets", () => {
    expect(slugify("  Santé & Bien-être !!  ")).toBe("sante-et-bien-etre");
  });

  it("retourne une chaîne vide pour une entrée vide ou uniquement composée de séparateurs", () => {
    expect(slugify("")).toBe("");
    expect(slugify("---   ---")).toBe("");
  });
});
