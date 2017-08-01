const request = require('request')
const get = require('lodash/fp/get')
const isEmpty = require('lodash/fp/isEmpty')

const REQUEST_OPTIONS = {
  baseUrl: 'https://security-agency.smart.octo.space',
  json: true,
}

const getPreSharedKey = (machineId, callback) => {
  request.get(`/configurations/${machineId}`, REQUEST_OPTIONS, (error, response, body) => {
    if (error) return callback(error)
    if (response.statusCode !== 200) return callback(new Error(`Unexpected status code (${response.statusCode}): ${body}`))
    if (isEmpty(get('preSharedKey', body))) return callback(new Error('Security Agency Missing preSharedKey'))
    return callback(null, get('preSharedKey', body))
  })
}

module.exports = { getPreSharedKey }
