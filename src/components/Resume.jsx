import resumePdfUrl from '../assets/GioResume.pdf?url'
import { resumeProfile as r } from '../data/siteContent'
import { SectionHeading } from './SectionHeading'
import './Resume.css'

export function Resume() {
  return (
    <section id="resume" className="resume" aria-labelledby="resume-heading">
      <div className="resume__container">
        <SectionHeading
          id="resume-heading"
          eyebrow="Background"
          title="Resume"
          intro="Work history at a glance. Download the PDF for the full résumé."
        />

        <p className="resume__pdf-lead">
          <a
            className="resume__pdf-link"
            href={resumePdfUrl}
            download="GioResume.pdf"
          >
            Download résumé (PDF)
          </a>
        </p>

        <h3 className="resume__section-label">Experience</h3>
        <ul className="resume__roles">
          {r.experience.map((job) => (
            <li key={`${job.company}-${job.dateRange}`} className="resume__role">
              <div className="resume__role-text">
                <span className="resume__role-title">{job.title}</span>
                <span className="resume__role-meta">
                  {job.company} · {job.location}
                </span>
              </div>
              <span className="resume__role-dates">{job.dateRange}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
