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

### 02 webpack基础用法
Entry 用来指定webpack的打包入口

模块依赖图的入口是 entry
对于非代码比如图片、字体依赖也会不断加入到依赖图中

Entry的用法
* 单入口：entry是一个字符串
* 多入口：entry是一个对象

Output用来告诉webpack 如何将编译后的文件输出到磁盘

Output的用法：单入口配置
```js
module.exports={
    entry:'./path/to/my/entry/file.js'
    output:{
        filename: 'bundle.js'
        path: __dirname + '/dist'
        
    }
}
```
Output的用法：多入口配置
```js
module.exports={
    entry: {
        app: './src/app.js',
        search: './src/search.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    }
}
```
> 通过占位符确保文件名称的唯一

* 核心概念之Loaders
  
webpack开箱即用只支持js和json两种文件类型，通过Loaders去支持其他文件类型并且把它们转化成有效的模块，
并且可以添加到依赖图中。
本身是一个函数，接受源文件作为参数，返回转换的结果。

常见的Loaders
| 名称                    | 描述                     |
| ----------------------- | ------------------------ |
| babel-loader            | 转换ES6+等JS新特性语法   |
| css-loader              | 支持.css文件的加载和解析 |
| less-loader,sass-loader | ...                      |
| ts-loader               | 将ts转换成css            |
| file-loader             | 进行图片、字体等的打包   |
| raw-loader              | 将文件以字符串的形式导入 |
| thread-loader           | 多进程打包JS和CSS        |

Loaders 的用法
```js
const path=require('path');

module.exports={
    output:{
        filename: 'bundle.js'
    },
    module:{
        rules:[
            {test:/\.txt$/,use: 'raw-loader'}
        ]
    }
}
```
> `test` 指定匹配规则,`use` 指定使用的loader名称

* 核心概念之Plugins

插件用于bundle文件的优化，资源管理器和环境变量的注入
作用于整个构建过程

常见的Plugins有哪些?
| 名称                     | 描述                                       |
| ------------------------ | ------------------------------------------ |
| CommonsChunkPlugin       | 将chunks相同的模块代码提取成公共js         |
| CleanWebpackPlugin       | 清理构建目录                               |
| ExtractTextWebpackPlugin | 将CSS从bundle文件里提取成一个独立的CSS文件 |
| CopyWebpackPlugin        | 将文件或者文件夹拷贝到构建的输出目录       |
| HtmlWebpackPlugin        | 创建HTML文件去承载输出的bundle             |
| UglifyjsWebpackPlugin    | 压缩JS                                     |
| ZipWebpackPlugin         | 将打包出的资源生成一个zip包                |

Plugins的用法
```js
const path=require('path');

module.exports={
    output:{
        filename: 'bundle.js'
    },
    plugins:[
        new HtmlWebpackPlugin({template:'./src/index.html'})
    ]
}
```
> 放到plugins的数组里面

* 核心概念之Mode
Mode用来指定当前的构建环境是: production development还是none，
设置mode可以使用webpack内置的函数，默认值是production

Mode的内置函数功能
| 选项        | 描述                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| development | 设process.env.NODE_ENV 的值为 development. 开启NamedChunksPlugin+NameModulesPlugin. |
| production  | 设process.env.NODE_ENV 的值为 production. 开启"一堆Plugin"                          |
| none        | 不开启任何优化选项                                                                  |

::: tip "一堆Plugin" 
* FlagDependencyUsagePlugin
* FlagIncludedChunksPlugin
* ModuleConcatentationPlugin
* NoEmitOnErrorsPlugin
* OccurenceOrderPlugin
* SideEffectsFlagPlugin
* TerserPlugin
:::

资源解析: 解析ES6
使用babel-loader babel的配置文件是.babelrc
```js
module.exports={
    module:{
        rules:[ {test:/\.js$/,use: 'babel-loader'} ]
    }
}
```

增加ES6的babel preset配置
```json
{
    "presets":["@babel/preset-env"],
    "plugins":["@babel/proposal-class-properties"]
}
```
> 增加ES6 preset配置

资源解析: 解析React JSX

