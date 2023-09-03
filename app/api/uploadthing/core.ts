import { auth } from '@clerk/nextjs'
import { type FileRouter, createUploadthing } from 'uploadthing/next'

const f = createUploadthing()

const handleAuth = async () => {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')
  return { userId }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log('image uploaded')
    }),

  messageFile: f(['image', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log('message file uploaded')
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
