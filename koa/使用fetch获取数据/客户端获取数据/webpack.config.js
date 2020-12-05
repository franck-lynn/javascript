import path from 'path'
import webpack from 'webpack'
/**
 * 这是方便ES6写代码时采用TS的提示
 * @type {webpack.Configuration}
 */
import { VueLoaderPlugin } from 'vue-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
// import OpenBrowserPlugin from 'open-browser-webpack-plugin'

const config = {
    mode: "development",
    entry: "./src/main.js", // webpack 打包的入口文件
    output: { filename: "bundule.js", path: path.join(__dirname, 'dist') },
    // target: 'web',
    module: {
        rules: [
            { test: /\.vue$/, use: 'vue-loader' },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    "style-loader", 'css-loader', { loader: 'sass-loader', options: { implementation: require("sass"), sassOptions: { fiber: false } } },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            // 导入 veriable, mixins等
                            resources: ['./src/scss/scss/entries/main.scss']
                        }
                    }
                ]
            },
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' },
            { test: /.(png|jpg|gif|jpeg)$/, use: 'file-loader' },
            //配置 webpack 支持 .graphql 文件
            { test: /\.(graphql|gql)$/, exclude: /node_modules/, loader: 'graphql-tag/loader' },
        ]
    },
    resolve: {
        alias: {
            // 路径的别名
            '@': path.resolve('src'),
            'scss': path.resolve('src/scss'),
        },
        // 省略后缀
        extensions: ['.js', '.vue', 'json', '.css', '.scss']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "vue-base",
            template: './public/index.html',
            favicon: "./assets/imgs/Jupiter.ico",
            inject: true
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin(),
        new webpack.HotModuleReplacementPlugin(), // 使用webpack内置插件HMR
        // new webpack.IgnorePlugin(/fs/) // 无法解决 require.context 与 node fs 冲突
        new webpack.DefinePlugin({
            // vue3.0 rc-3 以后, 推荐显式注明构建模式, 这里是开发时的配置, 生成模式重新配置
            "__VUE_OPTIONS_API__": false,
            "__VUE_PROD_DEVTOOLS__": true,
        }),
        // new OpenBrowserPlugin({ url: 'http://localhost:8080' })
    ],
    // 浏览器跨域
    devServer: {
        contentBase: "dist",
        hot: true,
        // proxy: {
        //     // 1). 配置了一个代理, 只要是 graphql开头的请求, 就去找服务器 3000端口
        //     //    捕获这个api标志, 如果api中有这个字符串, 就还是匹配, 例如
        //     //    api 请求 /api/users, 会被代理到请求 http://www.xxxx.com/api/users
        //     '/': { 
        //         // 2). 代理 api的地址, 就是需要跨域的api地址, 也就是目的地
        //         // target: 'https://developer.github.com/v4/explorer/',
        //         target: "http://localhost:3000/graphql",
        //         // target: "https://pet-library.moonhighway.com/",
        //         // secure: false, // 如果是https接口，需要配置这个参数
        //         // 这个设置一下就可以跨域了, 针对客户端的任何请求, 都进行转发
        //         changeOrigin: true, // 是否跨域
        //         // 3). 路径重写, 比如请求的路径试 /api/users
        //         //     设置 '^/api': '' 后, 会把 /api去掉
        //         //     直接访问 http://www.xxxx.com/users 
        //         // pathRewrite: {
        //         //     '^/api':""
        //         // }
        //     }
        // }
    },
    // 浏览器报警, 加上错误定位就不报警了
    // devtool: 'cheap-module-eval-source-map',
    // wp5 要用下面这行了
    devtool: 'source-map',
}
export default config