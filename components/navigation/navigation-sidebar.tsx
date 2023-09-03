import { UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { ModeToggle } from '../mode-toggle'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'

import { NavigationAction } from './navigation-action'
import NavigationItem from './navigation-item'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

const NavigationSidebar = async () => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
  }

  const server = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  return (
    <div className="flex h-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]">
      <NavigationAction />
      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
      <ScrollArea className="w-full flex-1">
        {server.map((server) => (
          <div className="mb-4" key={server.id}>
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            ></NavigationItem>
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'h-12 w-12',
            },
          }}
        />
      </div>
    </div>
  )
}

export default NavigationSidebar
