import type nodegit from "nodegit";
import multimatch from "multimatch";

export const match = (
  patches: nodegit.ConvenientPatch[],
  pattern: string | string[]
): boolean => {
  let patterns = pattern;
  if (typeof pattern === "string" && pattern[0] === "!") {
    patterns = ["**/**", pattern];
  } else if (Array.isArray(patterns) && patterns[0][0] === "!") {
    patterns.splice(0, 0, "**/**");
  }

  return patches.some((patch) => {
    const file = patch.newFile().path();
    const result = multimatch(file, patterns);
    return result.length > 0;
  });
};
