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

// ARGS //
const args = new Set(process.argv.slice(2));

// skips updating dates of posts w/ missing dates
const SKIP_DATE_SETTING = args.has("--skip-date-setting")

// if we only want to append new posts, ignore posts that were already generated
const DIFF_MODE = args.has("--diff-mode")


function config(text, kvps, wrapKey = true) {
  /**
   * Util to replace config keys
   */
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

// all supported generators
const generators = {
  "txt": generateTextPost
}

function generateMetaFile(metaData, postName) {
  /**
   * Generates the .ts meta file from the json
   */
  const IMPORT_KEY = "IMPORT_KEY"
  const DATE_KEY = "DATE_KEY"
  const IMPORT_NAME = "PostContent"

  const prevDate = metaData['date']
  if (!prevDate) {
    throw Error(`${postName} meta file does not contain a date and you opt'd to skip date setting. please add it manually in.`)
  }
  metaData['component'] = `${IMPORT_KEY}`

  metaData['date'] = `${DATE_KEY}`  // hacky way to insert the date
  let metaDataStr = JSON.stringify(metaData)
  let options = {}
  options[`"${IMPORT_KEY}"`] = IMPORT_NAME
  options[`"${DATE_KEY}"`] = `new Date("${prevDate}")`
  metaDataStr = config(metaDataStr, options, wrapKey = false)

  return config(metaFileTemplate, {
    "COMPONENT_IMPORT": `import ${IMPORT_NAME} from './${postName}.vue'`,
    "META_DATA": metaDataStr,
  })
}

function getPostNameAndType(fileName) {
  /**
   * Returns post name and post file type
   */
  const split = fileName.split(".")
  return [split[0], split[split.length - 1]]
}

function generatePostPages() {
  /**
   * Converts raw post + meta data into static site pages
   * takes the json data and dynamically creates the vue post component + meta data ts file
   * using templating
   */

  const postNames = []

  // read all raw post data
  const posts = fs.readdirSync(RAW_POSTS_DIRECTORY)
    .filter(file => !file.endsWith("meta.json"))
  const existingPosts = new Set(
    fs.readdirSync(GEN_POSTS_DIRECTORY)
      .filter(file => !file.endsWith("meta.json"))
      .map(file => getPostNameAndType(file)[0])
  )

  // generate per post
  for (const post of posts) {
    const [postName, postFileType] = getPostNameAndType(post)

    // diff mode, skip posts that already are generated
    if (DIFF_MODE && existingPosts.has(postName)) {
      console.log(`${postName} already exists, skipping`)
      continue
    }

    // get contents
    const postFileRaw = fs.readFileSync(path.join(RAW_POSTS_DIRECTORY, post), ENCODING)
    const metaFileName = path.join(RAW_POSTS_DIRECTORY, postName + ".meta.json")
    const metaFile = JSON.parse(fs.readFileSync(metaFileName))

    // Generation
    const generator = generators[postFileType]
    if (!generator) {
      throw Error(`${postFileType} is not a supported post file type`)
    }

    // timestamp posts
    if (!SKIP_DATE_SETTING) {
      if (!metaFile['date']) {
        metaFile['date'] = new Date()
        fs.writeFileSync(metaFileName, JSON.stringify(metaFile))
      }
    }
    const newMetaFileContent = generateMetaFile(metaFile, postName)
    const newPostContent = generator(postFileRaw)
    fs.writeFileSync(path.join(GEN_POSTS_DIRECTORY, postName + ".meta.ts"), newMetaFileContent)
    fs.writeFileSync(path.join(GEN_POSTS_DIRECTORY, postName + ".vue"), newPostContent)

    postNames.push(postName)
  }
  return postNames

}

function generatePostImports(posts) {
  /**
   * Generates the necessary index.ts import file for the posts
   * This basically takes a template file and dynamically inserts all the posts generated from it
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

function main() {
  console.log("Starting static page generation...");

  if (DIFF_MODE) {
    console.log("Starting with DIFF_MODE")
  } else {
    console.log("Starting with FULL_MODE")
  }

  // clear
  if (!DIFF_MODE) {
    console.log("Clearing generation folder")
    fsExtra.emptyDirSync(GEN_POSTS_DIRECTORY)
  }

  // generation of post pages
  try {
    console.log("Starting post page generation");
    posts = generatePostPages();
    console.log("Post generation complete");

  } catch (e) {
    console.log("Problem generating posts");
    console.error(e);
    process.exit(1);
  }

  // generation of dynamic import
  try {
    console.log("Generating imports");
    generatePostImports(posts);
    console.log("Imports complete");
  } catch (e) {
    console.log("Problem generating imports");
    console.error(e);
    process.exit(1);
  }

  // using eslint to clean up
  console.log("Running linter");
  execa.sync("npm", ['run', 'lint'])

  console.log("Generation complete");
}

main();
