const child_process = require('child_process') // eslint-disable-line camelcase
const { find, isEmpty } = require('lodash/fp')
const { columns, mapNonEmptyLines } = require('./helpers')

const EXEC_OPTIONS = { env: { DISPLAY: ':0' } }

class WindowManager {
  constructor(dependencies = {}) {
    this.child_process = dependencies.child_process || child_process // eslint-disable-line camelcase
  }

  getWindow({ title }, callback) {
    this.getWindows((error, windows) => {
      if (error) return callback(error)

      callback(null, find({ title }, windows))
    })
  }

  getWindows(callback) {
    this.child_process.execFile('wmctrl', ['-l'], EXEC_OPTIONS, (error, stdout) => {
      if (error) return callback(error)

      callback(null, this.parseWindows(stdout))
    })
  }

  minimize(title, callback) {
    this.getWindow({ title }, (error, window) => {
      if (error) return callback(error)
      if (isEmpty(window)) return callback()

      this.child_process.execFile('xdotool', ['windowminimize', window.id], EXEC_OPTIONS, callback)
    })
  }

  parseWindow(line) {
    const [windowId, desktopId, clientMachine, windowTitle] = columns(line)

    return {
      id: windowId || null,
      desktopId: desktopId || null,
      machine: clientMachine || null,
      title: windowTitle || null,
    }
  }

  parseWindows(stdout) {
    return mapNonEmptyLines(this.parseWindow, stdout)
  }
}

module.exports = WindowManager
