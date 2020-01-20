'use strict'

const {
  pipeline: streamPipeline,
  PassThrough: PassThroughStream
} = require('stream')

const zlib = require('zlib')

/**
 * Decompresses an incoming HTTP request body stream if needed.
 *
 * @name decompressRequest
 * @function
 *
 * @param {IncomingMessage} request
 *
 * @return {IncomingMessage}
 */
module.exports = function(request) {
  const contentEncoding = (
    request.headers['content-encoding'] || ''
  ).toLowerCase()

  if (!['gzip', 'deflate', 'br'].includes(contentEncoding)) {
    return request
  }

  // TODO: Remove this when targeting Node.js 12.
  const isBrotli = contentEncoding === 'br'
  if (isBrotli && typeof zlib.createBrotliDecompress !== 'function') {
    return request
  }

  const decompress = isBrotli
    ? zlib.createBrotliDecompress()
    : zlib.createUnzip()
  const stream = new PassThroughStream()

  decompress.on('error', (error) => {
    // Ignore empty request
    if (error.code === 'Z_BUF_ERROR') {
      stream.end()
      return
    }

    stream.emit('error', error)
  })

  return streamPipeline(request, decompress, stream, () => {})
}
