// const path = require('path')
// const webpack = require('webpack')
//
// // const createThemeColorReplacerPlugin = require('./config/plugin.config')
//
// function resolve (dir) {
//   return path.join(__dirname, dir)
// }
//
// // const isProd = process.env.NODE_ENV === 'production'
// //
// // const assetsCDN = {
// //     // webpack build externals
// //     externals: {
// //         vue: 'Vue',
// //         'vue-router': 'VueRouter',
// //         vuex: 'Vuex',
// //         axios: 'axios'
// //     },
// //     css: [],
// //     // https://unpkg.com/browse/vue@2.6.10/
// //     js: [
// //         '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
// //         '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
// //         '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
// //         '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
// //     ]
// // }
//
// // vue.config.js
// const vueConfig = {
//   configureWebpack: {
//     // webpack plugins
//     plugins: [
//       // Ignore all locale files of moment.js
//       new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
//     ],
//     // if prod, add externals
//     // externals: isProd ? assetsCDN.externals : {}
//   },
//
//   filenameHashing: false,
//   publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
//   chainWebpack: (config) => {
//     config.output.filename('[name].js').end()
//     config.resolve.alias
//       .set('@', resolve('src'))
//
//     const svgRule = config.module.rule('svg')
//     svgRule.uses.clear()
//     svgRule
//       .oneOf('inline')
//       .resourceQuery(/inline/)
//       .use('vue-svg-icon-loader')
//       .loader('vue-svg-icon-loader')
//       .end()
//       .end()
//       .oneOf('external')
//       .use('file-loader')
//       .loader('file-loader')
//       .options({
//         name: 'assets/[name].[ext]'
//       })
//
//     // if prod is on
//     // assets require on cdn
//     // if (isProd) {
//     //     config.plugin('html').tap(args => {
//     //         args[0].cdn = assetsCDN
//     //         return args
//     //     })
//     // }
//   },
//
//   css: {
//     loaderOptions: {
//       less: {
//         modifyVars: {
//           // less vars，customize ant design theme
//
//           // 'primary-color': '#F5222D',
//           // 'link-color': '#F5222D',
//           // 'border-radius-base': '4px'
//         },
//         // DO NOT REMOVE THIS LINE
//         javascriptEnabled: true
//       }
//     }
//   },
//
//   devServer: {
//     // development server port 8000
//     port: 8000
//     // If you want to turn on the proxy, please remove the mockjs /src/run.jsL11
//     // proxy: {
//     //   '/api': {
//     //     target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
//     //     ws: false,
//     //     changeOrigin: true
//     //   }
//     // }
//   },
//
//   // disable source map in production
//   productionSourceMap: false,
//   lintOnSave: undefined,
//   // babel-loader no-ignore node_modules/*
//   transpileDependencies: []
// }
//
// // preview.pro.loacg.com only do not use in your production;
//
// module.exports = vueConfig

const path = require("path");
const webpack = require("webpack");
// const CompressionWebpackPlugin = require("compression-webpack-plugin");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const productionGzipExtensions = ["js", "css"];

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // new UglifyJsPlugin({
      //   uglifyOptions: {
      //     compress: {
      //       drop_debugger: true,
      //       drop_console: true,
      //     },
      //   },
      //   sourceMap: false,
      //   parallel: true,
      // }),
      // 配置compression-webpack-plugin压缩
      // new CompressionWebpackPlugin({
      //   algorithm: "gzip",
      //   test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
      //   threshold: 10240,
      //   minRatio: 0.8,
      // }),
    ],
  },
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "public",
  indexPath: "index.html",
  filenameHashing: false,
  lintOnSave: true,
  productionSourceMap: true,
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    // requireModuleExtension: false
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@$", resolve("src"));
  },
  devServer: {
    port: 9000,
    proxy: {
      "/api": {
        target: "http://112.23.27.170:9866/nyyg-manage/", //http://yg3.zjliu.me/api/   http://localhost:9090/nyyg/ http://112.23.27.170:9866/nyyg-manage/
        ws: true,
        changOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  pluginOptions: {
    // 第三方插件配置
    // ...
  },
};
