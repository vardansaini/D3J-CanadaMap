const path = require("path");

module.exports = {
  entry: "./src/index.jsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        // use: "ts-loader",
        exclude: /node_modules/,
        options: {
          presets: ['es2015']
      }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
