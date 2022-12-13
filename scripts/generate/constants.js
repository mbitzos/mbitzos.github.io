/* eslint-disable */
const fs = require("fs");
const path = require("path");

// FS CONSTANTS
const POSTS_DIRECTORY = "src/views/devblog/posts";
const PUBLIC_DIRECTORY = "public";
const RSS_DIRECTORY = path.join(PUBLIC_DIRECTORY, "RSS")
const RAW_POSTS_DIRECTORY = path.join(POSTS_DIRECTORY, "raw-posts");
const GEN_POSTS_DIRECTORY = path.join(POSTS_DIRECTORY, "generated-posts");
const DEVBLOG_HOME = "https://michaelbitzos.com/#/devblog/"
const ENCODING = "utf-8";

// Files
const metaFileTemplate = fs.readFileSync(
  path.join(POSTS_DIRECTORY, "post.meta.template.txt"),
  ENCODING
);
const postTemplate = fs.readFileSync(
  path.join(POSTS_DIRECTORY, "post.template.txt"),
  ENCODING
);
const importTemplate = fs.readFileSync(
  path.join(POSTS_DIRECTORY, "index.template.txt"),
  ENCODING
);
const fssFeedTemplate = fs.readFileSync(
  path.join(RSS_DIRECTORY, "feed.template.xml"),
  ENCODING
)

module.exports = {
  POSTS_DIRECTORY,
  RAW_POSTS_DIRECTORY,
  GEN_POSTS_DIRECTORY,
  ENCODING,
  metaFileTemplate,
  postTemplate,
  importTemplate,
  fssFeedTemplate,
  RSS_DIRECTORY,
  DEVBLOG_HOME
}