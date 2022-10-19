/** Generators **/

/* eslint-disable */
const showdown = require("showdown");
const { config } = require("./utils");
const {
  postTemplate,
} = require("./constants");

/**
 * Generates a post given a .txt file
 */
function textGenerator(rawPost) {
  return config(postTemplate, { POST_TEXT: rawPost });
}

/**
 * Generates a post given a .md file
 */
function markdownGenerator(rawPost) {
  converter = new showdown.Converter()
  html = converter.makeHtml(rawPost);
  // image component injection
  html = html.replace(/\$IMAGE\:\{.*?\}/g,
    a => `<PostImageComponent class="post-image" :image="${a.replace("$IMAGE:", "").replace(/"/g, "'")}" />`
  )
  // code block component injection
  html = html.replace(/<pre><code/g, "<CodeBlock> <pre><code")
  html = html.replace(/<\/code><\/pre>/g, "</code></pre> </CodeBlock>")
  return config(postTemplate, { POST_TEXT: html });
}

module.exports = {
  "txt": textGenerator,
  "md": markdownGenerator,
}
