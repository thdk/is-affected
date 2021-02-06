import { spawn } from "child_process";

function getShell() {
  if (process.platform === "win32") {
    return { cmd: "cmd", arg: "/C" };
  }
  return { cmd: "sh", arg: "-c" };
}

export const exec = (as: string, cwd?: string): Promise<void> => {
  const { cmd, arg } = getShell();
  return new Promise<void>((resolve, reject) => {
    const childProcess = spawn(cmd, [arg, `${as}`], {
      cwd: cwd || process.cwd(),
      stdio: "inherit",
    });

    childProcess.on("close", (code) => {
      if (code) {
        reject();
      } else {
        resolve();
      }
    });
  });
};
