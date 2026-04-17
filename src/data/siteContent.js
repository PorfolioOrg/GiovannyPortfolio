/** Central copy + lists so sections stay presentational and easy to edit. */

export const site = {
  name: 'Giovanny Blanco',
  tagline: '3D/2D Multimedia Artist',
}

export const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'art', label: 'Art' },
  { id: 'projects', label: 'Projects' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
]

export { artPieces } from './artPieces.js'

export const projects = [
  {
    title: 'Mad Teleport',
    url: 'https://enriqueparis.itch.io/madteleport',
    description:
      'Game Off 2020 entry: a mad-scientist platformer shooter where you throw a Moon Ball and teleport to it—shoot, jump, and survive the lab.',
    stack: ['Godot', 'Game Jam', 'Windows'],
    hoverGlow: '#d4d4d4',
  },
]

/**
 * Experience lines for the Resume section (full detail is in `src/assets/GioResume.pdf`).
 */
export const resumeProfile = {
  experience: [
    {
      title: 'Team Member',
      company: 'Chick-fil-A',
      location: 'Sacramento, CA',
      dateRange: 'Aug 2024 – Present',
    },
    {
      title: 'Design Hub Intern',
      company: 'American River College',
      location: 'Sacramento, CA',
      dateRange: 'Feb 2022 – May 2024',
    },
    {
      title: 'Software Technician Tester',
      company: 'POS Portal',
      location: 'Sacramento, CA',
      dateRange: 'Jan 2022 – Jan 2023',
    },
  ],
}

/** URLs from résumé / portfolio (see `src/assets/GioResume.pdf`). */
export const contactSocialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/orgs/PorfolioOrg/people/Reovez',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/giovanny-blanco-b86234198',
  },
  {
    label: 'ArtStation',
    href: 'https://www.artstation.com/reovez',
  },
]

export const contact = {
  email: 'giovannyb.tcxr@gmail.com',
  social: contactSocialLinks,
}
