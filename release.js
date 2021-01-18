const { execSync } = require("child_process");
const { version } = require("./package");
const exec = command => execSync(command, { encoding: "utf8" }).trim();

const exitWithError = error => {
  process.stderr.write(`\x1b[1;31m${error}\x1b[0m\n\n`);
  process.exit(1);
};

const gitBranchName = exec("git rev-parse --abbrev-ref HEAD");
if (gitBranchName !== "master") {
  exitWithError("please checkout the master branch to make a release!");
}

const workingCopyChanges = exec("git status --porcelain");
if (workingCopyChanges) {
  exitWithError("please commit your changes before making a release!");
}

const tagExists = exec(`git tag -l "${version}"`);
if (tagExists) {
  exitWithError(`${version} has already been released!`);
}

execSync(
  `npm run release:dry && git tag ${version} && git push && git push --tags && npm publish`,
  {
    shell: true,
    stdio: "inherit",
    cwd: __dirname
  }
);
