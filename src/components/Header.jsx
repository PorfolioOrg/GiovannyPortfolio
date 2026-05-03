import { useState, useEffect, useRef } from 'react'
import { useScrollDirection } from '../hooks/useScrollDirection'
import { navLinks, site } from '../data/siteContent'
// import siteLogoUrl from '../assets/StudioBlanKoLogo.jpg'
import siteLogoUrl from '../assets/Logo2Transparent.webp'
import './Header.css'

function IconMenu() {
  return (
    <svg className="site-header__menu-icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"
      />
    </svg>
  )
}

function IconClose() {
  return (
    <svg className="site-header__menu-icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="white"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Fixed header: hides when user scrolls down (reads content), reappears on scroll up.
 * `header--hidden` toggles transform; near top of page we always show the bar.
 */
export function Header() {
  const direction = useScrollDirection()
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    queueMicrotask(() => closeButtonRef.current?.focus())
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const hide = direction === 'down' && scrollY > 72

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={`site-header${hide ? ' site-header--hidden' : ''}${menuOpen ? ' site-header--menu-open' : ''}`}
      role="banner"
    >
      {/* Hash links + `scroll-behavior` on `html` handle smooth scrolling; `scroll-padding-top` clears the fixed bar */}
      <a
        href="#hero"
        className="site-header__brand site-header__brand--mark"
        aria-label={`${site.name} — Home`}
      >
        <img
          className="site-header__logo"
          src={siteLogoUrl}
          alt=""
          decoding="async"
        />
      </a>
      <nav className="site-header__nav site-header__nav--desktop" aria-label="Primary">
        <ul>
          {navLinks.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        ref={menuButtonRef}
        type="button"
        className="site-header__menu-toggle"
        aria-label="Menu"
        aria-expanded={menuOpen}
        aria-controls="site-header-nav-overlay"
        onClick={() => setMenuOpen(true)}
      >
        <IconMenu />
      </button>
      <div
        id="site-header-nav-overlay"
        className={`site-header__overlay${menuOpen ? ' site-header__overlay--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div
          className="site-header__overlay-backdrop"
          aria-hidden="true"
          onClick={closeMenu}
        />
        <div
          className="site-header__overlay-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="site-header__overlay-close"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <IconClose />
          </button>
          <nav className="site-header__overlay-nav" aria-label="Primary">
            <ul>
              {navLinks.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={closeMenu}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
