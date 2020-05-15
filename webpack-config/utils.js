var fs = require("fs");
var path = require("path");

const jsEntry = {};
const htmlEntry = [];

const resolve = (p) => path.resolve(__dirname, "..", ...p);

// 自定义设置
const config = {
  public: {
    htmlEntry: "index.html",
    jsEntry: "index.js",
  },
  dev: {
    output: resolve(["local"]),
  },
  prod: {
    output: resolve(["dist"]),
  },
};

const readDir = (p) => {
  const items = fs.readdirSync(resolve([p]));
  if (!items) return;

  for (let i = 0, len = items.length; i < len; i++) {
    const ele = items[i];
    // 跳过预设的几个目录
    if ("assets,utils,components".indexOf(ele) >= 0) {
      continue;
    }
    const info = fs.statSync(resolve([p, ele]));
    if (info.isDirectory()) {
      htmlEntry.push({
        path: resolve([p, ele, config.public.htmlEntry]),
        name: ele,
      });
      jsEntry[ele] = resolve([p, ele, config.public.jsEntry]);
    }
  }
};

readDir("src");

module.exports = {
  config,
  resolve,
  jsEntry,
  htmlEntry,
};
