import { match } from "./match";

import type nodegit from "nodegit";

const createPatch = (path: string) =>
  (({
    newFile: () => ({
      path: () => path,
    }),
  } as unknown) as nodegit.ConvenientPatch);

it("returns true if some paths match the pattern", () => {
  const result = match(
    [createPatch("src/foo/text.txt"), createPatch("src/bar/text.txt")],
    "src/bar/**"
  );

  expect(result).toBe(true);
});

it("returns false when no paths match the pattern ", () => {
  const result = match(
    [createPatch("src/foo/text1.txt"), createPatch("src/foo/tex2.txt")],
    "src/bar/**"
  );

  expect(result).toBe(false);
});

describe("when a string pattern is negated", () => {
  it("returns true if not all paths match the negated pattern", () => {
    const result = match([createPatch("src/bar/text.txt")], "!src/foo/**");

    expect(result).toBe(true);
  });

  it("returns false when all paths match the negated pattern ", () => {
    const result = match(
      [createPatch("src/bar/text1.txt"), createPatch("src/bar/tex2.txt")],
      "!src/bar/**"
    );

    expect(result).toBe(false);
  });
});

describe("when multiple patterns are provided", () => {
  it("returns true if paths exist in the union of the results given by each pattern", () => {
    const result = match(
      [
        createPatch("src/bar/text1.txt"),
        createPatch("src/foo/tex2.txt"),
        createPatch("src/foobar/text1.txt"),
      ],
      ["src/bar/**", "src/foo/**"]
    );

    expect(result).toBe(true);
  });

  it("returns false if no paths exist in the union of the results given by each pattern", () => {
    const result = match(
      [
        createPatch("src/bar/text1.txt"),
        createPatch("src/foo/tex2.txt"),
        createPatch("src/foobar/text1.txt"),
      ],
      ["lib/bar/**", "lib/foo/**"]
    );

    expect(result).toBe(false);
  });

  describe("and some patterns are negated", () => {
    it("returns true if paths exits in non negated patterns", () => {
      const result = match(
        [createPatch("src/bar/text1.txt"), createPatch("src/foo/tex2.txt")],
        ["src/**", "!src/foo/**"]
      );

      expect(result).toBe(true);
    });

    it("returns false if all paths exits in negated patterns", () => {
      const result = match(
        [createPatch("src/foo/text1.txt"), createPatch("src/foo/tex2.txt")],
        ["src/**", "!src/foo/**"]
      );

      expect(result).toBe(false);
    });

    it("returns false when first pattern is a negation and all paths match that pattern", () => {
      const result = match(
        [createPatch("src/foo/text1.txt"), createPatch("src/foo/tex2.txt")],
        ["!src/foo/**"]
      );

      expect(result).toBe(false);
    });

    it("returns true when first pattern is a negation and no paths match that pattern", () => {
      const result = match(
        [createPatch("src/bar/text1.txt"), createPatch("src/bar/tex2.txt")],
        ["!src/foo/**"]
      );

      expect(result).toBe(true);
    });
  });
});
