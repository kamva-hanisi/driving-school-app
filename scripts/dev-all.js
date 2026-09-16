import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";

const commands = [
  { name: "web", args: ["--prefix", "web", "run", "dev"] },
  { name: "api", args: ["--prefix", "api", "run", "dev"] },
];

const children = commands.map(({ name, args }) => {
  const command = isWindows ? process.env.ComSpec || "cmd.exe" : npmCommand;
  const commandArgs = isWindows
    ? ["/d", "/s", "/c", npmCommand, ...args]
    : args;

  const child = spawn(command, commandArgs, {
    stdio: ["inherit", "pipe", "pipe"],
  });

  child.stdout.on("data", (data) => {
    process.stdout.write(prefixLines(name, data));
  });

  child.stderr.on("data", (data) => {
    process.stderr.write(prefixLines(name, data));
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.log(`[${name}] stopped by ${signal}`);
      return;
    }

    if (code !== 0) {
      console.log(`[${name}] exited with code ${code}`);
      stopAll();
      process.exitCode = code;
    }
  });

  return child;
});

process.on("SIGINT", stopAll);
process.on("SIGTERM", stopAll);

function stopAll() {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
}

function prefixLines(name, data) {
  return data
    .toString()
    .split(/\r?\n/)
    .map((line, index, lines) => {
      if (line === "" && index === lines.length - 1) {
        return "";
      }

      return `[${name}] ${line}`;
    })
    .join("\n");
}
