import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await db.server.delete({
      where: { id: params.serverId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.log('[SERVERS_ID_DELETE_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile()
    const { name, imageUrl } = await req.json()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const server = await db.server.update({
      where: { id: params.serverId },
      data: {
        name,
        imageUrl,
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[SERVERS_ID_PATCH_ERROR]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