```json
{
    "presets":["@babel/preset-env","@babel/preset-react"],
    "plugins":["@babel/proposal-class-properties"]
}
```
> 增加React的 babel-preset 配置

资源解析: 解析CSS
```js
module.exports={
    module:{
        rules:[
            {test:/\.css$/,use:["style-loader","css-loader"]}
        ]
    }
}
```
> css-loader用于加载.css文件，并且转换成commonjs对象
> style-loader 将样式通过`<style>`标签插入到head中

解析Less和SaSS
less-loader 用于将less转换成css
解析图片
file-loader 用于处理文件 `test: /\.(png|svg|jpg|gif)$/`
解析字体
file-loader 也可以用于处理字体 `test: /\.(woff|woff2|eot|ttf|otf)$/`
使用url-loader
url-loader 也可以处理图片和字体
可以设置较小的资源自动base64
 ```js
 module.exports={
     module:{rules:[
         {test:/\.(png|svg|jpg|git)$/,
         use:[{
             loader: 'url-loader',
             options: {limit: 10240}
         }]}

     ]}
 }
 ```
 webpack中的文件监听
 
文件监听是在发现源码发生变化时，自动重新构建出新的输出文件。

webpack 开启监听模式，有两种方式:
1. 启动 webpack命令时，带上--watch参数
2. 在配置webpack.config.js中设置 watch: true

唯一缺陷：每次需要手动 刷新浏览器

::: details 文件监听原理
轮询判断文件的最后编辑时间是否变化
某个文件发生了变化，并不会立即告诉监听者，而是先缓存起来，等aggregateTimeout

 ```js
 module.exports={
     watch: true, //默认false
     watchOptions:{
         ignored: /node_modules/, // 默认空，不监听的文件(夹),支持正则匹配
         aggregateTimeout: 300, // 监听到变化后会等300ms再去执行，默认300
         poll:1000 // 判断文件是否变化是通过轮询问系统指定文件有没变化实现的，默认每秒问1000次
     }
 }
 ```
:::

热更新 webpack-dev-server
* WDS 不刷新浏览器
* WDS 不输出文件，而是放在内存中
* 使用HotModuleReplacementPlugin插件
`webpack-dev-server --open`

热更新 使用webpack-dev-middleware
WDS将 webpack输出的文件传输给服务器
适用于灵活的定制场景
```js
const express= require('express');
const webpack= require('webpack');
const webpackDevMiddleware=require('webpack-dev-middleware');

const app=express();
const config=require('./webpack.config.js');
const compiler= webpack(config);

app.use(webpackDevMiddleware(compiler,{
    publicPath: config.output.publicPath
}));
app.listen(3000,function(){
    console.log('app listening on port 3000');
})
```

热更新的原理分析

* Webpack Compile: 将JS编译成 Bundle
* HMR Server: 将热更的文件输出给 HMR Runtime
* Bundle server: 提供文件在浏览器的访问
* HMR Runtime: 会被注入到浏览器，更新文件的变化
* bundle.js: 构建输出的文件

![HMR原理分析](./images/HMR-principal.png)

* 什么是文件指纹?
  打包后输出的文件名的后缀
hash串
文件指纹如何生成
* Hash：和整个项目的构建相关，只要项目文件有修改，整个项目构建的hash值就会更改
* Chunkhash：和webpack打包的chunk有关，不同的entry会生成不同的chunkhash值
* Contenthash: 根据文件内容来定义hash，文件内容不变，则contenthash不变

JS的文件指纹设置
设置output的filename，使用[chunkhash]
`output:{ filename: '[name][chunkhash:8].js' }`
CSS文件的指纹设置
设置MiniCssExtractPlugin的filename,使用[contenthash]
```js
new MiniCssExtractPlugin({ filename: `[name][contenthash:8].css`})
```

