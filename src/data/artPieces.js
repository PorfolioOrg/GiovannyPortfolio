/**
 * One grid item per asset folder: `preview`/`src` is the first image; `images` is every file in that folder for the modal carousel.
 */

const FOLDER_CONFIG = [
  {
    id: 'house',
    title: 'House',
    previewIndex: 1, 
    description:
      'Environment block-out through final mood: scale, storytelling props, and atmosphere in one set.',
  },
  {
    id: 'chest',
    title: 'Chest',
    description:
      'Hard-surface sculpt and render study—material reads, edge flow, and presentation for a hero prop.',
  },
  {
    id: 'pendant',
    title: 'Pendant',
    description:
      'Small-object focus: reflections, micro-detail, and clean turntable-style framing.',
  },
  {
    id: 'potion',
    title: 'Potion',
    description:
      'Glass and liquid look dev—transmission, caustics hints, and label-friendly hero framing.',
  },
  {
    id: 'creature',
    title: 'Creature',
    description:
      'Character-focused piece exploring silhouette, surface detail, and lighting for a readable creature read.',
  },
  {
    id: 'spaceCaptain',
    title: 'Space captain',
    description:
      'Stylized portrait and costume pass—shape language, decals, and readable focal hierarchy.',
  },
  {
    id: 'witch',
    title: 'Witch',
    description:
      'Character illustration / render pass—pose, costume storytelling, and contrast against the scene.',
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
    src: preview,
    preview,
    images,
  }
}

export const artPieces = FOLDER_CONFIG.map(buildPiece).filter(Boolean)
