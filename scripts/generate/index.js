/** Generates the static pages **/

/* eslint-disable */
const fs = require("fs");
const fsExtra = require('fs-extra');
const path = require("path");
const execa = require("execa");
var xmlbulker = require('xmlbuilder');
const { config, getPostNameAndType, getMetaFileName, getPostMetaFile } = require("./utils");
const {
  POSTS_DIRECTORY,
  RAW_POSTS_DIRECTORY,
  GEN_POSTS_DIRECTORY,
  ENCODING,
  metaFileTemplate,
  fssFeedTemplate,
  importTemplate,
  DEVBLOG_HOME,
  RSS_DIRECTORY,
} = require("./constants")
const generators = require("./generators")

/**
 * Process arg into a map
 * This covers args where we have keyword args
 */
function processArgs() {
  const args = {}
  for (let arg of process.argv.slice(2)) {
    const [k, v] = arg.split("=")
    args[k] = v ?? true
  }
  return args
}

const ARGS = processArgs()

/** ARGS **/
// skips updating dates of posts w/ missing dates
const SKIP_DATE_SETTING = ARGS["skip-date"]
// if we only want to append new posts, ignore posts that were already generated
const MODE = ARGS['mode'] || 'DIFF'
if (MODE == "post" && !ARGS['post']) {
  throw Error("Post must be provided for mode=post")
}


/**
 * Generates the .ts meta file from the json
 */
function generateMetaFile(metaData, postName) {
  const IMPORT_KEY = "IMPORT_KEY"
  const DATE_KEY = "DATE_KEY"
  const IMPORT_NAME = "PostContent"

  // shallow copy
  metaData = { ...metaData }

  const prevDate = metaData['date']
  if (!prevDate) {
    throw Error(`${postName} meta file does not contain a date and you opt'd to skip date setting. please add it manually in.`)
  }
  metaData['component'] = `${IMPORT_KEY}`

  metaData['date'] = `${DATE_KEY}`  // hacky way to insert the date
  metaData['key'] = postName

  // fix tags 
  let tags = metaData['tags'] || "null"
  tags = typeof tags === "string" ? tags.split(",") : tags
  metaData['tags'] = tags

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

/**
 * Converts raw post + meta data into static site pages
 * takes the json data and dynamically creates the vue post component + meta data ts file
 * using templating
 */
function generatePostPages() {

  const postNames = []

  // read all raw post data
  const posts = fs.readdirSync(RAW_POSTS_DIRECTORY)
    .filter(file => !file.endsWith("meta.json"))
  const existingPosts = new Set(
    fs.readdirSync(GEN_POSTS_DIRECTORY)
      .filter(file => !file.endsWith("meta.json"))
      .map(file => getPostNameAndType(file)[0])
  )

  const postNameToPost = {}

  // generate per post
  for (const post of posts) {
    const [postName, postFileType] = getPostNameAndType(post)
    postNames.push(postName)

    // get contents
    const postFileRaw = fs.readFileSync(path.join(RAW_POSTS_DIRECTORY, post), ENCODING)
    const metaFile = getPostMetaFile(postName)

    postNameToPost[postName] = metaFile

    // diff mode, skip posts that already are generated
    if (MODE == "diff" && existingPosts.has(postName)) {
      console.log(`${postName} already exists, skipping`)
      continue
    }

    // specific post mode
    if (MODE == "post" && postName !== ARGS['post']) {
      continue
    }

    // Generation
    const generator = generators[postFileType]
    if (!generator) {
      throw Error(`${postFileType} is not a supported post file type`)
    }

    // timestamp posts
    if (!SKIP_DATE_SETTING) {
      if (!metaFile['date']) {
        metaFile['date'] = new Date()
        fs.writeFileSync(getMetaFileName(postName), JSON.stringify(metaFile))
      }
    }
    const newMetaFileContent = generateMetaFile(metaFile, postName)
    const newPostContent = generator(postFileRaw)
    fs.writeFileSync(path.join(GEN_POSTS_DIRECTORY, postName + ".meta.ts"), newMetaFileContent)
    fs.writeFileSync(path.join(GEN_POSTS_DIRECTORY, postName + ".vue"), newPostContent)
  }
  // sort by date
  postNames.sort((a, b) => {
    const aDate = new Date(postNameToPost[a].date);
    const bDate = new Date(postNameToPost[b].date);
    return aDate - bDate;
  })
  return postNames

}

/**
 * Generates the necessary index.ts import file for the posts
 * This basically takes a template file and dynamically inserts all the posts generated from it
 */
function generatePostImports(posts) {
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

/**
 * Generates the RSS Feed to be in sync with our posts for RSS subscribers
 */
function generateRSSFeed(posts) {
  // generates a single xml RSS item from a post
  function generateRSSItem(postname, post) {
    const item = xmlbulker.create("item", {
      headless: true,
    })
    const link = `${DEVBLOG_HOME}${postname}`
    item.ele("link", link)
    item.ele("title", post.title)
    item.ele("description", post.description)
    item.ele("author", "m.bitzos@gmail.com (Michael Bitzos)")
    item.ele("guid", link)
    item.ele("pubDate", new Date(post.date).toUTCString())
    for (const tag of post.tags) {
      item.ele("category", tag)
    }
    return item.end({ "pretty": true, "indent": "  " })
  }
  const fssFeedPath = path.join(RSS_DIRECTORY, "feed.xml")

  // clear old
  fs.rmSync(fssFeedPath, { force: true })

  const items = posts
    .map(postname => [postname, getPostMetaFile(postname)])
    .map(postObj => generateRSSItem(...postObj))
    .join("\n")
  const newRSSContent = config(fssFeedTemplate, {
    "ITEMS": items,
  })
  fs.writeFileSync(fssFeedPath, newRSSContent)
}

function clear() {
  /**
   * performs function clearing
   */
  if (MODE === "full") {
    fsExtra.emptyDirSync(GEN_POSTS_DIRECTORY)
  } else if (MODE === "post") {
    fsExtra.rmSync(path.join(GEN_POSTS_DIRECTORY, ARGS['post'] + ".vue"), { force: true })
    fsExtra.rmSync(path.join(GEN_POSTS_DIRECTORY, ARGS['post'] + ".meta.ts"), { force: true })
  }

}

function main() {
  console.log("Starting static page generation...");

  console.log(`Starting with mode: ${MODE} `)

  // clear
  clear()

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

  try {
    console.log("Generating RSS");
    generateRSSFeed(posts);
    console.log("RSS Feed complete");
  } catch (e) {
    console.log("Program generating RSS Feed");
    console.error(e);
    process.exit(1);
  }

  // using eslint to clean up
  console.log("Running linter");
  execa.sync("npm", ['run', 'lint'])

  console.log("Generation complete");
}

main();
