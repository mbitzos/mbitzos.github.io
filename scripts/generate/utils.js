function getPostNameAndType(fileName) {
  /**
   * Returns post name and post file type
   */
  const split = fileName.split(".");
  return [split[0], split[split.length - 1]];
}

function config(text, kvps, wrapKey = true) {
  /**
   * Util to replace config keys
   */
  return Object.entries(kvps).reduce((prev, curr) => {
    let key = curr[0];
    key = wrapKey ? `{{${key}}}` : key;
    return prev.replace(key, curr[1]);
  }, text);
}

module.exports = { getPostNameAndType, config };