图片文件的指纹设置
设置file-loader的name，使用[hash]
`use: [{loader:'file-loader',options:{name:'img/[name][hash:8].[ext]'}}]`
| 占位符名称  | 含义                          |
| ----------- | ----------------------------- |
| ext         | 资源的后缀名                  |
| name        | 文件名称                      |
| path        | 文件的相对路径                |
| folder      | 文件所在的文件夹              |
| contenthash | 文件的内容hash，默认md5生成   |
| hash        | 文件内容的Hash,默认md5生成    |
| emoji       | 一个随机的指代文件内容的emoji |

代码压缩
HTML压缩 CSS压缩 JS压缩

JS文件的压缩 内置了uglifyjs-webpack-plugin
CSS文件的压缩 使用optimize-css-assets-webpack-plugin，同时使用 cssnano
```js
plugins:[
    new OptimizeCSSAssetsPlugin({
        assetsNameRegExp:/\.css$/g,
        cssProcessor: require('cssnano')
    })
]
```
html文件的压缩 修改html-webpack-plugin, 设置压缩参数
```js
new HtmlWebpackPlugin({
    template: path.join(__dirname,'src/search.html'),
    filename: 'search.html',
    chunks:['search'],
    inject: true,
    minify:{
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false 的定义: font-size of the root elementrem 和 px 对比
移动端CSS px自动转换成rem
使用px2rem-loader
    }
})
```



### 03 webpack进阶用法

1. 当前构建的问题
每次构建的时候不会清理目录，造成构建的输出目录output文件越来越多

通过 npm scripts 清理构建目录
`rm -rf ./dist && webpack`
`rimraf ./dist && webpack`

自动清理构建目录
避免构建前每次都需要手动删除dist
使用clean-webpack-plugin ,默认会删除output指定的输出目录

```js
const plugins=[ new CleanWebpackPlugin() ] 
```

2. CSS3属性为什么需要前缀?
* Trident(-ms)
* Geko(-moz)
* Webkit(-webkit)
* Presto(-o)

举个例子
```css
.box{
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    -o-border-radius: 10px;
    border-radius: 10px;
}
```
PostCSS插件 autoprefixer 自动补齐CSS3前缀
使用 autoprefixer 插件
根据 CanIUse规则
```js
const module.rules=
{
    test: /\.less$/,
    use:[
        'style-loader', 'css-loader', 'less-loader',
        {
            loader: 'postcss-loader',
            options:{ plugins:()=>[
                    require('autoprefixer')({
                        browsers:[ "last 2 version",">1%","iOS 7" ]
                    })
                ]
            }
        }
    ]
}
```

3. 浏览器的分辨率
CSS 媒体查询实现响应式布局
```css
@media screen and (max-width: 980px){
    .header { width: 900px; }
}
@media screen and (max-width: 480px){
    .header { width: 400px; }
}
@media screen and (max-width: 350px){
    .header { width: 300px; }
}
```

4. rem 是什么
> W3C 对 `rem` 的定义: font-size of the root element

rem 和 px 对比
* rem 是相对单位
* px 是绝对单位

移动端CSS px自动转换成rem

使用`px2rem-loader`
页面渲染时计算根元素的font-size值
* 可以使用手淘的lib-flexible库
* https://github.com/amfe/lib-flexible

```js
const rules1.use=[{
    'style-loader','css-loader','less-loader',
    {
        loader: 'px2rem-loader',
        options:{
            remUnit: 75,
            remPecision: 8
        }
    }
}]
```

资源内联的意义
代码层面：
* 页面框架的初始化脚本
* 上报相关打点
* css内联避免页面闪动
请求层面: 减少HTTP网络请求数
* 小图片或者字体内联 url-loader

HTML 和 JS 内联

raw-loader 内联 html
```html
<script>${require('raw-loader!babel-loader!./meta.html')}</script>
```
raw-loader 内联 js
```html
<script>${require('raw-loader!babel-loader!../node_modules/lib-flexible')}</script>
```
css 内联
方案一 借助 style-loader
方案二 html-inline-css-webpack-plugin
```js
const rules1.use=[
    { 
        loader: 'style-loader',
        options:{
            insertAt: 'top',// 样式插入到<head>
            singleton: true,// 将所有的style标签合并成一个
        },
        'css-loader',
        'sass-loader'
    }
}]
```

