"use client";

import { ReactLenis, useLenis } from '@studio-freight/react-lenis'

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  // Using useLenis inside components let's you subscribe to scroll events easily
  useLenis(({ scroll }: { scroll: number }) => {
    // Analytics/scroll-tracking can hook in here.
  })

  return (
    <ReactLenis root>
      { children }
    </ReactLenis>
  )
}
