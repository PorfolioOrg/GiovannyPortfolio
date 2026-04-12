import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './ArtLightbox.css'

/**
 * Full-screen dialog: image + title/description. Portal keeps stacking above the fixed header.
 * Escape, backdrop click, and Close button dismiss; body scroll is locked while open.
 */
export function ArtLightbox({ piece, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!piece) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [piece, onClose])

  if (!piece) return null

  const titleId = `art-lightbox-title-${piece.id}`

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
          <div className="art-lightbox__media">
            <img
              src={piece.src}
              alt=""
              width={1200}
              height={1500}
              decoding="async"
            />
          </div>
          <aside className="art-lightbox__aside">
            <h2 id={titleId} className="art-lightbox__title">
              {piece.title}
            </h2>
            {piece.description ? (
              <p className="art-lightbox__desc">{piece.description}</p>
            ) : null}
          </aside>
        </div>
      </div>
    </div>,
    document.body,
  )
}
