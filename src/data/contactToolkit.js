import {
  si99designs,
  siAseprite,
  siBehance,
  siBlender,
  siCoreldraw,
  siDribbble,
  siFigma,
  siFramer,
  siGimp,
  siInkscape,
  siKrita,
  siLunacy,
  siMedibangpaint,
  siMiro,
  siPenpot,
  siPhotopea,
  siPixlr,
  siSketch,
} from 'simple-icons'

/**
 * Contact rails: left / right vertical strips. Each entry links to the product site.
 * Icons use Simple Icons paths; tints are applied in `Contact.jsx` for dark UI.
 */
export const contactToolkitLeft = [
  { label: 'Figma', href: 'https://www.figma.com/', icon: siFigma },
  { label: 'Sketch', href: 'https://www.sketch.com/', icon: siSketch },
  { label: 'Behance', href: 'https://www.behance.net/', icon: siBehance },
  { label: 'Dribbble', href: 'https://dribbble.com/', icon: siDribbble },
  { label: 'Photopea', href: 'https://www.photopea.com/', icon: siPhotopea },
  { label: 'Pixlr', href: 'https://pixlr.com/', icon: siPixlr },
  { label: 'Penpot', href: 'https://penpot.app/', icon: siPenpot },
  { label: 'Miro', href: 'https://miro.com/', icon: siMiro },
  { label: 'Framer', href: 'https://www.framer.com/', icon: siFramer },
]

export const contactToolkitRight = [
  { label: 'GIMP', href: 'https://www.gimp.org/', icon: siGimp },
  { label: 'Inkscape', href: 'https://inkscape.org/', icon: siInkscape },
  { label: 'Krita', href: 'https://krita.org/', icon: siKrita },
  { label: 'Blender', href: 'https://www.blender.org/', icon: siBlender },
  { label: 'CorelDRAW', href: 'https://www.coreldraw.com/', icon: siCoreldraw },
  { label: 'MediBang', href: 'https://medibangpaint.com/', icon: siMedibangpaint },
  { label: 'Lunacy', href: 'https://icons8.com/lunacy', icon: siLunacy },
  { label: 'Aseprite', href: 'https://www.aseprite.org/', icon: siAseprite },
  { label: '99designs', href: 'https://99designs.com/', icon: si99designs },
]

export const contactToolkit = [...contactToolkitLeft, ...contactToolkitRight]
