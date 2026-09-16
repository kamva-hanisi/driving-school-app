import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";
const commands = [
  { name: "web", directory: "web" },
  { name: "api", directory: "api" },
];

const children = commands.map(({ name, directory }) => {
  const command = isWindows ? process.env.ComSpec || "cmd.exe" : npmCommand;
  const args = ["--prefix", directory, "run", "dev"];
  const commandArgs = isWindows
    ? ["/d", "/s", "/c", npmCommand, ...args]
    : args;
  const child = spawn(command, commandArgs, {
    stdio: ["inherit", "pipe", "pipe"],
  });

  child.stdout.on("data", (data) => process.stdout.write(prefix(name, data)));
  child.stderr.on("data", (data) => process.stderr.write(prefix(name, data)));
  child.on("exit", (code, signal) => {
    if (!signal && code !== 0) {
      process.exitCode = code;
      stopAll();
    }
  });

  return child;
});

process.on("SIGINT", stopAll);
process.on("SIGTERM", stopAll);

function stopAll() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

function prefix(name, data) {
  return data
    .toString()
    .split(/\r?\n/)
    .map((line, index, lines) =>
      line === "" && index === lines.length - 1 ? "" : `[${name}] ${line}`,
    )
    .join("\n");
}
