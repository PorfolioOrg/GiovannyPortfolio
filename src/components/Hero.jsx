import { lazy, Suspense } from 'react'
import { contact, site } from '../data/siteContent'
import './Hero.css'

const HeroBackground3D = lazy(() =>
  import('./HeroBackground3D').then((mod) => ({ default: mod.HeroBackground3D })),
)

export function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <Suspense fallback={null}>
        <HeroBackground3D />
      </Suspense>
      <div className="hero__inner">
        <h1 id="hero-title" className="hero__name">
          {site.name}
        </h1>
        <p className="hero__tagline">{site.tagline}</p>
        <nav className="hero__social" aria-label="Social profiles">
          <ul>
            {contact.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
