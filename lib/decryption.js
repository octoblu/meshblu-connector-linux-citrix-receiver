const crypto = require('crypto')

const decrypt = (key, encrypted) => {
  const decipher = crypto.createDecipher('aes256', key)
  let decrypted = decipher.update(encrypted, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return JSON.parse(decrypted)
}

module.exports = { decrypt }
