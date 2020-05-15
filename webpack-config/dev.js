const merge = require("webpack-merge");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const express = require("express");
const opn = require("better-opn");
const historyConnect = require("connect-history-api-fallback");

const base = require("./base");
const rules = require("./rules");
const plugins = require("./plugins");
const { resolve, config, htmlEntry } = require("./utils");

//
const wpConfig = merge(base("dev"), {
  output: {
    path: config.dev.output,
    filename: "[name].js", // 避免每次watch打包出来不同的文件名
    sourceMapFilename: "[name].map",
  },
  // 模式
  mode: "development",
  devtool: "source-map", // 这个选项输出的比较慢，但是便于开发调试，想快一点可以用cheap-module-source-map
  // 模块，loader
  module: {
    rules: [
      ...rules,
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
        include: resolve(["src"]),
      },
    ],
  },
  // 插件
  plugins: [
    ...plugins,
    new CleanWebpackPlugin([config.dev.output], { root: resolve([]) }),
  ],
});

const compiler = webpack(wpConfig);

const devMiddleware = require("webpack-dev-middleware")(compiler, {
  logLevel: "error",
  writeToDisk: true,
});
const hotMiddleware = require("webpack-hot-middleware")(compiler, {
  noInfo: true,
});

const app = express();

const historyPages = [];
htmlEntry.forEach((page) => {
  historyPages.push({
    from: new RegExp(`/${page.name}/?.*`),
    to(ctx) {
      const { pathname } = ctx.parsedUrl;
      console.log(pathname);
      const isFile = pathname.indexOf(".") > -1;
      if (isFile) {
        return pathname;
      }
      return `/${page.name}.html`;
    },
  });
});

if (historyPages.length) {
  app.use(
    historyConnect({
      rewrites: historyPages,
    })
  );
}

app.use(devMiddleware);

app.use(hotMiddleware);

app.use(express.static("./"));

const port = require("../package.json").port;
app.listen(port, (err) => {
  if (!err) {
    opn(`http://localhost:${port}/${htmlEntry[0].name}`);
  } else {
    console.error(err);
  }
});
