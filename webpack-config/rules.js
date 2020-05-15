const { resolve } = require("./utils");
const path = require("path");

// include会导致src以外的目录的文件不处理，可能会导致一些问题，注意

module.exports = [
  {
    test: /\.(js|jsx)$/,
    use: [
      { loader: "babel-loader", options: { cacheDirectory: true } },
      {
        loader: "eslint-loader",
        options: {
          formatter: require("eslint-friendly-formatter"),
          enforce: "pre",
        },
      },
    ],
    include: resolve(["src"]),
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [
      {
        loader: "file-loader",
        options: { name: path.join("static", "[name].[ext]") },
      },
    ],
    include: resolve(["src", "assets"]),
  },
  {
    test: /\.(png|svg|jpeg|jpg|gif)$/,
    use: [
      {
        loader: "file-loader",
        options: { name: path.join("static", "[name].[ext]") },
      },
    ],
    include: resolve(["src", "assets"]),
  },
  {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
    use: [
      {
        loader: "file-loader",
        options: { name: path.join("static", "[name].[ext]") },
      },
    ],
    include: resolve(["src", "assets"]),
  },
];
