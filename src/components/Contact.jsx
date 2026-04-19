import { contact } from '../data/siteContent'
import { SectionHeading } from './SectionHeading'
import './Contact.css'

export function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-heading">
      <div className="contact__container">
        <SectionHeading
          id="contact-heading"
          eyebrow="Hello"
          title="Contact"
          intro="Reach out for collaborations, freelance work, or a conversation about design and code."
        />
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
