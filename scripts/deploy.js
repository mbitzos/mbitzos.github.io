/**
 * Deploys the built web page
 */

/* eslint-disable */
const execa = require("execa");
const fs = require("fs-extra");

const DEPLOY_LOCATION = "docs";
const COMMIT_MESSAGE = "Deploying";

(async () => {
  try {
    console.log("Building started...");

    // build
    await execa("npm", ["run", "build"]);

    // move to docs
    await fs.copy("dist", DEPLOY_LOCATION);

    // commit and push only docs
    await execa("git", ["add", DEPLOY_LOCATION])
    await execa("git", ["commit", "-m", COMMIT_MESSAGE, "--", DEPLOY_LOCATION])
    await execa("git", ["push"]);

    console.log("Successfully deployed, check your settings");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
