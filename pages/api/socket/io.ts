import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIo } from 'socket.io'

import { NextApiResponseServerIo } from '@/types'

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = (_req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    const httpServer: unknown = res.socket.server
    const io = new ServerIo(httpServer as NetServer, {
      path,
      // @ts-expect-error -- https://socket.io/docs/v3/server-initialization/#socketio-server-options
      addTrailingSlash: false,
    })
    res.socket.server.io = io
  }
  res.end()
}

export default ioHandler
