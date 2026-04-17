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
