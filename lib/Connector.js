const debug = require('debug')('meshblu-connector-linux-citrix-receiver:Connector')
const { EventEmitter } = require('events')
const bindAll = require('lodash/fp/bindAll')
const get = require('lodash/fp/get')
const Receiver = require('./Receiver')
const WindowManager = require('./WindowManager')

class Connector extends EventEmitter {
  constructor() {
    super()
    bindAll(Object.getOwnPropertyNames(Connector.prototype), this)

    this.receiver = new Receiver()
    this.windowManager = new WindowManager()
  }

  start(device, callback) {
    debug('run')

    this.onConfig(device)
    setInterval(this._ensureReceiver, 60 * 1000)
    setInterval(this._minimizeDesktop, 10 * 1000)
    setInterval(this._minimizeStartBar, 10 * 1000)
    setTimeout(this._ensureReceiver, 0)
    callback()
  }

  onConfig(device) {
    this.options = get('options', device)
  }

  _ensureReceiver() {
    this.receiver.ensure(this.options, (error) => {
      if (error) {
        this.emit('message', { devices: ['*'], data: { error: error.message } })
      }
    })
  }

  _minimizeDesktop() {
    this.windowManager.minimize(null, (error) => { // Desktop is the only window with no title
      if (error) {
        console.error('_minimizeDesktop', error.message) // eslint-disable-line no-console
      }
    })
  }

  _minimizeStartBar() {
    this.windowManager.minimize('Shell_TrayWnd', (error) => {
      if (error) {
        console.error('_minimizeStartBar', error.message) // eslint-disable-line no-console
      }
    })
  }
}

module.exports = Connector
