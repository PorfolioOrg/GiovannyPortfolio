import { useCallback, useState } from 'react'
import { artPieces } from '../data/siteContent'
import { SectionHeading } from './SectionHeading'
import { ArtLightbox } from './ArtLightbox'
import './ArtPortfolio.css'

export function ArtPortfolio() {
  const [activePiece, setActivePiece] = useState(null)
  const closeLightbox = useCallback(() => setActivePiece(null), [])

  return (
    <section id="art" className="art section--light" aria-labelledby="art-heading">
      <div className="art__container">
        <SectionHeading
          id="art-heading"
          eyebrow="Portfolio"
          title="Selected art"
          intro="Visual work that informs how I think about layout, contrast, and hierarchy on the web."
        />
        <ul className="art__grid">
          {artPieces.map((item) => (
            <li key={item.id} className="art__cell">
              <figure className="art__figure">
                <button
                  type="button"
                  className="art__thumb"
                  onClick={() => setActivePiece(item)}
                  aria-haspopup="dialog"
                  aria-expanded={activePiece?.id === item.id}
                  aria-label={`Open ${item.title} in detail view`}
                >
                  <img
                    src={item.src}
                    alt=""
                    width={800}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
                <figcaption>{item.title}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
      <ArtLightbox piece={activePiece} onClose={closeLightbox} />
    </section>
  )
}
