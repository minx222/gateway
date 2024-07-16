const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin').TsconfigPathsPlugin;
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')

const tsConfigFile = 'tsconfig.build.json';

// const swp = new SpeedMeasurePlugin();

/**
 * @type {import('webpack').Configuration}
 */
const config = {
	mode: 'production',
	target: 'node',
	entry: path.resolve(__dirname, 'apps/front-gateway/src', 'main.ts'), // 入口文件。改成你自己的,
	output: {
		path: path.resolve(__dirname, 'build'), // 出口文件，如果没什么特殊的就可以不管,
		filename: 'index.js',
	},
	// 忽略依赖
	externals: [nodeExternals()],
	plugins: [new CleanWebpackPlugin()],
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "esbuild-loader"
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		plugins: [
			// 别名路径处理
			new TsconfigPathsPlugin({
				configFile: tsConfigFile,
			}),
		],
	},
};

// module.exports = swp.wrap(config);
model.exports = config;
