---
lastUpdated: false
---
# 学习webpack

[[toc]]

## Concepts

webpack is a **static** module bundler for modern JavaScript application

it internally builds a [dependency graph] from one or more entry points
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

## Entry
entry point = which module webpack begin building out its internal **dependency graph**.
figure out depends on(directly or indirectly).

`./src/index.js`

## Output
emit the bundles and specific the names of these files.
`./dist/main.js`
{ path, filename }

## Loaders
out of the box.webpack only understands JavaScript and JSON files.
Loaders help convert them into **valid moduels** and added to the *dependency graph*
{ test, use }    at `module.rules[]`
clause: path resolves to tested inside a `require()/import`.
use specific loader to transform it before you add it to the bundle.

## Plugins
leveraged to perform a wider range of tasks like 
bundle optimization , asset management and injection of enviroment variables.
*extend capabilities*
* require it
* push to plugins array
* create instance with `new`

## Mode
development,`production`,none
built-in  optimization that correspond to each environment.

## Browser Compatibility
supports all "ES5-compliant" 
webpack needs Promise for `import()`,`require.ensure()`.
to support older browser you need to load polyfill.

> Webpack 5 runs on Node.js version 10.13.0+

## Scenarios
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





  
