/* eslint-disable */
const path = require("path");
const fs = require("fs");
const { RAW_POSTS_DIRECTORY } = require("./constants");
/**
 * Returns post name and post file type
 */
function getPostNameAndType(fileName) {
  const split = fileName.split(".");
  return [split[0], split[split.length - 1]];
}

/**
 * Util to replace config keys
 */
function config(text, kvps, wrapKey = true) {
  return Object.entries(kvps).reduce((prev, curr) => {
    let key = curr[0];
    key = wrapKey ? `{{${key}}}` : key;
    return prev.replace(key, curr[1]);
  }, text);
}

function getMetaFileName(postName) {
  return path.join(RAW_POSTS_DIRECTORY, postName + ".meta.json");
}

function getPostMetaFile(postName) {
  return JSON.parse(fs.readFileSync(getMetaFileName(postName)))
}

module.exports = { getPostNameAndType, config, getMetaFileName, getPostMetaFile };
