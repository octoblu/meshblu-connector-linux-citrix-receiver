const { compact, map, trim, split } = require('lodash/fp')

const lines = text => split('\n', text)

const trimAll = strings => map(trim, strings)

const nonEmptyLines = text => compact(trimAll(lines(text)))

const mapNonEmptyLines = (fn, text) => map(fn, nonEmptyLines(text))

const columns = text => split(/\s+/, text)

module.exports = { columns, mapNonEmptyLines }
