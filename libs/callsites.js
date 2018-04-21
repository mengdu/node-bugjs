/**
* Get callsites from the V8 stack trace API
* @reutrn {Callsites} Callsites.stack
* stack.getTypeName()
* stack.getFunctionName()
* stack.getMethodName()
* stack.getFileName()
* stack.getLineNumber()
* stack.getColumnNumber()
* stack.getEvalOrigin()
**/
const Callsites = function () {
  var orig = Error.prepareStackTrace
  Error.prepareStackTrace = function (error, stack) {
    Error.prepareStackTrace = orig
    return stack
  }
  Error.captureStackTrace(this, arguments.callee)
}

module.exports = Callsites
