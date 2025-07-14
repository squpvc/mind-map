const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const isLibrary = process.env.NODE_ENV === 'library'
const WebpackDynamicPublicPathPlugin = require('webpack-dynamic-public-path')

module.exports = {
  publicPath: isDev ? '' : './dist',
  outputDir: '../dist',
  lintOnSave: false,
  productionSourceMap: false,
  filenameHashing: true,
  transpileDependencies: ['yjs', 'lib0', 'quill'],
  
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000, // 244KB
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
      minimize: !isDev,
    },
    performance: {
      hints: isDev ? false : 'warning',
      maxEntrypointSize: 244000, // 244KB
      maxAssetSize: 244000, // 244KB
    },
  },

  chainWebpack: config => {
    // Remove preload and prefetch for better initial load
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    // Support setting public path at runtime
    if (!isDev) {
      config
        .plugin('dynamicPublicPathPlugin')
        .use(WebpackDynamicPublicPathPlugin, [
          { externalPublicPath: 'window.externalPublicPath' }
        ])
    }

    // Add hash parameters to JS and CSS files
    if (!isLibrary) {
      config.plugin('html').tap(args => {
        args[0].hash = true
        args[0].minify = {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          collapseBooleanAttributes: true,
          removeScriptTypeAttributes: true,
        }
        return args
      })
    }
  },
  
  // Enable parallel processing
  parallel: require('os').cpus().length > 1,
  
  // Development server configuration
  devServer: {
    hot: true,
    compress: true,
    proxy: {
      '^/api/v3/': {
        target: 'http://ark.cn-beijing.volces.com',
        changeOrigin: true
      }
    },
    overlay: {
      warnings: false,
      errors: true
    }
  }
}