多页面应用(PWA)概念
> 每一次页面跳转的时候，后台服务器都会给返回一个新的html文档，
> 
> 这种类型的网站也就是多页面网站，也叫做多页面应用

多页面打包基本思路

每个页面对应一个entry，一个html-webpack-plugin
缺点：每次新增或删除页面需要改webpack配置

多页面打包 通用方案

动态获取entry 和设置 html-webpack-plugin
利用 glob.sync
* entry: glob.sync(path.join(__dirname,'./src/*/index.js')),

使用 source map

作用：通过source map定位到源码
* source map 科普 阮一峰javascript_source_map

开发环境开启，线上环境关闭
* 线上排查问题的时候可以将sourcemap上传到错误监控系统

source map 关键字

eval: 使用eval包裹模块代码

source map： 产生.map文件

cheap： 不包含列信息

inline： 将.map作为DataURI嵌入，不单独产生.map文件

module：包含loader的sourcemap

source map 类型
* none =prod yes
* eval
* cheap-eval-source-map
* cheap-module-source-map
* eval-source-map
* cheap-source-map =prod yes
* cheap-module-source-map =prod yes
* inline-cheap-source-map
* inline-cheap-module-source-map
* source-map =prod yes
* inline-source-map
* hidden-source-map =prod yes

基础库分离
思路：将react、react-dom 基础包通过cdn引入，不打入bundle中
方法：使用html-webpack-externals-plugin
```js
cosnt plugins=[
    new HtmlWebpackExternalsPlugin({
        externals:[
            {module: 'react',entry:'//cdn/react.min.js?v=123'},
            {module: 'react-dom',entry:'//cdn/react-dom.min.js?v=123'}
        ]
    })
]
```
使用SplitChunksPlugin 进行公共脚本分离
webpack4 内置的，替代CommonsChunkPlugin 插件

chunks 参数说明：
* async 异步引入的库进行分离(默认)
* initial 同步引入的库进行分离
* all 所有引入的库进行分离(推荐)
```js
module.exports={
optimization: {
    splitChunks: {
        chunks: 'async',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
            vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        }
    }
}
```
利用SplitChunksPlugin 分离基础包

test: 匹配出需要分离的包
```js
optimization.splitChunks.cacheGroups={
    commons: {
        test:/(react|react-dom)/,
        name: 'vendors',
        chunks: 'all'
    }
}
```

利用SplitChunksPlugin 分离公共文件

minChunks: 设置最小引用次数为2次
minSize：分离的包体积的大小
```js
optimiaztion.splitChunks={
    minSize: 0,
    cacheGroups:{
        commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2
        }
    }
}
```

Tree Shaking(摇树优化)
概念： 1个模块可能有多个方法，只要其中的某个方法使用到了，则整个文件都会被打到bundle里面去，tree-shaking就是只把用到的方法打入bundle，没用到的方法会在uglify阶段被擦除掉。

使用：webpack默认支持，在.babelrc中里设置modules:false即可
* production mode的情况下默认开启
  
要求: 必须是ES6的语法,CJS的方式不支持

DCE(Dead code elimination)
代码不会被执行,不可到达
代码执行的结果不会被用到
代码只会影响死变量(只写不读)

Tree-Shanking原理
利用ES6 模块的特点:
* 只能作为模块顶层的语句出现(静态编译)
* import的模块名只能是字符串常量
* import binding 是 immutable的
代码擦除:uglify阶段删除无用代码

现象:构建后的代码存在大量闭包代码
```js
    //a.js
    export default 'xxxx';
    //b.js
    import index from './a';
    console.log(index);
```
--->
```js
function(module,__webpack_exports__,webpack_require__){
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    var _js_index_WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(
        console.log(__js_index_WEBPACK_IMPORTED_MODULE_0__["default"]);
    );
}
```

会导致什么问题?
大量作用域包裹代码,导致体积增大(模块越多越明显)
运行代码时创建的函数作用域变多,内存开销变大

