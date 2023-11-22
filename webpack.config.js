import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import path from "path";
import glob from "glob";

const pages = glob.sync("src/*.html");

export default {
	entry: {
		index: path.resolve(__dirname, "./src/index.ts"),
		login: path.resolve(__dirname, "./src/login.ts"),
	},
	output: {
		path: path.resolve(__dirname, "./dist"),
		filename: "[name].bundle.js",
		chunkFilename: "[id].[chunkhash].js",
		clean: true,
	},
	resolve: {
		extensions: [".js", ".ts"],
	},
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.(?:js|mjs|cjs|ts)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.html$/,
				use: "html-loader",
			},
		],
	},
	devServer: {
		static: {
			directory: path.join(__dirname, "dist"),
		},
		compress: true,
		hot: true,
		port: 9000,
		allowedHosts: "all",
	},
	plugins: [
		...pages.map(
			(page) =>
				new HtmlWebpackPlugin({
					title: path.basename(page, path.extname(page)),
					template: page,
					filename: path.basename(page),
					chunks: [path.basename(page, path.extname(page))],
				})
		),
		new CleanWebpackPlugin(),
	],
};
