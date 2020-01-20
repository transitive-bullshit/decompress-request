/// <reference types="node"/>
import { IncomingMessage } from 'http'

/**
Decompress an incoming HTTP request if needed.
@param request - The HTTP incoming stream with compressed data.
@returns The decompressed HTTP stream.
*/
declare function decompressRequest(request: IncomingMessage): IncomingMessage

export = decompressRequest
