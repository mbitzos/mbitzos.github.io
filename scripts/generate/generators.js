/** Generators **/

/* eslint-disable */
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

module.exports = {
  "txt": textGenerator
}
