/** Settings page for previewing and applying one Kisekae skin. */

import { useEffect, useId, useSyncExternalStore } from 'react'
import type { CSSProperties, ReactElement } from 'react'
import { KISEKAE_ARTWORKS, artworkUrl } from '../artworks'
import type { KisekaeSkinId } from '../settings-contract'
import type { KisekaeLocaleKey } from './locales'
import type { MainBackgroundMode, MainBackgroundStore } from './main-background-store'
import { SidebarBackdrop } from './SidebarBackdrop'
import type { SidebarBackdropMode, SidebarBackdropStore } from './sidebar-backdrop-store'
import type { SkinSelectionController, SkinSelectionSnapshot } from './skin-controller'
import type { TextStyleMode, TextStyleStore } from './text-style-store'

const SECTION_STYLE: CSSProperties = {
  containerType: 'inline-size',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  minWidth: 0,
  padding: '8px 0 24px',
}

const NARROW_LAYOUT_CSS = `
@container (max-width: 180px) {
  [data-kisekae-section-description],
  [data-kisekae-card-description],
  [data-kisekae-subsection-description] {
    display: none !important;
  }
  [data-kisekae-skin] {
    min-height: 0 !important;
    gap: 8px !important;
    padding: 10px !important;
  }
  [data-kisekae-card-heading] {
    align-items: flex-start !important;
    flex-direction: column !important;
  }
  [data-kisekae-footer],
  [data-kisekae-action-group] {
    width: 100%;
  }
  [data-kisekae-footer] button {
    flex: 1 1 auto;
  }
  [data-kisekae-mode-group],
  [data-kisekae-backdrop-mode-group],
  [data-kisekae-text-style-group] {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px !important;
  }
  [data-kisekae-mode-group] button,
  [data-kisekae-backdrop-mode-group] button,
  [data-kisekae-text-style-group] button {
    min-width: 0;
    padding: 0 4px !important;
    font-size: 12px !important;
  }
  [data-kisekae-backdrop-controls] {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  [data-kisekae-gallery] {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 6px !important;
  }
  [data-kisekae-artwork] {
    padding: 3px !important;
  }
  [data-kisekae-sidebar-preview] {
    height: 240px !important;
  }
}
`

const HEADER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const TITLE_STYLE: CSSProperties = {
  margin: 0,
  color: 'var(--dsw-alias-label-primary)',
  fontSize: 20,
  lineHeight: 1.4,
}

const DESCRIPTION_STYLE: CSSProperties = {
  margin: 0,
  color: 'var(--dsw-alias-label-secondary)',
  fontSize: 13,
  lineHeight: 1.6,
}

const CARD_GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
  gap: 12,
  minWidth: 0,
}

const CARD_BASE_STYLE: CSSProperties = {
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  width: '100%',
  minWidth: 0,
  minHeight: 154,
  padding: 18,
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 16,
  background: 'var(--dsw-alias-bg-layer-1)',
  color: 'var(--dsw-alias-label-primary)',
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
}

const CARD_SELECTED_STYLE: CSSProperties = {
  borderColor: 'var(--dsw-alias-state-business-primary)',
  background: 'var(--dsw-alias-state-business-tertiary)',
  boxShadow: '0 0 0 1px var(--dsw-alias-state-business-primary)',
}

const CARD_HEADING_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  fontSize: 15,
  fontWeight: 600,
}

const BADGE_STYLE: CSSProperties = {
  flex: 'none',
  padding: '2px 8px',
  borderRadius: 999,
  background: 'var(--dsw-alias-bg-layer-2)',
  color: 'var(--dsw-alias-label-secondary)',
  fontSize: 11,
  fontWeight: 500,
}

const SWATCH_ROW_STYLE: CSSProperties = {
  display: 'flex',
  gap: 6,
  padding: 10,
  border: '1px solid var(--dsw-alias-border-l1)',
  borderRadius: 12,
  background: 'var(--dsw-alias-bg-base)',
}

const SWATCH_STYLE: CSSProperties = {
  flex: 1,
  height: 24,
  borderRadius: 7,
  border: '1px solid rgba(127, 127, 127, 0.18)',
}

const CARD_DESCRIPTION_STYLE: CSSProperties = {
  margin: 0,
  color: 'var(--dsw-alias-label-secondary)',
  fontSize: 12,
  lineHeight: 1.55,
}

const FOOTER_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 12,
  paddingTop: 16,
  borderTop: '1px solid var(--dsw-alias-border-l2)',
}

const ACTION_GROUP_STYLE: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: 8,
}

const BUTTON_BASE_STYLE: CSSProperties = {
  height: 36,
  padding: '0 14px',
  borderRadius: 18,
  border: '1px solid var(--dsw-alias-border-l2)',
  background: 'transparent',
  color: 'var(--dsw-alias-label-primary)',
  font: 'inherit',
  fontSize: 14,
  cursor: 'pointer',
}

const PRIMARY_BUTTON_STYLE: CSSProperties = {
  ...BUTTON_BASE_STYLE,
  borderColor: 'transparent',
  background: 'var(--dsw-alias-button-primary-fill)',
  color: 'var(--dsw-alias-label-primary-foreground)',
}

const STATUS_STYLE: CSSProperties = {
  minHeight: 20,
  margin: 0,
  color: 'var(--dsw-alias-label-secondary)',
  fontSize: 12,
  lineHeight: 1.5,
}

const SUBSECTION_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  minWidth: 0,
  paddingTop: 18,
  borderTop: '1px solid var(--dsw-alias-border-l2)',
}

const SUBTITLE_STYLE: CSSProperties = {
  margin: 0,
  color: 'var(--dsw-alias-label-primary)',
  fontSize: 16,
  lineHeight: 1.4,
}

const MODE_GROUP_STYLE: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
}

const MODE_SELECTED_STYLE: CSSProperties = {
  borderColor: 'var(--dsw-alias-state-business-primary)',
  background: 'var(--dsw-alias-state-business-tertiary)',
}

const TEXT_STYLE_GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(170px, 100%), 1fr))',
  gap: 8,
  minWidth: 0,
}

const TEXT_STYLE_BUTTON_STYLE: CSSProperties = {
  ...BUTTON_BASE_STYLE,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 4,
  height: 'auto',
  minHeight: 82,
  padding: '12px 14px',
  borderRadius: 14,
  textAlign: 'left',
}

const TEXT_STYLE_DESCRIPTION_STYLE: CSSProperties = {
  color: 'var(--dsw-alias-label-secondary)',
  fontSize: 12,
  lineHeight: 1.45,
}

const GALLERY_GRID_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(112px, 100%), 1fr))',
  gap: 10,
  minWidth: 0,
}

const ARTWORK_BUTTON_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  minWidth: 0,
  padding: 6,
  border: '1px solid var(--dsw-alias-border-l1)',
  borderRadius: 12,
  background: 'var(--dsw-alias-bg-layer-1)',
  color: 'var(--dsw-alias-label-primary)',
  font: 'inherit',
  cursor: 'pointer',
}

const ARTWORK_IMAGE_STYLE: CSSProperties = {
  display: 'block',
  width: '100%',
  aspectRatio: '4 / 5',
  objectFit: 'contain',
  borderRadius: 8,
  background: 'var(--dsw-alias-bg-layer-2)',
}

const ARTWORK_META_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 4,
  minHeight: 20,
  fontSize: 11,
}

const BACKDROP_CONTROL_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(150px, 0.8fr)',
  gap: 12,
  minWidth: 0,
}

const SELECT_LABEL_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  minWidth: 0,
  color: 'var(--dsw-alias-label-secondary)',
  fontSize: 12,
}

const SELECT_STYLE: CSSProperties = {
  width: '100%',
  height: 36,
  padding: '0 10px',
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 10,
  background: 'var(--dsw-alias-bg-layer-1)',
  color: 'var(--dsw-alias-label-primary)',
  font: 'inherit',
  fontSize: 13,
}

const SIDEBAR_PREVIEW_STYLE: CSSProperties = {
  position: 'relative',
  height: 300,
  overflow: 'hidden',
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 16,
  background: 'var(--dsw-specific-sidebar-fill)',
}

const PREVIEW_CONTENT_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: 14,
}

const PREVIEW_WORDMARK_STYLE: CSSProperties = {
  width: '58%',
  height: 14,
  marginBottom: 8,
  borderRadius: 999,
  background: 'var(--dsw-alias-label-primary)',
  opacity: 0.74,
}

const PREVIEW_ROW_STYLE: CSSProperties = {
  height: 34,
  border: '1px solid rgba(255, 255, 255, 0.28)',
  borderRadius: 10,
  background: 'var(--dsw-specific-sidebar-nav-item-hover)',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.28)',
}

interface SkinCardDefinition {
  readonly id: KisekaeSkinId
  readonly nameKey: KisekaeLocaleKey
  readonly descriptionKey: KisekaeLocaleKey
  readonly colors: readonly [string, string, string]
}

const CARDS: readonly SkinCardDefinition[] = [
  {
    id: 'official',
    nameKey: 'official',
    descriptionKey: 'officialDescription',
    colors: ['#FFFFFF', '#F1F3F5', '#151517'],
  },
  {
    id: 'deepseek-blue-whale-chan',
    nameKey: 'blueWhale',
    descriptionKey: 'blueWhaleDescription',
    colors: ['#F6FBFE', '#69D2F0', '#091824'],
  },
]

const MAIN_BACKGROUND_MODES: readonly {
  readonly id: MainBackgroundMode
  readonly label: KisekaeLocaleKey
}[] = [
  { id: 'random', label: 'mainBackgroundRandom' },
  { id: 'fixed', label: 'mainBackgroundFixed' },
  { id: 'off', label: 'mainBackgroundOff' },
]

const BACKDROP_MODES: readonly { readonly id: SidebarBackdropMode; readonly label: KisekaeLocaleKey }[] = [
  { id: 'clear', label: 'backdropClear' },
  { id: 'immersive', label: 'backdropImmersive' },
  { id: 'off', label: 'backdropOff' },
]

const TEXT_STYLE_MODES: readonly {
  readonly id: TextStyleMode
  readonly label: KisekaeLocaleKey
  readonly description: KisekaeLocaleKey
}[] = [
  { id: 'theme-default', label: 'textStyleBlueWhaleIce', description: 'textStyleBlueWhaleIceDescription' },
  { id: 'official-clear', label: 'textStyleOfficialClear', description: 'textStyleOfficialClearDescription' },
  { id: 'effects-off', label: 'textStyleEffectsOff', description: 'textStyleEffectsOffDescription' },
]

/** Props composed by the settings section slot. */
export interface SkinSelectorSectionProps {
  readonly controller: SkinSelectionController
  readonly mainBackgroundStore: MainBackgroundStore
  readonly backdropStore: SidebarBackdropStore
  readonly textStyleStore: TextStyleStore
  readonly t: (key: KisekaeLocaleKey) => string
}

function statusKey(snapshot: SkinSelectionSnapshot): KisekaeLocaleKey {
  if (snapshot.error !== null) return 'saveFailed'
  if (snapshot.saving) return 'saving'
  if (snapshot.status === 'loading') return 'loading'
  if (snapshot.mode === 'memory' || !snapshot.writable) return 'storageUnavailable'
  if (snapshot.unavailableSkin !== null) return 'unavailableSkin'
  if (snapshot.dirty) return 'previewing'
  return 'saved'
}

/**
 * Render the responsive two-card skin picker.
 * @param props - Slot-injected controller and localized copy.
 * @returns the settings section element tree.
 */
