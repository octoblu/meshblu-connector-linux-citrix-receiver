const bindAll = require('lodash/fp/bindAll')
const get = require('lodash/fp/get')
const has = require('lodash/fp/has')
const allPass = require('lodash/fp/allPass')
const StoreFrontICAGenerator = require('storefront-ica-generator')

class LaunchDesktop {
  constructor() {
    bindAll(Object.getOwnPropertyNames(LaunchDesktop.prototype), this)
  }

  start(options, callback) {
    const hasKeys = allPass([
      has('domain'),
      has('storeFrontUrl'),
      has('username'),
      has('password'),
      has(['query', 'name']),
      has(['query', 'type']),
    ])
    if (!hasKeys(options)) {
      return callback(new Error('Missing one of the required options to start desktop'))
    }
    new StoreFrontICAGenerator(options).generateAndLaunch(callback)
  }

  _fetchOptions(callback) {
    this.meshbluHttp.whoami((error, device) => {
      if (error) return callback(error)
      callback(null, get('options', device))
    })
  }
}

module.exports = LaunchDesktop
