/** Central copy + lists so sections stay presentational and easy to edit. */

export const site = {
  name: 'Giovanny Blanco',
  tagline: 'Graphic design roots · Web development focus',
}

export const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'art', label: 'Art' },
  { id: 'projects', label: 'Projects' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
]

export const artPieces = [
  {
    id: '1',
    title: 'Study I',
    src: 'https://picsum.photos/seed/gp1/800/1000',
    description:
      'Charcoal and digital composite exploring negative space and a single focal point.',
  },
  {
    id: '2',
    title: 'Study II',
    src: 'https://picsum.photos/seed/gp2/800/900',
    description: 'Color blocking exercise translating print layout logic to screen proportions.',
  },
  {
    id: '3',
    title: 'Study III',
    src: 'https://picsum.photos/seed/gp3/800/1100',
    description: 'Texture study: layering scans and vector shapes for depth without clutter.',
  },
  {
    id: '4',
    title: 'Study IV',
    src: 'https://picsum.photos/seed/gp4/800/950',
    description: 'Typography-led poster sketch; hierarchy tested at small and large sizes.',
  },
  {
    id: '5',
    title: 'Study V',
    src: 'https://picsum.photos/seed/gp5/800/1050',
    description: 'Motion-ready frames: composition that reads clearly at a glance.',
  },
  {
    id: '6',
    title: 'Study VI',
    src: 'https://picsum.photos/seed/gp6/800/880',
    description: 'Minimal palette and hard edges—constraints as a creative tool.',
  },
]

export const projects = [
  {
    title: 'Portfolio v1',
    description:
      'Single-page portfolio with scroll-driven navigation and a minimal typographic system.',
    stack: ['React', 'Vite', 'CSS'],
    /** Hover glow only (Projects card shadow); grayscale. */
    hoverGlow: '#d4d4d4',
  },
  {
    title: 'Brand microsite',
    description:
      'Landing page for a small studio: layout grids, responsive imagery, and motion hints.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    hoverGlow: '#9ca3af',
  },
  {
    title: 'UI kit exploration',
    description:
      'Component patterns and spacing scale reused across marketing pages.',
    stack: ['React', 'CSS'],
    hoverGlow: '#737373',
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
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/giovanny-blanco-b86234198',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/orgs/PorfolioOrg/people/Reovez',
  },
]

export const contact = {
  email: 'Throw2009@hotmail.com',
  social: contactSocialLinks,
}
