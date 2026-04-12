import './SectionHeading.css'

/**
 * Reusable section title block: keeps rhythm and hierarchy consistent site-wide.
 */
export function SectionHeading({ id, eyebrow, title, intro }) {
  return (
    <header className="section-heading">
      {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="section-heading__title">
        {title}
      </h2>
      {intro ? <p className="section-heading__intro">{intro}</p> : null}
    </header>
  )
}
