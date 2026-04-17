import {
  ClampToEdgeWrapping,
  Color,
  LinearFilter,
  LinearMipmapLinearFilter,
  LinearSRGBColorSpace,
  MeshStandardMaterial,
  SRGBColorSpace,
} from 'three'

/** Eager Vite URLs for hero Wayfinder PBR maps (see `src/assets/texture/`). */
const textureGlob = import.meta.glob('../assets/texture/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

function resolveTextureUrl(filename) {
  const entry = Object.entries(textureGlob).find(([key]) => key.endsWith(filename))
  return entry ? entry[1] : null
}

const PENDANT_FILES = [
  'PendantScene_PendantMat_BaseColor.webp',
  'PendantScene_PendantMat_Normal.webp',
  'PendantScene_PendantMat_Metalness.webp',
  'PendantScene_PendantMat_Roughness.webp',
  'PendantScene_PendantMat_Emissive.webp',
]

const GLASS_FILES = [
  'PendantScene_Glass_BaseColor.webp',
  'PendantScene_Glass_Normal.webp',
  'PendantScene_Glass_Metalness.webp',
  'PendantScene_Glass_Roughness.webp',
  'PendantScene_Glass_Emissive.webp',
]

/** Stable load order for `useLoader(TextureLoader, urls)`. */
export function getWayfinderHeroTextureUrls() {
  const urls = [...PENDANT_FILES, ...GLASS_FILES].map((f) => {
    const u = resolveTextureUrl(f)
    if (!u) throw new Error(`[heroWayfinderPbr] Missing texture: ${f}`)
    return u
  })
  return urls
}

/**
 * @param {'color' | 'data' | 'normal'} kind
 */
export function configureHeroTexture(tex, kind) {
  if (!tex) return
  tex.flipY = false
  tex.wrapS = ClampToEdgeWrapping
  tex.wrapT = ClampToEdgeWrapping
  tex.generateMipmaps = true
  tex.minFilter = LinearMipmapLinearFilter
  tex.magFilter = LinearFilter
  tex.anisotropy = 4
  if (kind === 'color') {
    // Three r152+: SRGBColorSpace (same role as legacy sRGBEncoding on textures).
    tex.colorSpace = SRGBColorSpace
  } else {
    tex.colorSpace = LinearSRGBColorSpace
  }
  tex.needsUpdate = true
}

/**
 * @param {import('three').Texture[]} loaded — length `WAYFINDER_HERO_TEXTURE_COUNT`, same order as `getWayfinderHeroTextureUrls`.
 * @returns {{ pendant: object, glass: object }}
 */
export function splitWayfinderTextureArray(loaded) {
  const n = PENDANT_FILES.length
  const p = loaded.slice(0, n)
  const g = loaded.slice(n, n + GLASS_FILES.length)
  const [pMap, pNor, pMet, pRou, pEmi] = p
  const [gMap, gNor, gMet, gRou, gEmi] = g
  ;[pMap, pEmi, gMap, gEmi].forEach((t) => configureHeroTexture(t, 'color'))
  ;[pNor, gNor].forEach((t) => configureHeroTexture(t, 'normal'))
  ;[pMet, pRou, gMet, gRou].forEach((t) => configureHeroTexture(t, 'data'))
  return {
    pendant: {
      map: pMap,
      normalMap: pNor,
      metalnessMap: pMet,
      roughnessMap: pRou,
      emissiveMap: pEmi,
    },
    glass: {
      map: gMap,
      normalMap: gNor,
      metalnessMap: gMet,
      roughnessMap: gRou,
      emissiveMap: gEmi,
    },
  }
}

function detachMaterialMaps(material) {
  if (!material) return
  const keys = [
    'map',
    'normalMap',
    'roughnessMap',
    'metalnessMap',
    'aoMap',
    'emissiveMap',
    'bumpMap',
    'displacementMap',
  ]
  keys.forEach((k) => {
    material[k] = null
  })
}

export function disposeMaterial(material) {
  if (!material) return
  detachMaterialMaps(material)
  material.dispose?.()
}

function pickSet(materialName, sets) {
  const n = (materialName || '').toLowerCase()
  if (n.includes('glass')) return sets.glass
  return sets.pendant
}

/**
 * Replace mesh materials with MeshStandardMaterial + shared PBR textures.
 * Hero tuning: slightly subdued emissive / metal read for dark UI backgrounds.
 */
export function applyWayfinderPbrToFbxRoot(root, sets) {
  if (!root || !sets?.pendant?.map) return

  root.traverse((obj) => {
    if (!obj.isMesh) return
    obj.frustumCulled = false

    const prev = obj.material
    const list = Array.isArray(prev) ? prev : [prev]
    const next = list.map((old) => {
      if (!old) {
        return new MeshStandardMaterial({ color: 0x888888, roughness: 0.75, metalness: 0.2 })
      }

      const hasVertexColors = Boolean(old.vertexColors)
      if (hasVertexColors) {
        disposeMaterial(old)
        return new MeshStandardMaterial({
          vertexColors: true,
          color: 0xffffff,
          metalness: 0.08,
          roughness: 0.74,
        })
      }

      const isGlass = pickSet(old.name, sets) === sets.glass
      const t = pickSet(old.name, sets)

      disposeMaterial(old)

      const emissiveIntensity = isGlass ? 0.34 : 0.26
      const metalness = t.metalnessMap ? 0.92 : 0.38
      const roughness = t.roughnessMap ? 0.88 : 0.52

      return new MeshStandardMaterial({
        name: old.name || 'WayfinderPBR',
        map: t.map,
        normalMap: t.normalMap || null,
        metalnessMap: t.metalnessMap || null,
        roughnessMap: t.roughnessMap || null,
        emissiveMap: t.emissiveMap || null,
        emissive: new Color(0xffffff),
        emissiveIntensity,
        metalness,
        roughness,
        envMapIntensity: 0.58,
        aoMap: null,
        transparent: false,
        opacity: 1,
        side: old.side,
      })
    })

    obj.material = next.length === 1 ? next[0] : next
  })
}
