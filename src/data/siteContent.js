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
import proj1Img from '../assets/img/Proj1.jpg'
export const projects = [
  {
    title: 'Mad Teleport',
    url: 'https://enriqueparis.itch.io/madteleport',
    description:
      'Game Off 2020 entry: a mad-scientist platformer shooter where you throw a Moon Ball and teleport to it—shoot, jump, and survive the lab.',
    stack: ['Godot', 'Game Jam', 'Windows'],
    hoverGlow: '#d4d4d4',
    image: proj1Img,
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

import {
  contactToolkit,
  contactToolkitLeft,
  contactToolkitRight,
} from './contactToolkit.js'

export { contactToolkit, contactToolkitLeft, contactToolkitRight }

export const contact = {
  email: 'giovannyb.tcxr@gmail.com',
  social: contactSocialLinks,
  toolkit: contactToolkit,
  toolkitLeft: contactToolkitLeft,
  toolkitRight: contactToolkitRight,
  headingIntro:
    'Reach out for collaborations, freelance work, or a conversation about design and code.',
  designBlurbs: [
    'My work sits at the intersection of graphic design and multimedia: layout systems, typography, color, iconography, and presentation-ready visuals that still feel human.',
    'If you are shaping a brand, polishing a deck, or need a second pair of eyes on composition and hierarchy, I would love to hear what you are building and how I can help.',
  ],
}

