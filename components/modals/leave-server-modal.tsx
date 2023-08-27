'use client'

import { useModal } from '@/hooks/use-modal-store'
import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal()

  const router = useRouter()

  const isModalOpen = isOpen && type === 'leaveServer'
  const { server } = data

  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)

      await axios.patch(`/api/servers/${server?.id}/leave`)

      onClose()
      router.refresh()
      router.push('/')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Leave &apos;{server?.name}&apos;
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{' '}
            <span className="font-semibold text-indigo-600">
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoading} variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={onClick} variant="primary">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveServerModal
