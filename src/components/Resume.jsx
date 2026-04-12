import { resumeItems } from '../data/siteContent'
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
          intro="A concise path from visual design to building on the web."
        />
        <ol className="resume__timeline">
          {resumeItems.map((item) => (
            <li key={item.title} className="resume__item">
              <span className="resume__period">{item.period}</span>
              <div className="resume__body">
                <h3 className="resume__title">{item.title}</h3>
                <p className="resume__detail">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
