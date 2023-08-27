'use client'

import { useModal } from '@/hooks/use-modal-store'
import { useOrigin } from '@/hooks/use-origin'
import axios from 'axios'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const InviteModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal()
  const origin = useOrigin()

  const isModalOpen = isOpen && type === 'invite'
  const { server } = data

  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const onGenerate = async () => {
    try {
      setIsGenerating(true)

      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`,
      )

      onOpen('invite', { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Invite People
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
            Invite Link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
              readOnly
              disabled={isGenerating}
            />
            <Button size="icon" onClick={onCopy} disabled={isGenerating}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            variant="link"
            size="sm"
            className="mt-4 text-xs text-zinc-500"
            disabled={isGenerating}
            onClick={onGenerate}
          >
            Generate New Link
            <RefreshCw className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteModal
