/** Static catalog of the released DeepSeek Blue Whale-chan artwork. */

/** Public Host route that serves browser-ready artwork. */
export const KISEKAE_ARTWORK_ROUTE = '/plugins/@yehu77/dsh-kisekae/assets'

const KISEKAE_ARTWORK_RELEASE = 'source-q80-v1'

/** Stable ids shared by the gallery, mascot controls, and asset route. */
export const KISEKAE_ARTWORK_IDS = [
  '1eaed38d-0bc6-46bb-a87f-a8e604392773',
  '2680c583-7b93-43ec-96a1-fd8fd641654b',
  '3888b0d1-58b7-49e8-a946-d2a3f61b5cc6',
  '461461e2-38aa-4dbe-8d89-8f149b95f2e7',
  '4b004ccc-af16-4274-9eaa-a71be4406d4c',
  '4d2dd06e-9021-4148-94be-efa785e35766',
  '5ab86cea-502d-4a79-944d-7f46ad956434',
  '5e2e3098-8b06-47bf-8824-a966bd0a4996',
  '64231688-9342-48a4-b315-c34c02974f34',
  '64dd6665-54d2-4abe-80b7-571a78681757',
  '65d6f30e-25a3-4b6a-8541-990b2358b77a',
  '69293bea-259f-4574-8cb5-91d96ec501a1',
  '6bf26eae-3001-4319-bf5e-64f2c328e37c',
  '6ff80a30-aff5-4f51-8b2e-2b759660a1ac',
  '7a9c4fae-6fca-4c5e-b232-5c802f788dae',
  '7e337d17-e545-4a56-9b2b-02885e709091',
  '7fd9fafc-aa19-449d-a92d-338a9bce7db5',
  '86238e8a-a014-4412-b843-69b883e56f87',
  '88bdc475-514c-4f95-b3c2-ed43125479ba',
  '8a17c5a8-9a68-458d-bb8f-b3c01a374f34',
  '95c4c4d5-147c-4cea-b16c-0bd8853ea12f',
  '964c9fa8-355d-42ec-aaa0-b6d8df3ab3ba',
  '9aaf82f4-fee2-4a78-9e01-3e1264954bc8',
  'a4685a6c-e541-4fc2-9065-2f54d2bfed41',
  'aa85660e-061d-44a6-adb3-7cc11dd647c8',
  'b2d00c37-3e0d-46f5-be63-ef1fb81acb34',
  'b4cc0ff8-e2c9-4c0d-b356-3c37d6030644',
  'bda120b9-0559-4ee8-adbf-e8383cf1a075',
  'bda63704-128f-4690-8077-96e9feb048ec',
  'cf64290e-1119-470c-8902-304dd5bae3e9',
  'd4081f6d-3c9d-4cd0-92b6-c8f514cf5349',
  'd5392416-87c5-409f-a5cb-c0ed04b5632b',
  'd5dd1b2f-ecdc-4be7-abef-ce9a0cfc6f97',
  'd8fbbe6d-1bb3-4880-8347-7651deb112e4',
  'e5e055df-453a-4477-8507-223b9ca414d4',
  'e7cea75f-3c97-4ceb-8c4c-358dde19a15d',
  'eafcd307-31a9-4016-9f03-97c00cb8883f',
  'ee927dc7-5f3f-4a9f-b94d-3f2675aa84a7',
  'f2ddfb50-ad1a-4d38-9e95-a251576549b1',
  'f87ba84b-905b-49f6-ad26-b2c81af6e625',
  'fbe36653-0926-4d0a-a42b-69e74570daeb',
  'ffa97a37-a511-4b3e-bb9e-f1c2b61b9551',
] as const

/** One id from the released artwork catalog. */
export type ArtworkId = typeof KISEKAE_ARTWORK_IDS[number]

/** One browser-ready artwork entry. */
export interface KisekaeArtwork {
  /** Stable artwork id. */
  readonly id: string
  /** Released JPEG filename. */
  readonly file: string
  /** Whether the artwork is suitable for the corner mascot. */
  readonly mascot: boolean
}

const NON_MASCOT_IDS = new Set<ArtworkId>([
  '7a9c4fae-6fca-4c5e-b232-5c802f788dae',
  'bda63704-128f-4690-8077-96e9feb048ec',
])

/** All artwork shown by the gallery, sorted by id. */
export const KISEKAE_ARTWORKS: readonly KisekaeArtwork[] = KISEKAE_ARTWORK_IDS.map(id => ({
  id,
  file: `${id}.jpg`,
  mascot: !NON_MASCOT_IDS.has(id),
}))

/** Artwork available to random corner-mascot mode. */
export const KISEKAE_MASCOT_ARTWORKS = KISEKAE_ARTWORKS.filter(artwork => artwork.mascot)

/** Initial artwork used by fixed mascot mode. */
export const DEFAULT_MASCOT_ARTWORK_ID: ArtworkId = 'd5dd1b2f-ecdc-4be7-abef-ce9a0cfc6f97'

/**
 * Build the public URL for released artwork.
 * @param id - Artwork catalog id.
 * @returns URL served by the Kisekae Host plugin.
 */
export function artworkUrl(id: string): string {
  return `${KISEKAE_ARTWORK_ROUTE}/${id}.jpg?v=${KISEKAE_ARTWORK_RELEASE}`
}
