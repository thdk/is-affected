#!/usr/bin/env node

import path from "path";
import os from "os";
import program from "commander";
import chalk from "chalk";

import { isAffected } from "./is-affected";
import { exec } from "./exec";

const pjson = require(path.resolve(__dirname, "../package.json"));

program
  .version(pjson)
  .description(
    "runs command only if the git diff since the fork point from master branch contains files matching glob"
  )
  .command("check <glob>", { isDefault: true })
  .option("--repo <repo>", "git directory", "./")
  .option("--cmd <cmd>", "the command to be run if diff matches glob")
  .option("--cwd <cwd>", "working directory to be used to run command")

  .action(async (glob, { repo, cwd, cmd }) => {
    return isAffected(glob, {
      repo,
    }).then((isAffectedResult) => {
      if (!isAffectedResult) {
        console.log(
          chalk.yellow(
            `${glob} is not present in diff. Skipping command: ${cmd}`
          )
        );
        return;
      }

      console.log(
        chalk.green(`${glob} is present in diff. Running command: ${cmd}`)
      );
      return exec(cmd, cwd).catch(() => {
        console.error(
          chalk.bgRed(
            `${os.EOL}ERROR: can't exec your command.${os.EOL}command: ${cmd}`
          )
        );
        process.exit(1);
      });
    });
  })
  .parse(process.argv);
