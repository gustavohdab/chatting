import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

export async function PATCH(
  _req: NextRequest,
  {
    params,
  }: {
    params: {
      serverId: string
    }
  },
) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.serverId) {
      return new NextResponse('Server ID Missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[SERVER_ID] PATCH ERROR: ', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
