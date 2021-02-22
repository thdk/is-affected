import path from "path";
import nodegit from "nodegit";
import minimatch from "minimatch";
import chalk from "chalk";

export const isAffected = async (
  pattern: string,
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
  try {
    const repo = await nodegit.Repository.open(
      path.resolve(process.cwd(), repoPath, ".git")
    );

    const from = await repo.getHeadCommit();
    const fromTree = await from.getTree();

    const getCommitToDiffWith = async () => {
      const masterCommit = await repo.getBranchCommit(mainBranch);
      const toSha = await nodegit.Merge.base(
        repo,
        from.id(),
        masterCommit.id()
      );

      return repo.getCommit(toSha);
    };

    const to = await (since ? repo.getCommit(since) : getCommitToDiffWith());

    const toTree = await to.getTree();

    const diff = await toTree.diff(fromTree);
    const patches = await diff.patches();

    return patches.some((patch) => {
      const file = patch.newFile().path();
      return minimatch(file, pattern);
    });
  } catch (error) {
    console.error(chalk.bgRed(error.message));
    process.exit(1);
  }
};