模块转换分析
```js
import { helloworld } from './helloworld';
import '../../common';

document.write(helloworld());
```
--->
```js
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__= __webpack_requrie__(1);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__= __webpack_requrie__(2);
```
结论:
* 被webpack转换后的模块会带上一层包裹
* import 会被转换成 __webpack_require

进一步分析webpack的模块机制
分析:
* 打包出来的是一个IIFE(匿名闭包)
* modules是一个数组,每一项是一个模块初始化函数
* __webpack_require 用来加载模块,返回 modules.exports
* 通过`WEBPACK_REQUIRE_METHOD(0)` 启动程序
  
scope hoisting原理
原理: 将所有模块的代码按照引用顺序放在一个函数作用域里,然后适当的重命名一些变量以防止变量名冲突
对比: 通过scope hoisting可以减少函数声明代码和内存开销
scope hoisting使用
webpack mode为production 默认开启
必须是ES6语法 CJS不支持

```js
    const plugins=[
        new webpack.optimize.ModuleConcatenationPlugin();
    ];
```
代码分割的意义

对于大的web应用来讲,将所有的代码都放在一个文件中显然是不够有效的,
特别是当你的某些代码是在某些特殊的时候才会被使用到.webapck有一个功能就是将你的
代码库分割成chunks(语块),当代码运行到需要它们的时候在进行加载.

适用的场景:
抽离相同代码到一个共享块
脚本懒加载,使得初始下载的代码更小

懒加载JS脚本的方式
CommonjS: require.ensure
ES6: 动态import(目前还没原生支持,需要babel转换)

如果使用动态 import?
安装babel插件 @babel/plugin-syntax-dynamic-import
```js
const plugins=['@babel/plugin-syntax-dynamic-import'];
```
代码分割效果
Assert Size Chunks
xxxx.js 176 bytes 2 [emmitted]


ESLint的必要性
案例: 某手机系统的webview而没有使用X5内核,解析JSON时遇到重复key报错,导致白屏
> 如何避免类似代码问题?

行业里优秀的 ESLint 规范实践
腾讯: 
* alloyteam 团队-> eslint-config-alloy
* ivweb 团队-> eslint-config-ivweb

制定团队的ESLint 规范
不重复早轮子,基于 eslint:recommend 配置并改进
能够帮助发现代码错误的规则,全部开启
帮助保持团队的代码风格统一,而不是限制开发体验

ESLint如何落地
和CI/CD系统集成,和webpack集成
方案一: webpack与CI/CD集成
**CI PIPELINE** 增加 lint pipeline
本地开发阶段增加pre commit钩子
1. 安装husky
2. 增加npm script -> precommit lint-staged
```json
{
    "lint-staged":{ linters:{"*.{js,scss}":["eslint --fix","git add"]}}
}
```
方案二: webpack与ESLint集成
使用eslint-loader,构建时检查JS规范
```js
module.rules[0].use=['babel-loader','eslint-loader'];
```

webpack打包库和组件
webpack除了可以用来打包应用,也可以用来打包js库
实现一个大整数加法的打包
* 需要打包压缩版和非压缩版本
* 支持AMD/CJS/CJS/ESM 模块引入
库的目录结构和打包要求
打包输出的库名称:
* 未压缩版 large-number.js
* 压缩版 large-number.min.js
```
|-/dist
|--large-number.js
|--large-number.min.js
|-webpack.config.js
|-package.json
|-/src
|--index.js
```
支持的使用方式
ESM: `import * as largeNumber from 'large-number'; largeNumber(a,b);`

CJS: `const largeNumber = require('large-number'); largeNumber(a,b);`

AMD: `require(['large-number'],function(largeNumber){ largeNumber(a,b);});`

可以直接通过script引入 
```html
<script src="https://unpkg.com/large-number"></script>
<script>
    // global variable
    largeNumber('999','1');
    // Property in the window object
    window.largeNumber('999','1');
</script>
```

如何将库暴露出去?
library: 指定库的全局变量
libraryTarget: 支持库的引入方式

