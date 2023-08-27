import { useEffect, useState } from 'react'

export const useOrigin = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const origin =
    typeof window !== 'undefined' && isMounted ? window.location.origin : ''

  if (!isMounted) return null

  return origin
}
