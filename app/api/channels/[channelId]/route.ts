import { NextRequest, NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.nextUrl)
    const serverId = searchParams.get('serverId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    if (!params.channelId) {
      return new NextResponse('Channel ID missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: ['ADMIN', 'MODERATOR'],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('CHANNELS_DELETE', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.nextUrl)
    const serverId = searchParams.get('serverId')
    const { name, type } = await req.json()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }

    if (!params.channelId) {
      return new NextResponse('Channel ID missing', { status: 400 })
    }

    if (name === 'general') {
      return new NextResponse('Cannot update general channel', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: ['ADMIN', 'MODERATOR'],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('CHANNELS_PATCH', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
