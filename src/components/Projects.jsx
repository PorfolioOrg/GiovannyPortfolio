import { projects } from '../data/siteContent'
import { SectionHeading } from './SectionHeading'
import './Projects.css'

export function Projects() {
  return (
    <section id="projects" className="projects" aria-labelledby="projects-heading">
      <div className="projects__container">
        <SectionHeading
          id="projects-heading"
          eyebrow="BUILT BY ME"
          title="Public projects"
          intro="Small builds and experiments where design decisions meet implementation."
        />
        <ul className="projects__list">
          {projects.map((p) => (
            <li key={p.title}>
              <article
                className="project-card"
                style={{ '--project-hover-glow': p.hoverGlow }}
              >
                <h3 className="project-card__title">{p.title}</h3>
                <p className="project-card__desc">{p.description}</p>
                <ul className="project-card__stack" aria-label="Tech stack">
                  {p.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
