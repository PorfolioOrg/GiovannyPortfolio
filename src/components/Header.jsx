import { useState, useEffect } from 'react'
import { useScrollDirection } from '../hooks/useScrollDirection'
import { navLinks, site } from '../data/siteContent'
import './Header.css'

/**
 * Fixed header: hides when user scrolls down (reads content), reappears on scroll up.
 * `header--hidden` toggles transform; near top of page we always show the bar.
 */
export function Header() {
  const direction = useScrollDirection()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const hide =
    direction === 'down' && scrollY > 72

  return (
    <header
      className={`site-header${hide ? ' site-header--hidden' : ''}`}
      role="banner"
    >
      {/* Hash links + `scroll-behavior` on `html` handle smooth scrolling; `scroll-padding-top` clears the fixed bar */}
      <a
        href="#hero"
        className="site-header__brand site-header__brand--mark"
        aria-label={`${site.name} — Home`}
      >
        <span className="site-header__mark" aria-hidden="true">
          GM
        </span>
      </a>
      <nav className="site-header__nav" aria-label="Primary">
        <ul>
          {navLinks.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
