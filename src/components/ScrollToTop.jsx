import { useState, useEffect, useCallback } from 'react'
import './ScrollToTop.css'

const HERO_ID = 'hero'

/**
 * Floating “back to top” control: visible once the hero has fully scrolled off-screen
 * (`getBoundingClientRect().bottom < 0`). Smooth-scroll respects reduced motion.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = () => document.getElementById(HERO_ID)

    const update = () => {
      const el = hero()
      if (!el) return
      setVisible(el.getBoundingClientRect().bottom < 0)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const scrollToTop = useCallback(() => {
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' })
  }, [])

  return (
    <button
      type="button"
      className={`scroll-to-top${visible ? ' scroll-to-top--visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg
        className="scroll-to-top__icon"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M18 15l-6-6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
