# node-bugjs

node-bugjs 是 node.js 的一个调试工具。

+ 支持5中主题样式（白，红，绿，黄，蓝）
+ 显示当前输出日志代码行号，方便开发调试
+ 支持定义log回调处理，实现log记录功能


> 注：已经不支持 [log-mini@1.0.0](https://www.npmjs.com/package/log-mini) 的用法。


**install**

```bat
npm install -S node-bugjs
```

```js
const bugjs = require('node-bugjs')

bug.log('wellcome')
```



## api

```js
const Bugjs = require('node-bugjs')

const bugjs = new Bugjs(options || 'categorie')
// or
const bugjs = Bugjs(options)
```


+ **Bugjs.prototype.config(options)** 配置
+ **Bugjs.prototype.log(any, any, ...)**
+ **Bugjs.prototype.info(any, any, ...)**
+ **Bugjs.prototype.success(any, any, ...)**
+ **Bugjs.prototype.error(any, any, ...)**
+ **Bugjs.prototype.warn(any, any, ...)**
+ **Bugjs.prototype.storeHandler = (logs) => {}** 定义log回调，可以用来实现记录日志
+ **Bugjs.callsites()** 获取调用栈，返回 CallSite 数组


**options：**

+ **options.console** 打印到控制台，默认true
+ **options.store** 是否开启写store回调，默认false
+ **options.categorie** 标签，默认''
+ **options.categorieColor** 标签样式，请看支持的 styles
+ **options.debug** 是否开启debug模式，默认 true (`process.env.NODE_ENV !== 'production'`)，开启后会显示当前调用文件行号
+ **options.absolute** 显示文件路径是否是绝对路径，默认 false
+ **options.bright** 是否亮色，默认 false
+ **options.date** 是否显示时间，默认 false
+ **options.dateColor** 显示时间样式，默认 'blue'，请看支持的 styles
+ **options.filenameColor** 文件名样式，默认 'gray'，请看支持的 styles


可以运行 `demo.js` 查看效果


> 注：显示文件名和行号会影响js性能，上线项目请自行删掉log，或者配置debug为false


## 记录日志

```js
// 记录到日志
bugjs.storeHandler = function (log) {
  var logs = []
  for (var key in log) {
    if (key !== 'logs') {
      logs.push(log[key])
    }
  }
  logs.push(' ')
  fs.appendFileSync(this.categorie + '.log', logs.concat(log.logs).join('') + '\n')
}

```

## 支持样式

```text
black
red
green
yellow
blue
magenta
cyan
white
gray

redBright
greenBright
yellowBright
blueBright
magentaBright
cyanBright
whiteBright

bgBlack
bgRed
bgGreen
bgYellow
bgBlue
bgMagenta
bgCyan
bgWhite

bgBlackBright
bgRedBright
bgGreenBright
bgYellowBright
bgBlueBright
bgMagentaBright
bgCyanBright
bgWhiteBright

```

## 效果图


![截图1][1]

[1]: imgs/20180114161250.png


## other

[colors](https://github.com/Marak/colors.js)
