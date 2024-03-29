import path from "path";
import nodegit from "nodegit";
import { match } from "./match";

export const isAffected = async (
  pattern: string | string[],
  {
    mainBranch = "origin/master",
    repo: repoPath = "./",
    since,
  }: {
    mainBranch?: string;
    repo?: string;
    since?: string;
  } = {}
): Promise<boolean> => {
  const repo = await nodegit.Repository.open(
    path.resolve(process.cwd(), repoPath, ".git")
  );

  const from = await repo.getHeadCommit();
  const fromTree = await from.getTree();

  const getCommitToDiffWith = async () => {
    const masterCommit = await repo.getBranchCommit(mainBranch);
    const toSha = await nodegit.Merge.base(repo, from.id(), masterCommit.id());

    return repo.getCommit(toSha);
  };

  const to = await (since ? repo.getCommit(since) : getCommitToDiffWith());

  const toTree = await to.getTree();

  const diff = await toTree.diff(fromTree);
  const patches = await diff.patches();

  return match(patches, pattern);
};
