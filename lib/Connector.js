const debug = require('debug')('meshblu-connector-linux-citrix-receiver:Connector')
const { EventEmitter } = require('events')
const bindAll = require('lodash/fp/bindAll')
const get = require('lodash/fp/get')
const isEmpty = require('lodash/fp/isEmpty')
const Receiver = require('./Receiver')
const WindowManager = require('./WindowManager')
const { decrypt } = require('./decryption')
const { getMachineId } = require('./machine-id')
const { getPreSharedKey } = require('./pre-shared-key')

class Connector extends EventEmitter {
  constructor() {
    super()
    bindAll(Object.getOwnPropertyNames(Connector.prototype), this)

    this.machineId = getMachineId()
    this.receiver = new Receiver()
    this.windowManager = new WindowManager()
  }

  start(device, callback) {
    debug('run')

    this.onConfig(device)
    setInterval(this._ensureReceiver, 60 * 1000)
    setInterval(this._minimizeDesktop, 10 * 1000)
    setInterval(this._minimizeStartBar, 10 * 1000)
    setInterval(this._minimizeSkypeContacts, 10 * 1000)
    callback()
  }

  onConfig(device) {
    const encryptedOptions = get('encryptedOptions', device)

    if (isEmpty(encryptedOptions)) {
      this.options = get('options', device)
      this._ensureReceiver()
      return
    }

    getPreSharedKey(this.machineId, (error, preSharedKey) => {
      if (error) return console.error(error.stack) // eslint-disable-line no-console

      this.options = decrypt(preSharedKey, get('encryptedOptions', device))
      this._ensureReceiver()
    })
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

  _minimizeSkypeContacts() {
    this.windowManager.minimize('Skype for Business', (error) => {
      if (error) {
        console.error('_minimizeSkypeContacts', error.message) // eslint-disable-line no-console
      }
    })
  }
}

module.exports = Connector
