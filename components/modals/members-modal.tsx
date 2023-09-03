'use client'

import { MemberRole } from '@prisma/client'
import { DialogDescription } from '@radix-ui/react-dialog'
import axios from 'axios'
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useState } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { ScrollArea } from '../ui/scroll-area'
import UserAvatar from '../user-avatar'

import { useModal } from '@/hooks/use-modal-store'
import { ServerWithMembersWithProfiles } from '@/types'

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
}

const MembersModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal()
  const [loadingId, setLoadingId] = useState('')
  const router = useRouter()

  const isModalOpen = isOpen && type === 'members'
  const { server } = data as { server: ServerWithMembersWithProfiles }

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server.id },
      })

      const response = await axios.delete(url)

      if (response.status === 200) {
        router.refresh()
        onOpen('members', { server: response.data })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server.id },
      })

      const response = await axios.patch(url, { role })

      if (response.status === 200) {
        router.refresh()
        onOpen('members', { server: response.data })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div className="mb-6 flex items-center gap-x-2" key={member.id}>
              <UserAvatar src={member.profile?.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-1 text-xs font-semibold">
                  {member.profile?.name.split(' ')[0]}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto px-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="mr-2 h-4 w-4 text-zinc-500" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, 'GUEST')}
                              >
                                <Shield className="mr-2 h-4 w-4 text-zinc-500" />
                                Guest
                                {member.role === 'GUEST' && (
                                  <Check className="ml-auto h-4 w-4 text-indigo-500" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, 'MODERATOR')
                                }
                              >
                                <ShieldCheck className="mr-2 h-4 w-4 text-zinc-500" />
                                Moderator
                                {member.role === 'MODERATOR' && (
                                  <Check className="ml-2 h-4 w-4 text-indigo-500" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-rose-500"
                          onClick={() => onKick(member.id)}
                        >
                          <Gavel className="w- mr-2 h-4" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="ml-auto h-4 w-4 animate-spin to-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default MembersModal
