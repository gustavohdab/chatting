'use client'

import { Video, VideoOff } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { ActionTooltip } from '../action-tooltip'

export const ChatVideoButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || '',
        query: {
          video: isVideo ? undefined : true,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      },
    )

    router.push(url)
  }

  const isVideo = searchParams?.get('video') === 'true'

  const Icon = isVideo ? VideoOff : Video
  const tooltipLabel = isVideo ? 'End video call' : 'Start video call'
  return (
    <ActionTooltip label={tooltipLabel} side="bottom">
      <button
        className="mr-4 rounded-full p-2 transition hover:bg-gray-200 hover:opacity-75 dark:hover:bg-gray-700"
        onClick={onClick}
      >
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  )
}
