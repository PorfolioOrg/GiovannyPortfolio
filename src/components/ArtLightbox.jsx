import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './ArtLightbox.css'

function IconChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 6l-6 6 6 6"
      />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6l6 6-6 6"
      />
    </svg>
  )
}

/**
 * Full-screen dialog: folder-based image carousel + title/description panel.
 * Escape, backdrop click, and Close dismiss; body scroll locked while open.
 */
export function ArtLightbox({ piece, onClose }) {
  const closeRef = useRef(null)
  const [slideIndex, setSlideIndex] = useState(0)

  const images =
    piece?.images?.length > 0 ? piece.images : piece?.src ? [piece.src] : []

  const goPrev = useCallback(() => {
    if (images.length < 2) return
    setSlideIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  const goNext = useCallback(() => {
    if (images.length < 2) return
    setSlideIndex((i) => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    setSlideIndex(0)
  }, [piece?.id])

  useEffect(() => {
    if (!piece) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [piece, onClose, goPrev, goNext])

  if (!piece || images.length === 0) return null

  const titleId = `art-lightbox-title-${piece.id}`
  const currentSrc = images[slideIndex] ?? images[0]
  const showNav = images.length > 1

  return createPortal(
    <div
      className="art-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="art-lightbox__backdrop"
        aria-label="Close artwork details"
        onClick={onClose}
      />
      <div className="art-lightbox__panel">
        <button
          ref={closeRef}
          type="button"
          className="art-lightbox__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="art-lightbox__layout">
          <div className="art-lightbox__visual">
            {showNav ? (
              <button
                type="button"
                className="art-lightbox__nav art-lightbox__nav--prev"
                aria-label="Previous image"
                onClick={goPrev}
              >
                <IconChevronLeft />
              </button>
            ) : null}
            <div className="art-lightbox__media">
              <img
                key={currentSrc}
                src={currentSrc}
                alt=""
                width={1200}
                height={1500}
                decoding="async"
              />
            </div>
            {showNav ? (
              <button
                type="button"
                className="art-lightbox__nav art-lightbox__nav--next"
                aria-label="Next image"
                onClick={goNext}
              >
                <IconChevronRight />
              </button>
            ) : null}
          </div>
          <aside className="art-lightbox__aside">
            <h2 id={titleId} className="art-lightbox__title">
              {piece.title}
            </h2>
            {piece.description ? (
              <p className="art-lightbox__desc">{piece.description}</p>
            ) : null}
            {showNav ? (
              <p className="art-lightbox__counter" aria-live="polite">
                {slideIndex + 1} / {images.length}
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </div>,
    document.body,
  )
}
