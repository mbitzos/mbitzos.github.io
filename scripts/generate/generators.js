/** Generators **/

/* eslint-disable */
const showdown = require("showdown");
const { config } = require("./utils");
const {
  postTemplate,
} = require("./constants");

function textGenerator(rawPost) {
  /**
   * Generates a post given a .txt file
   */
  return config(postTemplate, { POST_TEXT: rawPost });
}

function markdownGenerator(rawPost) {
  /**
   * Generates a post given a .md file
   */
  converter = new showdown.Converter()
  html = converter.makeHtml(rawPost);
  return config(postTemplate, { POST_TEXT: html });
}

module.exports = {
  "txt": textGenerator,
  "md": markdownGenerator,
}
