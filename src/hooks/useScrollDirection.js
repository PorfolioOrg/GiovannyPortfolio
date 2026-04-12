import { useState, useEffect, useRef } from 'react'

/** Ignore tiny scroll jitter: only flip direction past this delta (px). */
const SCROLL_DELTA = 6

/**
 * Tracks vertical scroll direction for show/hide header behavior.
 * Returns 'up' | 'down' based on last meaningful movement.
 */
export function useScrollDirection() {
  const [direction, setDirection] = useState('up')
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const prev = lastY.current

      if (y < prev - SCROLL_DELTA) setDirection('up')
      else if (y > prev + SCROLL_DELTA) setDirection('down')

      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return direction
}