```js
module.exports={
    mode: 'production',
    entry:{
        'large-number': './src/index.js',
        'large-number.min': './src/index.js'
    },
    output:{
        filename: '[name].js',
        library: 'largeNumber',
        libraryExport:'default',
        libraryTarget:'umd'
    }
}
```
如何只对 .min压缩
通过inclue设置 只压缩min.js 结尾的文件
```js
optimization={
    minimize: true,
    minmizer:[
        new TerserPlugin({
            inclue: /\.min\.js$/
        })
    ]
}
```

设置入口文件 package.json的main字段为 index.js
```js
 if(process.env.NODE_ENV === 'production') module.exports=require('./dist/large-number.min.js');
 else module.exports=require('./dist/large-number.js');
 ```

 页面打开过程
 服务端渲染(SSR)是什么
渲染:HTML+CSS+JS+Data -> 渲染后的HTML

服务端:
所有模板等资源都存在服务端
内网机器拉取数据更快
一个HTML返回所有数据

浏览器和服务器交互流程
请求开始-server-{html-template,data}-serverRender
-浏览器解析并渲染-加载并执行js和其他资源-页面完全可交互


客户端渲染vs服务端渲染
|          | 客户端渲染                                | 服务端渲染            |
| -------- | ----------------------------------------- | --------------------- |
| 请求     | 多个请求(HTML,数据等)                     | 1个请求               |
| 加载过程 | HTML&数据串行加载                         | 1个请求返回HTML和数据 |
| 渲染     | 前端渲染                                  | 服务端渲染            |
| 可交互   | 图片等静态资源加载完成,JS逻辑执行完可交互 |

总结: 服务端渲染(SSR)的核心是减少请求

SSR的优势
1. 减少白屏时间
2. 对于SEO友好

SSR代码实现思路
服务端
* 使用 react-dom/server的 renderToString 方法将React组件渲染成字符串
* 服务端路由返回对应的模板
客户端
* 打包出针对服务端的组件

Webapck ssr打包存在的问题
浏览器全局变量(Node.js中 没有 document,window);
* 组件适配: 将不兼容的组件根据打包环境进行适配
* 请求适配: 将fetch或者ajax发送请求的写法改成`isomorphic-fetch`或者`axios`
样式问题(Node.js无法解析样式css)
* 方案一: 服务端打包通过ignore-loader忽略掉css的解析
* 方案二: 将style-loader替换成isomorphic-style-loader
  
如何解决样式不显示的问题?

使用打包出来的浏览器端HTML为模板

设置占位符,动态插入组件
`<!--HTML_PLACEHOLDER-->`

首屏数据如何处理
服务端获取数据
替换占位符

当前构建时的日志显示
展示一大堆日志,很多并不是开发者关注
统计信息 stats
| preset      | alternative | description                    |
| ----------- | ----------- | ------------------------------ |
| errors-only | none        | 只在发生错误时输出             |
| minimal     | none        | 只在发生错误或有新的编译时输出 |
| none        | false       | 没有输出                       |
| normal      | true        | 标准输出                       |
| verbose     | none        | 全部输出                       |


如何优化命令行的构建日志
使用 friendly-errors-webpack-plugin
* success 构建成功的日志提示
* warning 构建警告时的日志提示
* error 构建报错时的日志提示

stats 设置成erros-only
```js
const plugins=[new FriendlyErrorsWebpackPlugin()];
const stats="errors-only";
```

如何判断构建是否成功?
 在CI/CD 的 pipeline 或者发布系统需要知道当前构建状态

 每次构建完成后输入 `echo $?` 获取错误码

构建异常和中断处理
webpack4之前的版本构建失败不会抛出错误码(error code)
Node.js  中的 prcess.exit 规范
* 0 表示成功完成,回调函数中,err 为null
* 非0 表示执行失败,回调函数中,error不为null,error.code 就是传给exit的数字

如何主动捕获并处理构建错误?
compiler在每次构建结束后出发 done这个 hook

process.exit 主动处理构建报错
```js
plugins:[
    function(){
        this.hook.done.tap('done',(stats)=>{
            if(stats.compilation.erros && stats.compilation.erros.length && process.argv.indexOf('--watch')===-1){
                console.log('build error');
                process.exit(1);
            }
        })
    }
]
```