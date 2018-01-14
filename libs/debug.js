const util = require('util')
const path = require('path')
const callsites = require('./callsites')
const styles = require('./styles')

// 标准输出
function stdout () {
  return process.stdout.write(util.format.apply(util, arguments) + '\n')
}

/**
* 返回调用脚本路径
* @param {Callsite Object} site 调用栈
* @param {Boolean} absolute 是否返回绝对路径
* @return {string} 返回路径
**/
function getSitePath (site, absolute) {
  // console.log(site.getFileName())
  // console.log(process.cwd())
  if (absolute) {
    return site.getFileName()
  }
  return path.relative(process.cwd(), site.getFileName())
}
/**
* 把字符串染色
*
**/
function dyeing (style, text) {
  var color = styles[style]
  return color[0] + text + color[1]
}

function val (val, defalutVal) {
  if (typeof val !== 'undefined') {
    return val
  }
  return defalutVal
}

/**
* 处理log数据
* @param {Object} debug
* @param {Object} log 配置
* @params {Array | arguments} 
**/
function makeLog (debug, log, params) {
  var args = {
    filename: '',
    date: '',
    categorie: '',
    logs: []
  }
  
  // 获取调用堆栈信息
  if (debug.debug) {
    var site = callsites()[2]
    var filePath = getSitePath(site, debug.absolute)
    var lineNumber = site.getLineNumber()
    var siteStr = '[' + filePath + ':' + lineNumber + ']'
    args.filename = siteStr
  }

  // 打上标签
  if (debug.categorie) {
    args.categorie = '[' + debug.categorie + ']'
  }
  // 打上时间
  if (debug.date) {
    args.date = '[' + new Date().toISOString() + ']'
  }
  // 处理要打印内容
  for (var index in params) {
    args.logs.push(util.format(params[index]))
  }
  // 调用storeHandler
  if (debug.store && typeof debug.storeHandler === 'function') {
    debug.storeHandler(args)
  }
  if (debug.console) {
    return dyeingLog(debug, log, args)
  }
}

function dyeingLog (debug, log, params) {
  var args = []
  if (params.filename) {
    args.push(dyeing(debug.filenameColor, params.filename))
  }
  if (params.categorie) {
    args.push(dyeing(debug.categorieColor, params.categorie))
  }
  if (params.date) {
    args.push(dyeing(debug.dateColor, params.date))
  }
  // 染色log
  if (log.color) {
    // 解决不可见字符出现空格问题
    var start = 0
    var end = params.logs.length - 1
    params.logs[start] = styles[log.color][0] + params.logs[start]
    params.logs[end] = params.logs[end] + styles[log.color][1]
  }
  // 打印log
  return stdout.apply(stdout, args.concat(params.logs))
}


function Debug (categorie) {
  if (this.constructor !== Debug) {
    // throw new TypeError('Constructor Debug requires \'new\'')
    return new Debug(categorie)
  }
  this.categorie = ''
  if (typeof categorie === 'string') {
    this.categorie = categorie
  }
  if (typeof categorie === 'object') {
    this.config(categorie)
  } else {
    this.config({})
  }
}

Debug.callsites = callsites

Debug.prototype.config = function (options) {
  this.console = val(options.console, true)
  this.store = val(options.store, false)
  this.categorie = options.categorie || this.categorie
  this.categorieColor = options.categorieColor || 'blue'
  this.debug = val(options.debug, process.env.NODE_ENV !== 'production')
  this.absolute = val(options.absolute, false)
  this.bright = val(options.bright, false)
  this.date = val(options.date, false)
  this.dateColor = options.dateColor || 'cyan'
  this.filenameColor = options.filenameColor || 'gray'
}

Debug.prototype.log = function () {
  return makeLog(this, {
      color: this.bright ? 'whiteBright' : 'white',
    },
    arguments)
}
Debug.prototype.success = function () {
  return makeLog(this,{
      color: this.bright ? 'greenBright' : 'green'
    },
    arguments)
}
Debug.prototype.error = function () {
  return makeLog(this, {
      color: this.bright ? 'redBright' : 'red'
    }, arguments)
}
Debug.prototype.warn = function () {
  return makeLog(this, {
      color: this.bright ? 'yellowBright' : 'yellow'
    }, arguments)
}
Debug.prototype.info = function () {
  return makeLog(this, {
      color: this.bright ? 'blueBright' : 'blue'
    }, arguments)
}

module.exports = Debug
