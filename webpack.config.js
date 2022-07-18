const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/images/[name].[ext]'
    },
    devtool: 'inline-source-map',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
                include: [path.resolve(__dirname, "html")]
            }, {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }, {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }, {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader", {
                        loader: "sass-loader",
                        options: {
                            // Prefer `dart-sass`
                            implementation: require.resolve("sass"),
                            sourceMap: true,
                            sassOptions: {
                                outputStyle: "compressed"
                            }
                        }
                    }
                ]
            }, {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: "assets/images/[name][ext][query]"
                }
            }, {
                test: /\.(woff(2)?|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: "assets/fonts/[name][ext][query]"
                }
            },{
                test: /\.(mp3)$/i,
                type: 'asset/resource',
                generator: {
                    filename: "assets/audio/[name][ext][query]"
                }
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        compress: true,
        port: 3000
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({filename: "style.css", chunkFilename: "[name].css"}),
        new HtmlWebpackPlugin({
            title: 'English for kids',
            inject: 'body',
            filename: 'index.html',
            template: path.resolve(__dirname, "src", "index.html"),
            favicon: path.resolve(__dirname, "src", "favicon.ico"),
            minify: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "src/assets/images",
                    to: "assets/images"
                },
                {
                    from: "src/assets/audio",
                    to: "assets/audio"
                }
            ]
        })
    ]
};