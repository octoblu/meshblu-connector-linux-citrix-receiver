const child_process = require('child_process') // eslint-disable-line camelcase
const debug = require('debug')('meshblu-connector-linux-citrix-receiver:Receiver')
const bindAll = require('lodash/fp/bindAll')
const contains = require('lodash/fp/contains')
const filter = require('lodash/fp/filter')
const get = require('lodash/fp/get')
const isEmpty = require('lodash/fp/isEmpty')
const size = require('lodash/fp/size')
const split = require('lodash/fp/split')
const LaunchDesktop = require('./LaunchDesktop')

class Receiver {
  constructor() {
    bindAll(Object.getOwnPropertyNames(Receiver.prototype), this)
    this.launchDesktop = new LaunchDesktop()
  }

  ensure(options, callback) {
    debug('ensure')

    const name = get('query.name', options)
    if (isEmpty(name)) return callback(new Error('device options did not contain a query.name'))

    this._checkXenDesktopConnection((error, sessionsCount) => {
      debug('checkXenDesktopConnection', error, sessionsCount)
      if (error) return callback(error)
      if (sessionsCount > 0) return callback()

      this.launchDesktop.start(options, callback)
    })
  }

  _checkXenDesktopConnection(callback) {
    child_process.exec('ps aux', { env: { DISPLAY: ':0' } }, (error, stdout, stderr) => {
      if (error) return callback(error)
      if (stderr) debug(stderr)
      debug('ps aux', stdout)

      const lines = split('\n', stdout)
      return callback(null, size(filter(contains('/opt/Citrix/ICAClient/wfica'), lines)))
    })
  }
}

module.exports = Receiver
