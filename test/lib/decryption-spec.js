/* eslint-disable func-names, prefer-arrow-callback, no-unused-expressions */

const { beforeEach, describe, it } = global
const { expect } = require('chai')
const { decrypt } = require('../../lib/decryption')

describe('decryption', function() {
  describe('decrypt', function() {
    describe('when given a key and encrypted message', function() {
      beforeEach(function() {
        this.key = 'mah-key'
        this.encryptedMessage = 'B6i7UDM5k9FIiYTta8eaAdELt3lth5I2mywAvf/lReZrLJ2i4TVNXjgI0YdAEz3l'
      })

      it('should decrypt to an object', function() {
        const decrypted = decrypt(this.key, this.encryptedMessage)
        expect(decrypted).to.deep.equal({
          title: 'One Night Of Persuasion',
        })
      })
    })
  })
})
