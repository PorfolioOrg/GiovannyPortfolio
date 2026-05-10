import { contact } from '../data/siteContent'
import { SectionHeading } from './SectionHeading'
import './Contact.css'

/** Lighten very dark brand fills so glyphs read on near-black backgrounds. */
function contactIconFill(hex) {
  const clean = String(hex).replace(/^#/, '')
  const n = parseInt(clean, 16)
  if (!Number.isFinite(n)) return '#9a9a9a'
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  if (lum < 0.38) {
    return `color-mix(in srgb, #a8a8a8 70%, #${clean} 30%)`
  }
  return `color-mix(in srgb, #8c8c8c 48%, #${clean} 52%)`
}

function ContactToolLink({ item }) {
  const { icon, href, label } = item
  const fill = contactIconFill(icon.hex)
  return (
    <li>
      <a
        className="contact__tool"
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${label} (opens in a new tab)`}
      >
        <span className="contact__tool-icon" style={{ color: fill }}>
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d={icon.path} fill="currentColor" />
          </svg>
        </span>
        <span className="contact__tool-label">{label}</span>
      </a>
    </li>
  )
}

export function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-heading">
      <div className="contact__ambient">
        <ul className="contact__tools contact__tools--rail contact__tools--rail-left">
          {contact.toolkitLeft.map((item) => (
            <ContactToolLink key={item.label} item={item} />
          ))}
        </ul>
        <ul className="contact__tools contact__tools--rail contact__tools--rail-right">
          {contact.toolkitRight.map((item) => (
            <ContactToolLink key={item.label} item={item} />
          ))}
        </ul>
      </div>
      <div className="contact__container">
        <SectionHeading
          id="contact-heading"
          eyebrow="Hello"
          title="Contact"
          intro={contact.headingIntro}
        />
        {contact.designBlurbs.map((text, i) => (
          <p key={i} className="contact__design-blurb">
            {text}
          </p>
        ))}
        <div className="contact__links">
          <a className="contact__email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <ul className="contact__social">
            {contact.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer noopener">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
