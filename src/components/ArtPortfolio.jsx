import { artPieces } from '../data/siteContent'
import { SectionHeading } from './SectionHeading'
import './ArtPortfolio.css'

export function ArtPortfolio() {
  return (
    <section id="art" className="art" aria-labelledby="art-heading">
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
                <img
                  src={item.src}
                  alt=""
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{item.title}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
