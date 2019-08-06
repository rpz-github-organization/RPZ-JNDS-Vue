const path = require("path");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const cdn = {
    css: [],
    js: [
        'https://cdn.bootcss.com/vue/2.6.6/vue.min.js',
        'https://cdn.bootcss.com/vue-router/3.0.2/vue-router.min.js',
        'https://cdn.bootcss.com/vuex/3.1.0/vuex.min.js',
        'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
    ]
}

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // 基本路径
    publicPath: './',
    // 输出文件目录
    outputDir: 'dist',
    // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: "./",
    // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径
    indexPath: './index.html',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,

    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },

    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: config => {
        config
            .entry('index')
            .add('babel-polyfill')
            .end();
        // 配置别名
        config.resolve.alias
            .set("@ant-design/icons/lib/dist", resolve("./src/icon.js"));
        if (isProduction) {
            // 生产环境打包
            // 删除预加载
            config.plugins.delete('preload');
            config.plugins.delete('prefetch');
            // 压缩代码
            config.optimization.minimize(true);
            // 分割代码
            config.optimization.splitChunks({
                chunks: 'all'
            })
            // 生产环境注入cdn
            config.plugin('html')
                .tap(args => {
                    args[0].cdn = cdn;
                    return args;
                });
        }
    },
    configureWebpack: config => {
        if (isProduction) {
            // 用cdn方式引入
            config.externals = {
                'vue': 'Vue',
                'vuex': 'Vuex',
                'vue-router': 'VueRouter',
                'axios': 'axios'
            }
            
            // 为生产环境修改配置...
            config.plugins.push(
                //生产环境自动删除console
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            drop_debugger: true,
                            drop_console: true,
                            pure_funcs: ['console.log'],
                        },
                    },
                    sourceMap: false,
                    parallel: true,
                })
            );
        } else {
            // 为开发环境修改配置...
        }
    },
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            // pass options to sass-loader
            sass: {
                // 引入全局变量样式
                data: `
                    @import "@/stylePath/theme.scss;
                `
            }
        },
        // 启用 CSS modules for all css / pre-processor files.
        modules: false,
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    devServer: {
        port: 8080,  // 端口
        open: true, // 自动开启浏览器
        compress: false, // 开启压缩
        overlay: {
            warnings: true,
            errors: true
        }
    },
}
