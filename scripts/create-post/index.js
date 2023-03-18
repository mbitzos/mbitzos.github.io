/* eslint-disable */
// X-IMPORTS
const fs = require("fs");
const path = require("path");

// IMPORTS
const { processArgs } = require("../utils");

// CONSTANTS
const DEV_EXAMPLES_PATH = "../devblog-code-examples";
const ASSETS_PATH = "src/assets/posts/";
const RAW_POST_PATH = "src/views/devblog/posts/raw-posts";
const META_TEMPLATE_RAW = fs.readFileSync("scripts/create-post/post.meta.template", "utf-8");

// ARGS
const ARGS = processArgs();
const POSTNAME = ARGS["name"];
const skipExamples = ARGS["skipExamples"] || false;

// sanity checks
if (!POSTNAME) {
  throw Error("post name is expected");
}

// safety check
if (fs.existsSync(path.join(ASSETS_PATH, POSTNAME))) {
  throw Error(`${POSTNAME} already exists`)
}

// create assets folder
fs.mkdirSync(path.join(ASSETS_PATH, POSTNAME))

// create meta
fs.writeFileSync(path.join(RAW_POST_PATH, `${POSTNAME}.md`), "")
metaObject = JSON.parse(META_TEMPLATE_RAW)
metaObject["mainImage"] = {
  "uri": `posts/${POSTNAME}/TODO.png`
}
if (!skipExamples) {
  metaObject["ghFolder"] = POSTNAME
}
// create post
fs.writeFileSync(path.join(RAW_POST_PATH, `${POSTNAME}.meta.json`), JSON.stringify(metaObject))


// create dev blog examples
if (!skipExamples) {
  fs.mkdirSync(path.join(DEV_EXAMPLES_PATH, POSTNAME))
}
console.log(`${POSTNAME} successfully created`)