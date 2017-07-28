/* eslint-disable func-names, prefer-arrow-callback, no-unused-expressions */

const { beforeEach, describe, it } = global
const { expect } = require('chai')
const sinon = require('sinon')
const WindowManager = require('../../lib/WindowManager')

describe('WindowManager', function() {
  beforeEach(function() {
    this.child_process = { execFile: sinon.stub() }
    this.sut = new WindowManager({ child_process: this.child_process })
  })

  describe('minimize', function() {
    describe('when there are no windows open', function() {
      beforeEach(function() {
        this.child_process.execFile.withArgs('wmctrl', ['-l'], { env: { DISPLAY: ':0' } }).yields(null, '\n')
      })

      describe('when called', function() {
        beforeEach(function(done) {
          this.sut.minimize('something', done)
        })

        it('should not do anything', function() {
          expect(this.child_process.execFile).to.have.been.calledOnce
        })
      })
    })

    describe('when there are two windows open', function() {
      beforeEach(function() {
        this.child_process.execFile.withArgs('wmctrl', ['-l'], { env: { DISPLAY: ':0' } }).yields(null, `
          0x01c000ee  0 raspberrypi
          0x01c000f0  0 raspberrypi Shell_TrayWnd
        `)
      })

      describe('when called with a window title not in the list', function() {
        beforeEach(function(done) {
          this.sut.minimize('something', done)
        })

        it('should not do anything', function() {
          expect(this.child_process.execFile).to.have.been.calledOnce
        })
      })

      describe('when called with a window title in the list', function() {
        beforeEach(function(done) {
          this.child_process.execFile.withArgs('xdotool', ['windowminimize', '0x01c000f0'], { env: { DISPLAY: ':0' } }).yields()
          this.sut.minimize('Shell_TrayWnd', done)
        })

        it('should have attempted to minimize the window', function() {
          expect(this.child_process.execFile).to.have.been.calledTwice
          expect(this.child_process.execFile).to.have.been.calledWith('xdotool', ['windowminimize', '0x01c000f0'], { env: { DISPLAY: ':0' } })
        })
      })

      describe('when called with a null window title, which appears in the list', function() {
        beforeEach(function(done) {
          this.child_process.execFile.withArgs('xdotool', ['windowminimize', '0x01c000ee'], { env: { DISPLAY: ':0' } }).yields()
          this.sut.minimize(null, done)
        })

        it('should have attempted to minimize the window', function() {
          expect(this.child_process.execFile).to.have.been.calledTwice
          expect(this.child_process.execFile).to.have.been.calledWith('xdotool', ['windowminimize', '0x01c000ee'], { env: { DISPLAY: ':0' } })
        })
      })
    })
  })
})
