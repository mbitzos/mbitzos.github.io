/* eslint-disable */
/**
 * Process arg into a map
 * This covers args where we have keyword args
 */
function processArgs() {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    const [k, v] = arg.split("=");
    args[k] = v ?? true;
  }
  return args;
}
module.exports = { processArgs };
