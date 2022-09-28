// Generates the static pages //

/* eslint-disable */
const fs = require("fs");
const fsExtra = require('fs-extra');
const path = require("path");
const execa = require("execa");


const POSTS_DIRECTORY = "src/views/devblog/posts"
const RAW_POSTS_DIRECTORY = path.join(POSTS_DIRECTORY, "raw-posts")
const GEN_POSTS_DIRECTORY = path.join(POSTS_DIRECTORY, "generated-posts")
const ENCODING = "utf-8"

const metaFileTemplate = fs.readFileSync(path.join(POSTS_DIRECTORY, "post.meta.template.txt"), ENCODING)
const postTemplate = fs.readFileSync(path.join(POSTS_DIRECTORY, "post.template.txt"), ENCODING)
const importTemplate = fs.readFileSync(path.join(POSTS_DIRECTORY, "index.template.txt"), ENCODING)

function config(text, kvps, wrapKey = true) {
  return Object.entries(kvps).reduce((prev, curr) => {
    let key = curr[0]
    key = wrapKey ? `{{${key}}}` : key
    return prev.replace(key, curr[1])
  }, text)
}

// Generators //
function generateTextPost(rawPost) {
  /**
   * Generates a post given a .txt file
   */
  return config(postTemplate, { "POST_TEXT": rawPost })
}

const generators = {
  "txt": generateTextPost
}

function generateMetaFile(metaData, postName) {
  const IMPORT_KEY = "IMPORT_KEY"
  const DATE_KEY = "DATE_KEY"
  const IMPORT_NAME = "PostContent"
  metaData['component'] = `${IMPORT_KEY}`
  metaData['date'] = `${DATE_KEY}`
  let metaDataStr = JSON.stringify(metaData)
  let options = {}
  options[`"${IMPORT_KEY}"`] = IMPORT_NAME
  options[`"${DATE_KEY}"`] = `new Date("${new Date()}")`
  metaDataStr = config(metaDataStr, options, wrapKey = false)

  return config(metaFileTemplate, {
    "COMPONENT_IMPORT": `import ${IMPORT_NAME} from './${postName}.vue'`,
    "META_DATA": metaDataStr,
  })
}

function generatePostPages() {

  /**
   * Converts raw post + meta data into static site pages
   */

  const files = fs.readdirSync(RAW_POSTS_DIRECTORY)
  const posts = files.filter(file => !file.endsWith("meta.json"))
  const postNames = []
  for (const post of posts) {
    const split = post.split(".")
    const postFileRaw = fs.readFileSync(path.join(RAW_POSTS_DIRECTORY, post), ENCODING)
    const postName = split[0]
    postNames.push(postName)
    const metaFile = JSON.parse(fs.readFileSync(path.join(RAW_POSTS_DIRECTORY, postName + ".meta.json")))
    const postFileType = split[split.length - 1]
    const generator = generators[postFileType]

    // Generation
    const newMetaFileContent = generateMetaFile(metaFile, postName)
    const newPostContent = generator(postFileRaw)
    fs.writeFileSync(path.join(GEN_POSTS_DIRECTORY, postName + ".meta.ts"), newMetaFileContent)
    fs.writeFileSync(path.join(GEN_POSTS_DIRECTORY, postName + ".vue"), newPostContent)
  }
  return postNames

}

function generatePostImports(posts) {
  /**
   * Generates the necessary index.ts import file for the posts
   */
  const IMPORT_NAME = (i) => `post${i}`
  const IMPORT_TEMPLATE = (postName, i) => `import { default as ${IMPORT_NAME(i)} } from "./generated-posts/${postName}.meta";`;

  const importStr = posts.map((postName, i) => IMPORT_TEMPLATE(postName, i)).join("\n")
  const postStr = posts.map((_, i) => IMPORT_NAME(i)).join(",")

  const newImportContent = config(importTemplate, {
    "IMPORT_KEY": importStr,
    "POSTS": postStr,
  })

  const importFilePath = path.join(POSTS_DIRECTORY, "index.ts")
  fs.rmSync(importFilePath)
  fs.writeFileSync(importFilePath, newImportContent)
}

console.log("Starting static page generation...");
console.log("Clearing generation folder")
fsExtra.emptyDirSync(GEN_POSTS_DIRECTORY)
try {
  console.log("Starting post page generation");
  posts = generatePostPages();
  console.log("Post generation complete");

  try {
    console.log("Generating imports");
    generatePostImports(posts);
    console.log("Imports complete");
  } catch (e) {
    console.log("Problem generating imports");
    console.error(e);
    process.exit(1);
    return;
  }
} catch (e) {
  console.log("Problem generating posts");
  console.error(e);
  process.exit(1);
  return;
}

console.log("Running linter");
execa.sync("npm", ['run', 'lint'])

console.log("Generation complete");