export function SkinSelectorSection({
  controller,
  mainBackgroundStore,
  backdropStore,
  textStyleStore,
  t,
}: SkinSelectorSectionProps): ReactElement {
  const snapshot = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot)
  const mainBackground = useSyncExternalStore(
    mainBackgroundStore.subscribe,
    mainBackgroundStore.getSnapshot,
    mainBackgroundStore.getSnapshot,
  )
  const backdrop = useSyncExternalStore(backdropStore.subscribe, backdropStore.getSnapshot, backdropStore.getSnapshot)
  const textStyle = useSyncExternalStore(
    textStyleStore.subscribe,
    textStyleStore.getSnapshot,
    textStyleStore.getSnapshot,
  )
  const headingId = useId()
  const textStyleHeadingId = useId()
  const backdropHeadingId = useId()
  const mainBackgroundHeadingId = useId()
  const galleryHeadingId = useId()

  useEffect(() => () => { controller.cancelPreview() }, [controller])

  const busy = snapshot.saving
  const applyDisabled = !snapshot.dirty || busy || !snapshot.writable || snapshot.status !== 'ready'
  const hasPreview = snapshot.draft !== snapshot.committed
  const status = statusKey(snapshot)

  return (
    <section data-kisekae-skin-section="true" style={SECTION_STYLE} aria-labelledby={headingId}>
      <style>{NARROW_LAYOUT_CSS}</style>
      <header style={HEADER_STYLE}>
        <h2 id={headingId} style={TITLE_STYLE}>{t('title')}</h2>
        <p data-kisekae-section-description="true" style={DESCRIPTION_STYLE}>{t('description')}</p>
      </header>

      <div role="group" aria-labelledby={headingId} style={CARD_GRID_STYLE}>
        {CARDS.map(card => {
          const selected = snapshot.draft === card.id
          const applied = snapshot.committed === card.id
          const fallback = card.id === 'official' && snapshot.unavailableSkin !== null
          return (
            <button
              key={card.id}
              type="button"
              aria-pressed={selected}
              disabled={busy}
              data-kisekae-skin={card.id}
              style={{ ...CARD_BASE_STYLE, ...(selected ? CARD_SELECTED_STYLE : {}) }}
              onClick={() => { controller.preview(card.id) }}
            >
              <span data-kisekae-card-heading="true" style={CARD_HEADING_STYLE}>
                <span>{t(card.nameKey)}</span>
                {(selected || applied) && (
                  <span style={BADGE_STYLE}>
                    {fallback ? t('fallback') : selected && hasPreview ? t('selected') : t('applied')}
                  </span>
                )}
              </span>
              <span aria-hidden="true" style={SWATCH_ROW_STYLE}>
                {card.colors.map(color => <span key={color} style={{ ...SWATCH_STYLE, background: color }} />)}
              </span>
              <span data-kisekae-card-description="true" style={CARD_DESCRIPTION_STYLE}>
                {t(card.descriptionKey)}
              </span>
            </button>
          )
        })}
      </div>

      <footer data-kisekae-footer="true" style={FOOTER_STYLE}>
        <button
          type="button"
          disabled={busy || snapshot.draft === 'official'}
          style={{ ...BUTTON_BASE_STYLE, opacity: busy || snapshot.draft === 'official' ? 0.45 : 1 }}
          onClick={() => { controller.preview('official') }}
        >
          {t('restoreOfficial')}
        </button>
        <div data-kisekae-action-group="true" style={ACTION_GROUP_STYLE}>
          <button
            type="button"
            disabled={!hasPreview || busy}
            style={{ ...BUTTON_BASE_STYLE, opacity: !hasPreview || busy ? 0.45 : 1 }}
            onClick={() => { controller.cancelPreview() }}
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            disabled={applyDisabled}
            style={{ ...PRIMARY_BUTTON_STYLE, opacity: applyDisabled ? 0.45 : 1 }}
            onClick={() => { void controller.applyPreview() }}
          >
            {t('apply')}
          </button>
        </div>
      </footer>

      <p
        aria-live={snapshot.error === null ? 'polite' : 'assertive'}
        role={snapshot.error === null ? 'status' : 'alert'}
        style={{ ...STATUS_STYLE, color: snapshot.error === null
          ? STATUS_STYLE.color
          : 'var(--dsw-alias-state-error-primary)' }}
      >
        {t(status)}
      </p>

      <section aria-labelledby={textStyleHeadingId} style={SUBSECTION_STYLE}>
        <div style={HEADER_STYLE}>
          <h3 id={textStyleHeadingId} style={SUBTITLE_STYLE}>{t('textStyleTitle')}</h3>
          <p data-kisekae-subsection-description="true" style={DESCRIPTION_STYLE}>
            {t('textStyleDescription')}
          </p>
        </div>
        <div
          role="group"
          aria-labelledby={textStyleHeadingId}
          data-kisekae-text-style-group="true"
          style={TEXT_STYLE_GRID_STYLE}
        >
          {TEXT_STYLE_MODES.map(mode => {
            const selected = textStyle.mode === mode.id
            return (
              <button
                key={mode.id}
                type="button"
                aria-pressed={selected}
                data-kisekae-text-style={mode.id}
                style={{ ...TEXT_STYLE_BUTTON_STYLE, ...(selected ? MODE_SELECTED_STYLE : {}) }}
                onClick={() => { textStyleStore.setMode(mode.id) }}
              >
                <strong>{t(mode.label)}</strong>
                <span style={TEXT_STYLE_DESCRIPTION_STYLE}>{t(mode.description)}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section
        aria-labelledby={backdropHeadingId}
        data-kisekae-sidebar-settings="true"
        style={SUBSECTION_STYLE}
      >
        <div style={HEADER_STYLE}>
          <h3 id={backdropHeadingId} style={SUBTITLE_STYLE}>{t('backdropTitle')}</h3>
          <p data-kisekae-subsection-description="true" style={DESCRIPTION_STYLE}>
            {t('backdropDescription')}
          </p>
        </div>
        <div data-kisekae-backdrop-controls="true" style={BACKDROP_CONTROL_STYLE}>
          <div>
            <div
              role="group"
              aria-labelledby={backdropHeadingId}
              data-kisekae-backdrop-mode-group="true"
              style={MODE_GROUP_STYLE}
            >
              {BACKDROP_MODES.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  aria-pressed={backdrop.mode === mode.id}
                  data-kisekae-backdrop-mode={mode.id}
                  style={{ ...BUTTON_BASE_STYLE, ...(backdrop.mode === mode.id ? MODE_SELECTED_STYLE : {}) }}
                  onClick={() => { backdropStore.setMode(mode.id) }}
                >
                  {t(mode.label)}
                </button>
              ))}
            </div>
            <label style={{ ...SELECT_LABEL_STYLE, marginTop: 12 }}>
              <span>{t('backdropArtwork')}</span>
              <select
                aria-label={t('backdropArtwork')}
                data-kisekae-backdrop-artwork-select="true"
                style={SELECT_STYLE}
                value={backdrop.artworkId}
                onChange={(event) => { backdropStore.setArtwork(event.currentTarget.value) }}
              >
                {KISEKAE_ARTWORKS.map((artwork, index) => (
                  <option key={artwork.id} value={artwork.id}>
                    {t('backdropArtworkOption')} {String(index + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div
            role="img"
            aria-label={t('backdropPreview')}
            data-kisekae-sidebar-preview="true"
            style={SIDEBAR_PREVIEW_STYLE}
          >
            <SidebarBackdrop wide backdropStore={backdropStore} />
            <div aria-hidden="true" style={PREVIEW_CONTENT_STYLE}>
              <span style={PREVIEW_WORDMARK_STYLE} />
              <span style={{ ...PREVIEW_ROW_STYLE, background: 'var(--dsw-specific-sidebar-nav-item-active)' }} />
              <span style={PREVIEW_ROW_STYLE} />
              <span style={{ ...PREVIEW_ROW_STYLE, opacity: 0.82 }} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby={mainBackgroundHeadingId} style={SUBSECTION_STYLE}>
        <div style={HEADER_STYLE}>
          <h3 id={mainBackgroundHeadingId} style={SUBTITLE_STYLE}>{t('mainBackgroundTitle')}</h3>
          <p data-kisekae-subsection-description="true" style={DESCRIPTION_STYLE}>
            {t('mainBackgroundDescription')}
          </p>
        </div>
        <div
          role="group"
          aria-labelledby={mainBackgroundHeadingId}
          data-kisekae-mode-group="true"
          style={MODE_GROUP_STYLE}
        >
          {MAIN_BACKGROUND_MODES.map(mode => {
            const selected = mainBackground.mode === mode.id
            return (
              <button
                key={mode.id}
                type="button"
                aria-pressed={selected}
                data-kisekae-main-background-mode={mode.id}
                style={{ ...BUTTON_BASE_STYLE, ...(selected ? MODE_SELECTED_STYLE : {}) }}
                onClick={() => { mainBackgroundStore.setMode(mode.id) }}
              >
                {t(mode.label)}
              </button>
            )
          })}
        </div>
      </section>

      <section aria-labelledby={galleryHeadingId} style={SUBSECTION_STYLE}>
        <div style={HEADER_STYLE}>
          <h3 id={galleryHeadingId} style={SUBTITLE_STYLE}>{t('galleryTitle')}</h3>
          <p data-kisekae-subsection-description="true" style={DESCRIPTION_STYLE}>
            {t('galleryDescription')}
          </p>
        </div>
        <div data-kisekae-gallery="true" style={GALLERY_GRID_STYLE}>
          {KISEKAE_ARTWORKS.map((artwork, index) => {
            const fixed = mainBackground.mode === 'fixed' && mainBackground.fixedArtworkId === artwork.id
            const shown = mainBackground.mode === 'random' && mainBackground.shownArtworkId === artwork.id
            return (
              <button
                key={artwork.id}
                type="button"
                aria-label={`${t('chooseArtwork')} ${index + 1}`}
                aria-pressed={fixed}
                data-kisekae-artwork={artwork.id}
                style={{ ...ARTWORK_BUTTON_STYLE, ...(fixed ? CARD_SELECTED_STYLE : {}) }}
                onClick={() => { mainBackgroundStore.fix(artwork.id) }}
              >
                <img
                  alt=""
                  decoding="async"
                  loading="lazy"
                  src={artworkUrl(artwork.id)}
                  style={ARTWORK_IMAGE_STYLE}
                />
                <span style={ARTWORK_META_STYLE}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {(fixed || shown) && <span>{t(fixed ? 'artworkFixed' : 'artworkShown')}</span>}
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </section>
  )
}
