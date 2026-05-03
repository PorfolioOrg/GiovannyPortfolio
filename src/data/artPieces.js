/**
 * One grid item per asset folder: `preview`/`src` is the first image; `images` is every file in that folder for the modal carousel.
 */

const FOLDER_CONFIG = [
  {
    id: 'house',
    title: 'The Witch\'s House',
    previewIndex: 0, 
    description:
      'Environmental prop with an stylized cartoon style, made with Autodesk Maya and textured with Adobe Substance. Made with storytelling and atmosphere in mind to make it seem as the old house of a witch. Made using the PBR texture standard.',
  },
  {
    id: 'chest',
    title: 'Fantasy Chest',
    description:
      'Environmental high fantasy prop, designed with Maya, sculpted with Zbrush, and textured with Adobe Substance. Based on an original artist concept found on Pinterest (https://www.pinterest.com/pin/833869687258225827/). Made with especial care on details and preserving and stylized look and vision of the original artist. Made using the PBR texture standard.',
  },
  {
    id: 'pendant',
    title: 'Aqua\'s Wayfinder Pendant',
    description:
      'I made this model in Maya and Textured it with substance painter, the pendant is from the Kingdom Hearts Series. This model was made with reflections, micro detail, and clean Game like design in mind. Model is ready to be implemented into a 3D Game engine or 3d Animation software',
  },
  {
    id: 'potion',
    title: 'Life Potion',
    description:
      'I modeled this fantasy like table and potion in Maya and textured them in Substance. Rendered using Iray. Made with PBR texturing standard.I created the 3D model of the potion based off concept art I found on ',
      links: [
        {
          label: "Pinterest",
          url: "https://www.pinterest.com/pin/pocion-de-fuerza--515802963572498018/"
        }
      ]
    },
  {
    id: 'creature',
    title: 'Fantasy Creature: Ferrunec',
    description:
      'Creature Design study to create a unique Fantasy creature, that seems realistic and believable. This design explores the use of silhouette, surface detail, and lighting for a readable creature image. Especial care was place into making a creature that avoids the Chimera Architype.',
  },
  {
    id: 'spaceCaptain',
    title: 'It\'s Just the Two of Us...',
    description:
      'Storytelling SciFi illustration about two individuals trapped in a space vessel. Here we see the POV of a Captain that looks horrified at his subordinate that has just committed a most heinous act. The Captain realizing they are bound to this vessel together and never going back, we see they are getting farther and farther away from earth. But at least they have each other... for better and worse. Illustration made with Clip Studio Paint and Photoshop',
  },
  {
    id: 'witch',
    title: 'Weeba-Lu The Witch',
    description:
      'Character illustration made as character design commission for a YouTuber, it features a unique witch character that introduces all the unique features of the YouTuber\'s original character, adding costume and storytelling, with a Halloween theme and high contrast between colors. Illustration made with Procreate and Photoshop',
  },
  {
    id: 'axel',
    title: 'Axel\'s Weapon',
    previewIndex: 0, 
    description:
      'Axel\s weapon',
  },
]

const FOLDER_GLOBS = {
  house: import.meta.glob('../assets/house/*.webp', { eager: true, query: '?url', import: 'default' }),
  pendant: import.meta.glob('../assets/pendant/*.webp', { eager: true, query: '?url', import: 'default' }),
  chest: import.meta.glob('../assets/chest/*.webp', { eager: true, query: '?url', import: 'default' }),
  potion: import.meta.glob('../assets/potion/*.webp', { eager: true, query: '?url', import: 'default' }),
  creature: import.meta.glob('../assets/creature/*.webp', { eager: true, query: '?url', import: 'default' }),
  spaceCaptain: import.meta.glob('../assets/spaceCaptain/*.webp', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
  witch: import.meta.glob('../assets/witch/*.webp', { eager: true, query: '?url', import: 'default' }),
  axel: import.meta.glob('../assets/axel/*.webp',{ eager: true, query: '?url', import: 'default' })
}

function sortedUrls(modules) {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url)
}

function buildPiece(config) {
  const images = sortedUrls(FOLDER_GLOBS[config.id] ?? {})
  if (images.length === 0) return null
  const preview =
  images[config.previewIndex ?? 0] ?? images[0]
  return {
    id: config.id,
    title: config.title,
    description: config.description,
    links: config.links,
    src: preview,
    preview,
    images,
  }
}

export const artPieces = FOLDER_CONFIG.map(buildPiece).filter(Boolean)
