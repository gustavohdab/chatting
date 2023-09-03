'use client'

import { cn } from '@/lib/utils'
import { ActionTooltip } from '../action-tooltip'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

interface NavigationItemProps {
  id: string
  name: string
  imageUrl: string
}

const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/servers/${id}`)
  }

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            'absolute left-0 w-1 rounded-r-full bg-primary transition-all',
            params?.serverId !== id && 'group-hover:w-5',
            params?.serverId === id ? 'h-9' : 'h-2',
          )}
        />

        <div
          className={cn(
            'group relative mx-3 flex h-12 w-12 overflow-hidden rounded-3xl transition-all group-hover:rounded-2xl',
            params?.serverId !== id && 'rounded-2xl bg-primary/10 text-primary',
          )}
        >
          <Image
            fill
            src={imageUrl}
            alt={`Image of ${name} server`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
          />
        </div>
      </button>
    </ActionTooltip>
  )
}

export default NavigationItem
