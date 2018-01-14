const Bugjs = require('./libs/debug')
const util = require('util')
const fs = require('fs')


var log = Bugjs()
var log1 = Bugjs('http')

// log.config({
//   bright: false,
//   absolute: false,
//   date: true,
//   store: true,
//   // console: false,
//   // debug: false
// })

log1.config({
  categorieColor: 'bgGreen'
})
// 记录到日志
log.storeHandler = function (log) {
  var logs = []
  for (var key in log) {
    if (key !== 'logs') {
      logs.push(log[key])
    }
  }
  logs.push(' ')
  fs.appendFileSync(this.categorie + '.log', logs.concat(log.logs).join('') + '\n')
}

log.log('hello')
log.info('这是info提示信息')
log.success('这是success提示信息')
log.error('这是error提示信息')
log.warn('这是warn提示信息')


log1.log('hello')
log1.info('这是info提示信息')
log1.success('这是success提示信息')
log1.error('这是error提示信息')
log1.warn('这是warn提示信息')

// process.stdin.on('data', data => {

//   console.log(data)
//   process.stdout.write('λ ')
// })
