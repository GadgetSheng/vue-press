---
lastUpdated: false
---
# 学习webpack

[[toc]]

## Original
::: details 官方原文
### Concepts

webpack is a **static** module bundler for modern JavaScript application

it internally builds a [`dependency graph`] from one or more entry points
and then combines every module your project needs into one or more bundles,
which are static assets to serve your content from.

Core concepts:
* Entry
* Output
* Loaders
* Plugins
* Mode
* Browser Compatiblity

一期目标问题
* Manually Bundling an Application
* Live Coding a Simple Module Bundler
* Detailed Explaination of a Simple Module Bundler

### Entry
entry point = which module webpack begin building out its internal **dependency graph**.
figure out depends on(directly or indirectly).

`./src/index.js`

### Output
emit the bundles and specific the names of these files.
`./dist/main.js`
{ path, filename }

### Plugins
leveraged to perform a wider range of tasks like 
bundle optimization , asset management and injection of enviroment variables.
*extend capabilities*
* require it
* push to plugins array
* create instance with `new`

### Mode
development,`production`,none
built-in  optimization that correspond to each environment.

### Browser Compatibility
supports all "ES5-compliant" 
webpack needs Promise for `import()`,`require.ensure()`.
to support older browser you need to load polyfill.

> Webpack 5 runs on Node.js version 10.13.0+

### Scenarios
1. Seperate App and Vender Entries
```json
{
    entry: {
        main: 'xxx',
        vendor: 'yyy'
    },
    output: {
        filename: '[name].[contenthash].bundle.js', // prod
        filename: '[name].bundle.js' // dev
    },
}
```
`optimization.splitChunks` option takes care of seperating vendors and app modules.

### Multiple Entry Points
Output has a unique name.
can use substitutions    `[name]`
:::
## Webpack内容综述
::: tip 章节
* P1-P3 webpack 的基本概念和日常开发的使用技巧
* P4-P5 以工程化的方式组织webpack构建配置，和webpack打包优化
* P6-P7 详细剖析webpack打包原理和插件，以及loader的实现
* P8 从实际web商城项目出发，讲解webpack实际使用
::: 

### 01 webpack与构建发展简史
为什么需要构建工具
* 转换ES6语法
* 转换JSX
* CSS前缀补全/预处理器
* 压缩混淆
* 图片压缩
  
构建演变之路
  `ant+YUI tool --> grunt --> fis3/gulp --> rollup,webpack,parcel`

为什么选择webpack
* 社区生态丰富
* 配置灵活和插件化扩展
* 官方更新迭代速度快
  
初识webpack：配置文件名称

* webpack默认配置文件 `webpack.config.js`
* 可以通过 webpack --config 指定配置文件

初识webpack：配置组成
* entry // 打包的入口文件
* output // 打包的输出
* mode // 环境
* module.rules // Loader配置
* module.plugins // 插件配置

**零配置**webpack包含哪些内容
* 默认entry为 ./src/index.js
* 默认output为 ./dist/main.js
* loader raw-loader
* plugins HtmlwebpackPlugin template:./src/index.html

环境搭建 Node.js 和 NPM

安装webpack和 webpack-cli

webpack初体验

```js
const path=require('path');
module.exports={
    mode: 'production',
    entry: './src/index.js',
    output:{
        path: path.resolve(__dirname,'dist'),
        filename: 'bundle.js'
    }
};
```
--->构建结果
```html
<!doctype html>
<html>
    <head>
        <title>demo</title>
    </head>
    <body>
        <script src="dist/bundle.js"></script>
    </body>
</html>
```
> 通过npm script 运行`webpack`
> 
> **原理** 模块局部安装会在 node_modules/.bin目录创建软链接



