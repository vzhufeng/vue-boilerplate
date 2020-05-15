const merge = require("webpack-merge");
const webpack = require("webpack");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");


const base = require("./base");
const rules = require("./rules");
const plugins = require("./plugins");
const { resolve, config } = require("./utils");

const wpConfig = merge(base("prod"), {
  // 模式
  mode: "production",
  // 模块，loader
  module: {
    rules: [
      ...rules,
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", { loader: 'less-loader', options: { javascriptEnabled: true } }],
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
    new webpack.DllReferencePlugin({
      manifest: resolve(["dll/dll-manifest.json"]),
    }),
    new CleanWebpackPlugin([config.prod.output], { root: resolve([]) }),
    new OptimizeCssAssetsWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: "[name]_[hash].css" }),
  ],
  // optimization: {
  //   minimize: true,
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: "vendor"
  //       }
  //     }
  //   }
  // },
  performance: {
    hints: "warning", // 打包出来的文件大小警告
    maxEntrypointSize: 1000000, // 入口文件大小
    assetFilter: (assetFilename) =>
      assetFilename.endsWith(".css") || assetFilename.endsWith(".js"), // 过滤资源文件类型
  },
});

webpack(wpConfig, (err, stats) => {
  if (err) throw err;

  process.stdout.write(
    `${stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false,
    })}\n\n`
  );

  if (stats.hasErrors()) {
    // 打印出webapck的详细报错
    // console.log(stats.toJson());
    process.exit(1);
  }

  // 编译完成后执行的操作，比如上传cdn等
});
