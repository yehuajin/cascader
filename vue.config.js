let path = require('path')
let fs = require('fs')

function resolve (dir) {
  return path.join(__dirname, './', dir)
}
let elementFolderName = 'element-ui'
let allModulesFolders = fs.readdirSync(path.join(__dirname, './', 'node_modules'))
for (let i = 0; i < allModulesFolders.length; i++) {
  if (allModulesFolders[i].indexOf('element-ui') !== -1) {
    elementFolderName = JSON.parse(fs.readFileSync(path.join(path.join(__dirname, './', 'node_modules'), allModulesFolders[i], '/package.json'), 'utf8')).version
    break
  }
}
module.exports = {
  lintOnSave: 'error',
  devServer: {
    progress: false
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('compile')
      .test(/\.js$/)
      .include
      .add(resolve('src/components/rx-table/ele-table'))
      .add(resolve(`node_modules/element-ui/packages/table/src`))
      .add(resolve(`node_modules/element-ui/packages/tooltip/src`))
      .add(resolve(`node_modules/_element-ui@${elementFolderName}@element-ui/packages/table/src`))
      .add(resolve(`node_modules/_element-ui@${elementFolderName}@element-ui/packages/tooltip/src`))
      .end()
      .use('babel')
      .loader('babel-loader')
      .options({
        presets: [
          ['@babel/preset-env', { modules: false }]
        ]
      })
  }
}
