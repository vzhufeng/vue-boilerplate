const { jsEntry, resolve, config } = require("./utils");

module.exports = (env) => ({
  entry: env === "dev" ? addHot(jsEntry) : jsEntry,
  output: {
    path: config[env].output,
    filename: "[name]_[hash].js",
  },
  resolve: {
    alias: {
      Utils: resolve(["src", "utils"]),
      Components: resolve(["src", "components"]),
      Assets: resolve(["src", "assets"]),
    },
    // import时可以不用写这些后缀名
    extensions: [".vue", ".js", ".jsx"], 
    mainFields: ["jsnext:main", "browser", "main"]
  }
});

function addHot(entry) {
  Object.keys(entry).forEach((v) => {
    entry[v] = [
      entry[v],
      "webpack-hot-middleware/client?noInfo=true&reload=true",
    ];
  });
  return entry;
}
