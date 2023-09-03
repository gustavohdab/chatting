'use client'

import { Command, SearchIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'

interface ServerSearchProps {
  data: {
    label: string
    type: 'channel' | 'member'
    data:
      | {
          icon: React.ReactNode
          name: string
          id: string
        }[]
      | undefined
  }[]
}

const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(!open)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const onClick = ({
    id,
    type,
  }: {
    id: string
    type: 'channel' | 'member'
  }) => {
    setOpen(false)

    if (type === 'member') {
      router.push(`/servers/${params.serverId}/conversation/${id}`)
    } else {
      router.push(`/servers/${params.serverId}/channels/${id}`)
    }
  }

  return (
    <>
      <button
        className="group flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10"
        onClick={() => setOpen(!open)}
      >
        <SearchIcon className="h-4 w-4 text-zinc-500 dark:to-zinc-400" />
        <p className="text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300">
          Search
        </p>

        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium text-muted-foreground transition group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
          <Command className="h-3 w-3 transition group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
          <span className="transition group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
            K
          </span>
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ label, data, type }) => {
            if (!data?.length) return null

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ icon, name, id }) => (
                  <CommandItem key={id} onSelect={() => onClick({ id, type })}>
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default ServerSearch
