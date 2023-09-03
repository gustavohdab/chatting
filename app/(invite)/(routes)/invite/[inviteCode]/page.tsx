import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

interface InviteCodePage {
  params: {
    inviteCode: string
  }
}

const InviteCodePage = async ({ params }: InviteCodePage) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  if (!params.inviteCode) {
    return redirect('/')
  }

  const memberAlreadyInServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (memberAlreadyInServer) {
    return redirect(`/servers/${memberAlreadyInServer.id}`)
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return redirect('/')
}

export default InviteCodePage
