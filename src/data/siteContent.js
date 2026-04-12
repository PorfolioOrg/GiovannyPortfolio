/** Central copy + lists so sections stay presentational and easy to edit. */

export const site = {
  name: 'Giovanny Machado',
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
  { id: '1', title: 'Study I', src: 'https://picsum.photos/seed/gp1/800/1000' },
  { id: '2', title: 'Study II', src: 'https://picsum.photos/seed/gp2/800/900' },
  { id: '3', title: 'Study III', src: 'https://picsum.photos/seed/gp3/800/1100' },
  { id: '4', title: 'Study IV', src: 'https://picsum.photos/seed/gp4/800/950' },
  { id: '5', title: 'Study V', src: 'https://picsum.photos/seed/gp5/800/1050' },
  { id: '6', title: 'Study VI', src: 'https://picsum.photos/seed/gp6/800/880' },
]

export const projects = [
  {
    title: 'Portfolio v1',
    description:
      'Single-page portfolio with scroll-driven navigation and a minimal typographic system.',
    stack: ['React', 'Vite', 'CSS'],
  },
  {
    title: 'Brand microsite',
    description:
      'Landing page for a small studio: layout grids, responsive imagery, and motion hints.',
    stack: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'UI kit exploration',
    description:
      'Component patterns and spacing scale reused across marketing pages.',
    stack: ['React', 'CSS'],
  },
]

export const resumeItems = [
  {
    period: '2024 — Present',
    title: 'Web development (transition)',
    detail: 'Building interfaces with React, focusing on layout, accessibility, and performance.',
  },
  {
    period: '2019 — 2024',
    title: 'Graphic designer',
    detail: 'Visual systems, print and digital campaigns, and client-facing presentation design.',
  },
  {
    period: 'Education',
    title: 'Design foundation',
    detail: 'Formal training in composition, typography, and color — applied now to the web.',
  },
]

export const contact = {
  email: 'hello@example.com',
  social: [
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Behance', href: 'https://behance.net' },
  ],
}
