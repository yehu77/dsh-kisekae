window.__ModuleLoader__.load({
	id: "@yehu77/dsh-kisekae",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		//#region src/settings-contract.ts
		/** Shared browser-preference identity for Kisekae skin selection. */
		/** Versioned local browser key owned by this plugin. */
		const KISEKAE_SKIN_STORAGE_KEY = "@yehu77/dsh-kisekae:skin:v1";
		/** Scalar browser record field that stores the applied skin. */
		const KISEKAE_SKIN_FIELD = "skin";
		/** Stable skin ids accepted by the current plugin version. */
		const KISEKAE_SKIN_IDS = ["official", "deepseek-blue-whale-chan"];
		/** Skin presented for a new browser origin before the user makes a choice. */
		const DEFAULT_KISEKAE_SKIN = "deepseek-blue-whale-chan";
		/**
		* Narrow an unknown settings value to a skin shipped by this version.
		* @param value - Value read from browser storage.
		* @returns Whether the value is a known skin id.
		*/
		function isKisekaeSkinId(value) {
			return KISEKAE_SKIN_IDS.some((id) => id === value);
		}
		//#endregion
		//#region src/client/browser-skin-store.ts
		/** Browser-local, cross-tab preference store for the selected Kisekae skin. */
		/** Immediate localStorage mirror with explicit unavailable fallback. */
		var BrowserSkinStore = class {
			browser;
			listeners = /* @__PURE__ */ new Set();
			storage;
			snapshot;
			mounted = false;
			/**
			* @param browser - Current browser window and its origin-local storage.
			*/
			constructor(browser) {
				this.browser = browser;
				try {
					this.storage = browser.localStorage;
					this.snapshot = this.readySnapshot(this.storage.getItem(KISEKAE_SKIN_STORAGE_KEY));
				} catch (_browserStorageUnavailable) {
					this.snapshot = this.unavailableSnapshot();
				}
			}
			/** @returns the stable browser preference snapshot. */
			getSnapshot = () => this.snapshot;
			/**
			* Observe preference replacements.
			* @param listener - Controller subscriber.
			* @returns disposer removing the subscriber.
			*/
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			};
			/**
			* Listen for preference changes from another tab.
			* @returns cleanup removing the browser listener.
			*/
			mount() {
				if (this.mounted) throw new Error("Kisekae browser skin store is already mounted");
				this.mounted = true;
				this.browser.addEventListener("storage", this.onStorage);
				return () => {
					if (!this.mounted) return;
					this.mounted = false;
					this.browser.removeEventListener("storage", this.onStorage);
				};
			}
			/** Persist the selected skin for this browser origin. */
			async set(field, value) {
				if (field !== "skin" || typeof value !== "string" || this.storage === void 0) return;
				try {
					this.storage.setItem(KISEKAE_SKIN_STORAGE_KEY, value);
				} catch (error) {
					throw error;
				}
				this.replace(this.readySnapshot(value));
			}
			onStorage = (event) => {
				if (event.storageArea != null && event.storageArea !== this.storage) return;
				if (event.key !== null && event.key !== "@yehu77/dsh-kisekae:skin:v1") return;
				this.replace(this.readySnapshot(event.newValue));
			};
			readySnapshot(value) {
				return {
					status: "ready",
					value: value === null ? void 0 : { skin: value },
					writable: true,
					mode: "browser"
				};
			}
			unavailableSnapshot() {
				return {
					status: "unavailable",
					value: void 0,
					writable: false,
					mode: "memory"
				};
			}
			replace(snapshot) {
				this.snapshot = snapshot;
				for (const listener of [...this.listeners]) listener();
			}
		};
		//#endregion
		//#region src/client/BlueWhaleComposerDecoration.tsx
		const ROOT_STYLE$4 = {
			position: "relative",
			display: "block",
			width: "100%",
			height: "100%",
			color: "var(--dsw-alias-brand-primary)"
		};
		const HERO_STYLE = {
			background: "radial-gradient(80% 120% at 10% -16%, color-mix(in srgb, var(--dsw-alias-bg-overlay) 44%, transparent) 0%, transparent 50%), linear-gradient(135deg, color-mix(in srgb, var(--dsw-alias-state-business-tertiary) 32%, transparent) 0%, transparent 58%, color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent) 100%)",
			boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 38%, var(--dsw-alias-border-l2)), inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-bg-overlay) 76%, transparent), inset 0 -1px 0 color-mix(in srgb, var(--dsw-alias-brand-primary) 18%, transparent)"
		};
		const COMPOSER_STYLE = {
			background: "radial-gradient(72% 110% at 10% -18%, color-mix(in srgb, var(--dsw-alias-bg-overlay) 20%, transparent) 0%, transparent 48%), linear-gradient(135deg, color-mix(in srgb, var(--dsw-alias-state-business-tertiary) 14%, transparent) 0%, transparent 62%, color-mix(in srgb, var(--dsw-alias-brand-primary) 7%, transparent) 100%)",
			boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 24%, var(--dsw-alias-border-l2)), inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-bg-overlay) 58%, transparent), inset 0 -1px 0 color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent)"
		};
		const TIDE_STYLE = {
			position: "absolute",
			right: 0,
			bottom: 0,
			left: 0,
			width: "100%",
			height: 18
		};
		const CORNER_STYLE = {
			position: "absolute",
			top: 3,
			right: 5,
			width: 34,
			height: 20
		};
		/**
		* Draw semantic sea glass, border light, tide lines, and a quiet whale-tail corner.
		* @param props - Official composer placement variant.
		* @returns non-interactive composer-card artwork.
		*/
		function BlueWhaleComposerDecoration({ variant }) {
			const hero = variant === "hero";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				"data-kisekae-composer-decoration": variant,
				style: {
					...ROOT_STYLE$4,
					...hero ? HERO_STYLE : COMPOSER_STYLE
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					"data-kisekae-composer-tide": "true",
					fill: "none",
					preserveAspectRatio: "none",
					style: {
						...TIDE_STYLE,
						opacity: hero ? .28 : .12
					},
					viewBox: "0 0 100 18",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M-5 9C3 3 11 3 19 9S35 15 43 9 59 3 67 9 83 15 91 9 107 3 115 9",
						stroke: "currentColor",
						strokeLinecap: "round",
						strokeWidth: "1.2",
						vectorEffect: "non-scaling-stroke"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M-8 14C0 10 8 10 16 14S32 18 40 14 56 10 64 14 80 18 88 14 104 10 112 14",
						opacity: "0.48",
						stroke: "currentColor",
						strokeLinecap: "round",
						strokeWidth: "1",
						vectorEffect: "non-scaling-stroke"
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					"data-kisekae-composer-corner": "whale-tail",
					fill: "none",
					style: {
						...CORNER_STYLE,
						opacity: hero ? .22 : .08
					},
					viewBox: "0 0 36 20",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M3 12c4-.4 7-2 9-5 2 2 4 3 6 3s4-1 6-3c2 3 5 4.6 9 5-3.5 3.6-8.5 5.4-15 5.4S6.5 15.6 3 12Z",
							fill: "currentColor",
							opacity: "0.46"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "29",
							cy: "5",
							fill: "currentColor",
							r: "1.2"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "33",
							cy: "2.5",
							fill: "currentColor",
							opacity: "0.6",
							r: "0.8"
						})
					]
				})]
			});
		}
		//#endregion
		//#region src/artworks.ts
		/** Static catalog of the released DeepSeek Blue Whale-chan artwork. */
		/** Public Host route that serves browser-ready artwork. */
		const KISEKAE_ARTWORK_ROUTE = "/plugins/@yehu77/dsh-kisekae/assets";
		const KISEKAE_ARTWORK_RELEASE = "source-q80-v1";
		/** Stable ids shared by the gallery, main-background controls, and asset route. */
		const KISEKAE_ARTWORK_IDS = [
			"1eaed38d-0bc6-46bb-a87f-a8e604392773",
			"3888b0d1-58b7-49e8-a946-d2a3f61b5cc6",
			"461461e2-38aa-4dbe-8d89-8f149b95f2e7",
			"4b004ccc-af16-4274-9eaa-a71be4406d4c",
			"4d2dd06e-9021-4148-94be-efa785e35766",
			"5ab86cea-502d-4a79-944d-7f46ad956434",
			"5e2e3098-8b06-47bf-8824-a966bd0a4996",
			"64231688-9342-48a4-b315-c34c02974f34",
			"64dd6665-54d2-4abe-80b7-571a78681757",
			"65d6f30e-25a3-4b6a-8541-990b2358b77a",
			"69293bea-259f-4574-8cb5-91d96ec501a1",
			"6bf26eae-3001-4319-bf5e-64f2c328e37c",
			"6ff80a30-aff5-4f51-8b2e-2b759660a1ac",
			"7a9c4fae-6fca-4c5e-b232-5c802f788dae",
			"7e337d17-e545-4a56-9b2b-02885e709091",
			"7fd9fafc-aa19-449d-a92d-338a9bce7db5",
			"86238e8a-a014-4412-b843-69b883e56f87",
			"88bdc475-514c-4f95-b3c2-ed43125479ba",
			"8a17c5a8-9a68-458d-bb8f-b3c01a374f34",
			"95c4c4d5-147c-4cea-b16c-0bd8853ea12f",
			"964c9fa8-355d-42ec-aaa0-b6d8df3ab3ba",
			"9aaf82f4-fee2-4a78-9e01-3e1264954bc8",
			"a4685a6c-e541-4fc2-9065-2f54d2bfed41",
			"aa85660e-061d-44a6-adb3-7cc11dd647c8",
			"b2d00c37-3e0d-46f5-be63-ef1fb81acb34",
			"b4cc0ff8-e2c9-4c0d-b356-3c37d6030644",
			"bda120b9-0559-4ee8-adbf-e8383cf1a075",
			"bda63704-128f-4690-8077-96e9feb048ec",
			"cf64290e-1119-470c-8902-304dd5bae3e9",
			"d4081f6d-3c9d-4cd0-92b6-c8f514cf5349",
			"d5392416-87c5-409f-a5cb-c0ed04b5632b",
			"d5dd1b2f-ecdc-4be7-abef-ce9a0cfc6f97",
			"d8fbbe6d-1bb3-4880-8347-7651deb112e4",
			"e5e055df-453a-4477-8507-223b9ca414d4",
			"e7cea75f-3c97-4ceb-8c4c-358dde19a15d",
			"eafcd307-31a9-4016-9f03-97c00cb8883f",
			"ee927dc7-5f3f-4a9f-b94d-3f2675aa84a7",
			"f2ddfb50-ad1a-4d38-9e95-a251576549b1",
			"f87ba84b-905b-49f6-ad26-b2c81af6e625",
			"fbe36653-0926-4d0a-a42b-69e74570daeb",
			"ffa97a37-a511-4b3e-bb9e-f1c2b61b9551"
		];
		/** All artwork shown by the gallery, sorted by id. */
		const KISEKAE_ARTWORKS = KISEKAE_ARTWORK_IDS.map((id) => ({
			id,
			file: `${id}.jpg`
		}));
		/** Initial artwork used by fixed main-background mode. */
		const DEFAULT_MAIN_BACKGROUND_ARTWORK_ID = "d5dd1b2f-ecdc-4be7-abef-ce9a0cfc6f97";
		/**
		* Build the public URL for released artwork.
		* @param id - Artwork catalog id.
		* @returns URL served by the Kisekae Host plugin.
		*/
		function artworkUrl(id) {
			return `${KISEKAE_ARTWORK_ROUTE}/${id}.jpg?v=${KISEKAE_ARTWORK_RELEASE}`;
		}
		//#endregion
		//#region src/client/BlueWhaleConversationBackdrop.tsx
		/** Phase-aware Blue Whale artwork behind the official conversation surface. */
		const ROOT_STYLE$3 = {
			position: "absolute",
			inset: 0,
			backgroundColor: "var(--dsw-alias-bg-base)",
			overflow: "hidden",
			pointerEvents: "none",
			userSelect: "none"
		};
		const AMBIENT_STYLE = {
			position: "absolute",
			inset: 0,
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
			backgroundSize: "cover",
			opacity: .46
		};
		const ARTWORK_STYLE = {
			position: "absolute",
			inset: 0,
			display: "block",
			width: "100%",
			height: "100%",
			objectFit: "contain",
			objectPosition: "center"
		};
		/**
		* Render the complete artwork over a quiet full-canvas copy of the same scene.
		* @param props - Official conversation phase plus Kisekae background preferences.
		* @returns decorative conversation layer, or nothing in off mode.
		*/
		function BlueWhaleConversationBackdrop({ phase, mainBackgroundStore }) {
			const snapshot = (0, react.useSyncExternalStore)(mainBackgroundStore.subscribe, mainBackgroundStore.getSnapshot, mainBackgroundStore.getSnapshot);
			if (snapshot.shownArtworkId === null) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"aria-hidden": "true",
				"data-kisekae-conversation-backdrop": phase,
				"data-kisekae-main-background": snapshot.shownArtworkId,
				style: ROOT_STYLE$3,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					"data-kisekae-conversation-ambient": snapshot.shownArtworkId,
					style: {
						...AMBIENT_STYLE,
						backgroundImage: `url(${artworkUrl(snapshot.shownArtworkId)})`
					}
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
					alt: "",
					"data-kisekae-conversation-artwork": snapshot.shownArtworkId,
					draggable: false,
					src: artworkUrl(snapshot.shownArtworkId),
					style: ARTWORK_STYLE
				})]
			});
		}
		//#endregion
		//#region src/client/BlueWhaleNewSessionDecoration.tsx
		const NEW_SESSION_ARTWORK_ID = "7a9c4fae-6fca-4c5e-b232-5c802f788dae";
		const ROOT_STYLE$2 = {
			position: "absolute",
			inset: 0,
			overflow: "hidden",
			boxSizing: "border-box",
			border: "1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 22%, var(--dsw-alias-border-l2))",
			borderRadius: "inherit",
			color: "var(--dsw-alias-brand-primary)",
			pointerEvents: "none"
		};
		const WIDE_ROOT_STYLE$1 = {
			...ROOT_STYLE$2,
			background: "linear-gradient(105deg, color-mix(in srgb, var(--dsw-alias-button-elevated-fill) 96%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-button-elevated-fill) 88%, transparent) 58%, color-mix(in srgb, var(--dsw-alias-brand-primary) 20%, var(--dsw-alias-button-elevated-fill)) 100%)",
			boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-bg-overlay) 58%, transparent)",
			backdropFilter: "blur(2px) saturate(1.08)",
			WebkitBackdropFilter: "blur(2px) saturate(1.08)"
		};
		const IMAGE_STYLE$2 = {
			position: "absolute",
			inset: "0 0 0 auto",
			width: "52%",
			backgroundPosition: "center 44%",
			backgroundRepeat: "no-repeat",
			backgroundSize: "cover",
			maskImage: "linear-gradient(to right, transparent 0%, black 48%)",
			WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 48%)",
			opacity: .26
		};
		const READABILITY_SCRIM_STYLE$1 = {
			position: "absolute",
			inset: 0,
			background: "linear-gradient(90deg, color-mix(in srgb, var(--dsw-alias-button-elevated-fill) 84%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-button-elevated-fill) 62%, transparent) 56%, transparent 100%)"
		};
		const RAIL_ROOT_STYLE$1 = {
			...ROOT_STYLE$2,
			background: "linear-gradient(145deg, color-mix(in srgb, var(--dsw-alias-bg-overlay) 72%, transparent), color-mix(in srgb, var(--dsw-alias-brand-primary) 24%, var(--dsw-alias-button-elevated-fill)))",
			boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-bg-overlay) 66%, transparent)"
		};
		/**
		* Render quiet artwork behind the wide button and compact glass in the rail.
		* @param props - Official sidebar display state.
		* @returns non-interactive button decoration.
		*/
		function BlueWhaleNewSessionDecoration({ wide }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				"data-kisekae-new-session-decoration": wide ? "wide" : "rail",
				style: wide ? WIDE_ROOT_STYLE$1 : RAIL_ROOT_STYLE$1,
				children: wide ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					"data-kisekae-new-session-artwork": NEW_SESSION_ARTWORK_ID,
					style: {
						...IMAGE_STYLE$2,
						backgroundImage: `url(${artworkUrl(NEW_SESSION_ARTWORK_ID)})`
					}
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { style: READABILITY_SCRIM_STYLE$1 })] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					"aria-hidden": "true",
					"data-kisekae-new-session-rail-wave": "true",
					fill: "none",
					height: "100%",
					viewBox: "0 0 36 36",
					width: "100%",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M3 26c5-5 10-5 15 0s10 5 15 0",
						opacity: "0.28",
						stroke: "currentColor",
						strokeLinecap: "round",
						strokeWidth: "1.5"
					})
				})
			});
		}
		//#endregion
		//#region src/client/BlueWhaleNewSessionIcon.tsx
		/**
		* Render a chat bubble and plus sign with a small ocean-wave accent.
		* @param props - Official sidebar display state.
		* @returns decorative New Session icon.
		*/
		function BlueWhaleNewSessionIcon({ wide }) {
			const size = wide ? 16 : 18;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				"aria-hidden": "true",
				"data-kisekae-new-session-icon": "blue-whale-wave-chat",
				fill: "none",
				focusable: "false",
				height: size,
				style: { color: "var(--dsw-alias-brand-primary)" },
				viewBox: "0 0 20 20",
				width: size,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M3.25 7.25A3.5 3.5 0 0 1 6.75 3.75h6.5a3.5 3.5 0 0 1 3.5 3.5v3.5a3.5 3.5 0 0 1-3.5 3.5H8.1l-3.85 2v-3.18a3.48 3.48 0 0 1-1-2.32v-3.5Z",
						stroke: "currentColor",
						strokeLinejoin: "round",
						strokeWidth: "1.5"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M7.25 5.75v4M5.25 7.75h4",
						stroke: "currentColor",
						strokeLinecap: "round",
						strokeWidth: "1.5"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M9.75 11.4c.82-.78 1.64-.78 2.46 0s1.64.78 2.46 0",
						stroke: "currentColor",
						strokeLinecap: "round",
						strokeWidth: "1.5"
					})
				]
			});
		}
		//#endregion
		//#region src/client/BlueWhaleSettingsTriggerDecoration.tsx
		const SETTINGS_ARTWORK_ID = "d5dd1b2f-ecdc-4be7-abef-ce9a0cfc6f97";
		const ROOT_STYLE$1 = {
			position: "absolute",
			inset: 0,
			overflow: "hidden",
			boxSizing: "border-box",
			border: "1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 30%, var(--dsw-alias-border-l2))",
			borderRadius: "inherit",
			color: "var(--dsw-alias-brand-primary)",
			pointerEvents: "none"
		};
		const WIDE_ROOT_STYLE = {
			...ROOT_STYLE$1,
			background: "linear-gradient(100deg, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 82%, var(--dsw-alias-brand-primary)) 0%, color-mix(in srgb, var(--dsw-alias-bg-overlay) 74%, var(--dsw-alias-brand-primary)) 66%, color-mix(in srgb, var(--dsw-alias-brand-primary) 34%, var(--dsw-specific-sidebar-fill)) 100%)",
			boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-bg-overlay) 62%, transparent)"
		};
		const IMAGE_STYLE$1 = {
			position: "absolute",
			inset: "0 0 0 auto",
			width: "46%",
			backgroundPosition: "center 46%",
			backgroundRepeat: "no-repeat",
			backgroundSize: "cover",
			maskImage: "linear-gradient(to right, transparent 0%, black 55%)",
			WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 55%)",
			opacity: .34
		};
		const READABILITY_SCRIM_STYLE = {
			position: "absolute",
			inset: 0,
			background: "linear-gradient(90deg, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 78%, transparent) 0%, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 58%, transparent) 62%, transparent 100%)"
		};
		const RAIL_ROOT_STYLE = {
			...ROOT_STYLE$1,
			background: "radial-gradient(circle at 68% 24%, color-mix(in srgb, var(--dsw-alias-bg-overlay) 72%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-brand-primary) 22%, var(--dsw-specific-sidebar-fill)) 100%)",
			boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-bg-overlay) 66%, transparent)"
		};
		/**
		* Render right-side artwork in the wide trigger and quiet ripples in the rail.
		* @param props - Official sidebar display state.
		* @returns non-interactive Settings trigger decoration.
		*/
		function BlueWhaleSettingsTriggerDecoration({ wide }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				"data-kisekae-settings-trigger-decoration": wide ? "wide" : "rail",
				style: wide ? WIDE_ROOT_STYLE : RAIL_ROOT_STYLE,
				children: wide ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					"data-kisekae-settings-trigger-artwork": SETTINGS_ARTWORK_ID,
					style: {
						...IMAGE_STYLE$1,
						backgroundImage: `url(${artworkUrl(SETTINGS_ARTWORK_ID)})`
					}
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { style: READABILITY_SCRIM_STYLE })] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					"aria-hidden": "true",
					"data-kisekae-settings-trigger-ripples": "true",
					fill: "none",
					height: "100%",
					viewBox: "0 0 36 36",
					width: "100%",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M4 25c4.67-3.5 9.33-3.5 14 0s9.33 3.5 14 0",
						opacity: "0.22",
						stroke: "currentColor",
						strokeLinecap: "round",
						strokeWidth: "1.5"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M7 29c3.67-2.5 7.33-2.5 11 0s7.33 2.5 11 0",
						opacity: "0.14",
						stroke: "currentColor",
						strokeLinecap: "round",
						strokeWidth: "1.25"
					})]
				})
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/** Localized copy for the Kisekae settings section. */
		/** Locale namespace registered by the browser plugin. */
		const KISEKAE_LOCALE_NAMESPACE = "settings.kisekae";
		/** Chinese settings copy. */
		const zh = {
			nav: "外观与皮肤",
			title: "外观与皮肤",
			description: "皮肤会覆盖界面配色，但不会改变浅色、深色或跟随系统模式。",
			official: "官方外观",
			officialDescription: "使用 DeepSeek Harness 原本的颜色与界面风格。",
			blueWhale: "DeepSeek蓝鲸娘",
			blueWhaleDescription: "清爽海洋与深海夜色的非官方社区皮肤。",
			applied: "当前使用",
			selected: "已选择",
			previewing: "正在预览，应用后才会保存。",
			loading: "正在读取已保存的皮肤…",
			saving: "正在保存…",
			saved: "已保存到当前浏览器。",
			storageUnavailable: "当前浏览器无法保存皮肤，但仍可继续预览。",
			saveFailed: "没有保存成功。你可以重试，或取消预览。",
			unavailableSkin: "已保存的皮肤在当前版本中不可用，现正使用官方外观。点击应用可修复此设置。",
			fallback: "暂时使用",
			restoreOfficial: "恢复官方",
			cancel: "取消",
			apply: "应用",
			backdropTitle: "蓝鲸玻璃侧栏·雨幕",
			backdropDescription: "图片从侧栏底部向上渐隐；折叠为窄栏时自动使用安静的纯渐变。",
			backdropClear: "清爽",
			backdropImmersive: "沉浸",
			backdropOff: "关闭",
			backdropArtwork: "固定背景",
			backdropArtworkOption: "背景",
			backdropPreview: "蓝鲸玻璃侧栏效果预览",
			mainBackgroundTitle: "主对话背景",
			mainBackgroundDescription: "随机模式会在每次加载 Web 页面时更换图片；点击图鉴可固定一张。图片会随会话阶段自动降低存在感，保持内容清晰。",
			mainBackgroundRandom: "随机",
			mainBackgroundFixed: "固定",
			mainBackgroundOff: "关闭",
			galleryTitle: "蓝鲸娘图鉴",
			galleryDescription: "共 41 张。点击任意图片，即可固定为主对话背景。",
			artworkFixed: "主背景",
			artworkShown: "本次背景",
			chooseArtwork: "设为主对话背景"
		};
		/** English settings copy. */
		const en = {
			nav: "Appearance & Skins",
			title: "Appearance & Skins",
			description: "Skins recolor the interface without changing Light, Dark, or System mode.",
			official: "Official appearance",
			officialDescription: "Use the original DeepSeek Harness colors and interface style.",
			blueWhale: "DeepSeek Blue Whale-chan",
			blueWhaleDescription: "An unofficial community skin with ocean daylight and deep-sea night palettes.",
			applied: "In use",
			selected: "Selected",
			previewing: "Previewing. Apply to save this choice.",
			loading: "Loading the saved skin…",
			saving: "Saving…",
			saved: "Saved in this browser.",
			storageUnavailable: "This browser cannot save skins, but previews still work.",
			saveFailed: "The choice was not saved. Retry, or cancel the preview.",
			unavailableSkin: "The saved skin is unavailable in this version. Official appearance is active; Apply to repair this setting.",
			fallback: "Fallback",
			restoreOfficial: "Restore official",
			cancel: "Cancel",
			apply: "Apply",
			backdropTitle: "Blue Whale glass sidebar · Rain veil",
			backdropDescription: "Artwork fades upward from the sidebar foot; the narrow rail falls back to a quiet gradient.",
			backdropClear: "Clear",
			backdropImmersive: "Immersive",
			backdropOff: "Off",
			backdropArtwork: "Fixed background",
			backdropArtworkOption: "Background",
			backdropPreview: "Blue Whale glass sidebar preview",
			mainBackgroundTitle: "Main conversation background",
			mainBackgroundDescription: "Random mode chooses a new image whenever the Web page loads. Choose any gallery image to fix it. Artwork automatically recedes with the conversation phase to keep content clear.",
			mainBackgroundRandom: "Random",
			mainBackgroundFixed: "Fixed",
			mainBackgroundOff: "Off",
			galleryTitle: "Blue Whale-chan gallery",
			galleryDescription: "41 illustrations. Choose any image to fix it as the main conversation background.",
			artworkFixed: "Main background",
			artworkShown: "Current background",
			chooseArtwork: "Use as main conversation background"
		};
		//#endregion
		//#region src/client/main-background-store.ts
		/** Browser-local preference store for the main conversation background. */
		/** Versioned browser preference key for main-background controls. */
		const KISEKAE_MAIN_BACKGROUND_STORAGE_KEY = "@yehu77/dsh-kisekae:main-background:v1";
		const ARTWORK_IDS$1 = new Set(KISEKAE_ARTWORK_IDS);
		/** Small localStorage-backed store shared by settings and the conversation backdrop. */
		var MainBackgroundStore = class {
			listeners = /* @__PURE__ */ new Set();
			storage;
			snapshot;
			/**
			* @param storage - Browser storage; omitted callers use the current window.
			*/
			constructor(storage) {
				let browserStorage = storage;
				if (browserStorage === void 0) try {
					browserStorage = window.localStorage;
				} catch (_browserStorageUnavailable) {
					browserStorage = void 0;
				}
				this.storage = browserStorage;
				const preference = this.read();
				this.snapshot = this.resolve(preference.mode, preference.fixedArtworkId);
			}
			/** @returns the current main-background snapshot. */
			getSnapshot = () => this.snapshot;
			/**
			* Observe main-background preference changes.
			* @param listener - Subscriber notified after a local change.
			* @returns disposer removing the subscriber.
			*/
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			};
			/**
			* Change how the main background is selected.
			* @param mode - Fixed, random, or hidden mode.
			*/
			setMode(mode) {
				this.replace(this.resolve(mode, this.snapshot.fixedArtworkId));
			}
			/**
			* Show and remember one catalog artwork in fixed mode.
			* @param artworkId - Any released gallery artwork.
			*/
			fix(artworkId) {
				if (!ARTWORK_IDS$1.has(artworkId)) return;
				this.replace(this.resolve("fixed", artworkId));
			}
			read() {
				const fallback = {
					mode: "random",
					fixedArtworkId: DEFAULT_MAIN_BACKGROUND_ARTWORK_ID
				};
				if (this.storage === void 0) return fallback;
				try {
					const raw = this.storage.getItem(KISEKAE_MAIN_BACKGROUND_STORAGE_KEY);
					if (raw === null) return fallback;
					const value = JSON.parse(raw);
					if (!this.isMode(value.mode) || !ARTWORK_IDS$1.has(value.fixedArtworkId ?? "")) return fallback;
					return value;
				} catch (_storedPreferenceUnavailable) {
					return fallback;
				}
			}
			resolve(mode, fixedArtworkId) {
				if (mode === "off") return {
					mode,
					fixedArtworkId,
					shownArtworkId: null
				};
				if (mode === "fixed") return {
					mode,
					fixedArtworkId,
					shownArtworkId: fixedArtworkId
				};
				const index = Math.floor(Math.random() * KISEKAE_ARTWORKS.length);
				return {
					mode,
					fixedArtworkId,
					shownArtworkId: KISEKAE_ARTWORKS[index].id
				};
			}
			replace(snapshot) {
				this.snapshot = snapshot;
				try {
					this.storage?.setItem(KISEKAE_MAIN_BACKGROUND_STORAGE_KEY, JSON.stringify({
						mode: snapshot.mode,
						fixedArtworkId: snapshot.fixedArtworkId
					}));
				} catch (_browserStorageUnavailable) {}
				for (const listener of [...this.listeners]) listener();
			}
			isMode(value) {
				return value === "fixed" || value === "random" || value === "off";
			}
		};
		//#endregion
		//#region src/client/SidebarBackdrop.tsx
		/** Blue Whale glass sidebar artwork for the official backdrop slot. */
		const ROOT_STYLE = {
			position: "relative",
			width: "100%",
			height: "100%",
			overflow: "hidden",
			background: "linear-gradient(180deg, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 86%, var(--dsw-alias-brand-primary)) 0%, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 58%, var(--dsw-alias-brand-primary)) 100%)"
		};
		const LAYER_STYLE = {
			position: "absolute",
			inset: 0
		};
		const IMAGE_STYLE = {
			...LAYER_STYLE,
			backgroundPosition: "center bottom",
			backgroundRepeat: "no-repeat",
			backgroundSize: "cover",
			maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.68) 24%, #000 54%)",
			WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.68) 24%, #000 54%)"
		};
		const GLASS_STYLE = {
			...LAYER_STYLE,
			background: "linear-gradient(180deg, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 94%, transparent) 0%, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 74%, transparent) 58%, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 58%, transparent) 100%)"
		};
		/**
		* Render the fixed rain artwork, or a quiet gradient for the narrow rail.
		* @param props - Official sidebar owner state plus Kisekae preferences.
		* @returns decorative sidebar layer.
		*/
		function SidebarBackdrop({ wide, backdropStore }) {
			const snapshot = (0, react.useSyncExternalStore)(backdropStore.subscribe, backdropStore.getSnapshot, backdropStore.getSnapshot);
			const enabled = snapshot.mode !== "off";
			const immersive = snapshot.mode === "immersive";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				"data-kisekae-sidebar-backdrop": snapshot.mode,
				"data-kisekae-sidebar-wide": wide ? "true" : "false",
				style: {
					...ROOT_STYLE,
					background: enabled ? ROOT_STYLE.background : "transparent"
				},
				children: enabled && wide && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					"data-kisekae-sidebar-artwork": snapshot.artworkId,
					style: {
						...IMAGE_STYLE,
						backgroundImage: `url(${artworkUrl(snapshot.artworkId)})`,
						opacity: immersive ? .95 : .56
					}
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { style: {
					...GLASS_STYLE,
					opacity: immersive ? .2 : .34
				} })] })
			});
		}
		//#endregion
		//#region src/client/sidebar-backdrop-store.ts
		/** Browser-local preference store for the sidebar backdrop. */
		/** Versioned browser preference key for the sidebar backdrop. */
		const KISEKAE_SIDEBAR_BACKDROP_STORAGE_KEY = "@yehu77/dsh-kisekae:sidebar-backdrop:v1";
		/** Rain scene selected for a new browser origin. */
		const DEFAULT_SIDEBAR_BACKDROP_ARTWORK_ID = "7fd9fafc-aa19-449d-a92d-338a9bce7db5";
		const ARTWORK_IDS = new Set(KISEKAE_ARTWORK_IDS);
		/** Immediate localStorage-backed store shared by settings and the sidebar slot. */
		var SidebarBackdropStore = class {
			listeners = /* @__PURE__ */ new Set();
			storage;
			snapshot;
			/**
			* @param storage - Browser storage; omitted callers use the current window.
			*/
			constructor(storage) {
				let browserStorage = storage;
				if (browserStorage === void 0) try {
					browserStorage = window.localStorage;
				} catch (_browserStorageUnavailable) {
					browserStorage = void 0;
				}
				this.storage = browserStorage;
				this.snapshot = this.read();
			}
			/** @returns the current sidebar backdrop preference. */
			getSnapshot = () => this.snapshot;
			/**
			* Observe backdrop preference changes.
			* @param listener - Subscriber notified after a local change.
			* @returns disposer removing the subscriber.
			*/
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			};
			/**
			* Change the sidebar atmosphere level.
			* @param mode - Clear, immersive, or disabled.
			*/
			setMode(mode) {
				this.replace({
					...this.snapshot,
					mode
				});
			}
			/**
			* Fix one released illustration as the sidebar background.
			* @param artworkId - Artwork chosen from the shared catalog.
			*/
			setArtwork(artworkId) {
				if (!ARTWORK_IDS.has(artworkId)) return;
				this.replace({
					...this.snapshot,
					artworkId
				});
			}
			read() {
				const fallback = {
					mode: "clear",
					artworkId: DEFAULT_SIDEBAR_BACKDROP_ARTWORK_ID
				};
				if (this.storage === void 0) return fallback;
				try {
					const raw = this.storage.getItem(KISEKAE_SIDEBAR_BACKDROP_STORAGE_KEY);
					if (raw === null) return fallback;
					const value = JSON.parse(raw);
					if (!this.isMode(value.mode) || !ARTWORK_IDS.has(value.artworkId ?? "")) return fallback;
					return value;
				} catch (_storedPreferenceUnavailable) {
					return fallback;
				}
			}
			replace(snapshot) {
				this.snapshot = snapshot;
				try {
					this.storage?.setItem(KISEKAE_SIDEBAR_BACKDROP_STORAGE_KEY, JSON.stringify(snapshot));
				} catch (_browserStorageUnavailable) {}
				for (const listener of [...this.listeners]) listener();
			}
			isMode(value) {
				return value === "clear" || value === "immersive" || value === "off";
			}
		};
		//#endregion
		//#region src/client/themes/deepseek-blue-whale-chan.ts
		/** The first original community skin shipped by DSH Kisekae. */
		const DEEPSEEK_BLUE_WHALE_CHAN = {
			id: "deepseek-blue-whale-chan",
			displayName: {
				en: "DeepSeek Blue Whale-chan",
				zh: "DeepSeek蓝鲸娘"
			},
			relationship: "unofficial-community-theme",
			officialAffiliation: "none",
			tokens: {
				"--dsw-alias-bg-base": {
					light: "#F6FBFE",
					dark: "#091824"
				},
				"--dsw-alias-bg-layer-1": {
					light: "#FFFFFF",
					dark: "#102638"
				},
				"--dsw-alias-bg-layer-2": {
					light: "#EDF6FA",
					dark: "#173147"
				},
				"--dsw-alias-bg-layer-3": {
					light: "#E5F1F7",
					dark: "#1D3B52"
				},
				"--dsw-alias-bg-overlay": {
					light: "#DDECF4",
					dark: "#24475F"
				},
				"--dsw-alias-border-l1": {
					light: "rgba(24, 82, 110, 0.10)",
					dark: "rgba(154, 216, 239, 0.12)"
				},
				"--dsw-alias-border-l2": {
					light: "rgba(24, 82, 110, 0.18)",
					dark: "rgba(154, 216, 239, 0.22)"
				},
				"--dsw-alias-brand-primary": {
					light: "#155F7A",
					dark: "#69D2F0"
				},
				"--dsw-alias-button-primary-hover": {
					light: "#104B61",
					dark: "#8ADFF5"
				},
				"--dsw-alias-state-business-primary": {
					light: "#12627F",
					dark: "#6CD5F2"
				},
				"--dsw-alias-state-business-tertiary": {
					light: "#D8EEF7",
					dark: "#153E52"
				},
				"--dsw-alias-label-caption": {
					light: "#83A9B9",
					dark: "#5D91A6"
				},
				"--dsw-alias-label-dimmed": {
					light: "#BDD5DE",
					dark: "#365D72"
				},
				"--dsw-alias-label-primary": {
					light: "#0E5872",
					dark: "#C9F4FF"
				},
				"--dsw-alias-label-primary-dimmed": {
					light: "#1B607C",
					dark: "#B2E2F1"
				},
				"--dsw-alias-label-secondary": {
					light: "#386A80",
					dark: "#96CBDD"
				},
				"--dsw-alias-label-tertiary": {
					light: "#5E8799",
					dark: "#78B2C5"
				},
				"--dsw-specific-input-major": {
					light: "rgba(250, 254, 255, 0.94)",
					dark: "rgba(10, 32, 47, 0.94)"
				},
				"--dsw-specific-conversation-user-message-prose-color": {
					light: "#6A1B8C",
					dark: "#E8C4FF"
				},
				"--dsw-specific-conversation-user-message-prose-text-shadow": {
					light: "none",
					dark: "none"
				},
				"--dsw-specific-conversation-assistant-message-prose-color": {
					light: "#F8FDFF",
					dark: "#F4FCFF"
				},
				"--dsw-specific-conversation-assistant-message-prose-text-shadow": {
					light: "-1px 0 0 #1683B5, 1px 0 0 #1683B5, 0 -1px 0 #1683B5, 0 1px 0 #1683B5, 0 2px 0 #075E8E",
					dark: "-1px 0 0 #279AC8, 1px 0 0 #279AC8, 0 -1px 0 #279AC8, 0 1px 0 #279AC8, 0 2px 0 #074B70"
				},
				"--dsw-specific-conversation-message-prose-font-weight": {
					light: "500",
					dark: "500"
				},
				"--dsw-specific-sidebar-fill": {
					light: "#EAF5FA",
					dark: "#0D2131"
				},
				"--dsw-specific-sidebar-nav-item-hover": {
					light: "rgba(255, 255, 255, 0.52)",
					dark: "rgba(22, 58, 79, 0.62)"
				},
				"--dsw-specific-sidebar-nav-item-active": {
					light: "rgba(255, 255, 255, 0.74)",
					dark: "rgba(28, 72, 94, 0.78)"
				}
			}
		};
		//#endregion
		//#region src/client/skin-controller.ts
		/** Reversible preview and persistence controller for the Kisekae skin layer. */
		const TOKEN_SOURCE = "@yehu77/dsh-kisekae";
		function acceptedSkin(store) {
			const value = store.getSnapshot().value?.skin;
			if (value === void 0) return {
				skin: DEFAULT_KISEKAE_SKIN,
				unavailableSkin: null
			};
			return isKisekaeSkinId(value) ? {
				skin: value,
				unavailableSkin: null
			} : {
				skin: "official",
				unavailableSkin: value
			};
		}
		/**
		* Own the currently presented token layer, one staged choice, and the last
		* browser-saved choice.
		*/
		var SkinSelectionController = class {
			theme;
			store;
			snapshot;
			listeners = /* @__PURE__ */ new Set();
			storeDisposer;
			tokenDisposer;
			presented;
			generation = 0;
			activeGeneration;
			/**
			* @param theme - Official token override service.
			* @param store - Browser-local preference store.
			*/
			constructor(theme, store) {
				this.theme = theme;
				this.store = store;
				const stored = store.getSnapshot();
				this.snapshot = {
					status: stored.status,
					committed: DEFAULT_KISEKAE_SKIN,
					draft: DEFAULT_KISEKAE_SKIN,
					dirty: false,
					writable: stored.writable,
					mode: stored.mode,
					saving: false,
					error: null,
					unavailableSkin: null
				};
			}
			/** @returns the current stable selection snapshot. */
			getSnapshot = () => this.snapshot;
			/**
			* Observe selection snapshot replacements.
			* @param listener - React or test subscriber.
			* @returns the disposer removing the subscriber.
			*/
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			};
			/**
			* Start preference synchronization and present the saved/default skin.
			* @returns cleanup that removes the token layer and subscription.
			*/
			mount() {
				if (this.activeGeneration !== void 0) throw new Error("Kisekae skin controller is already mounted");
				const generation = ++this.generation;
				this.activeGeneration = generation;
				this.storeDisposer = this.store.subscribe(() => {
					this.syncFromStore(generation);
				});
				this.syncFromStore(generation);
				let disposed = false;
				return () => {
					if (disposed) return;
					disposed = true;
					if (this.activeGeneration !== generation) return;
					this.activeGeneration = void 0;
					const storeDisposer = this.storeDisposer;
					this.storeDisposer = void 0;
					storeDisposer?.();
					const tokenDisposer = this.tokenDisposer;
					this.tokenDisposer = void 0;
					this.presented = void 0;
					tokenDisposer?.();
				};
			}
			/** Stage and immediately preview one card without writing browser storage. */
			preview(skin) {
				const generation = this.activeGeneration;
				if (generation === void 0 || this.snapshot.saving || skin === this.snapshot.draft) return;
				this.present(skin, generation);
				if (this.activeGeneration !== generation) return;
				this.replace({
					draft: skin,
					error: null
				});
			}
			/** Discard the staged choice and restore the latest browser-saved skin. */
			cancelPreview() {
				const generation = this.activeGeneration;
				if (generation === void 0) return;
				this.present(this.snapshot.committed, generation);
				if (this.activeGeneration !== generation) return;
				this.replace({
					draft: this.snapshot.committed,
					error: null
				});
			}
			/**
			* Persist the staged choice, confirming success from the accepted snapshot.
			* @returns settlement after the browser-storage write and confirmation read.
			*/
			async applyPreview() {
				const generation = this.activeGeneration;
				if (generation === void 0 || !this.snapshot.dirty || !this.snapshot.writable || this.snapshot.saving) return;
				const target = this.snapshot.draft;
				this.replace({
					saving: true,
					error: null
				});
				try {
					await this.store.set(KISEKAE_SKIN_FIELD, target);
				} catch (_unexpectedSettingsFailure) {
					if (this.activeGeneration === generation) this.replace({
						saving: false,
						error: "save-failed"
					});
					return;
				}
				if (this.activeGeneration !== generation) return;
				this.syncFromStore(generation);
				const accepted = this.store.getSnapshot().status === "ready" && this.store.getSnapshot().value?.skin === target;
				this.replace({
					saving: false,
					error: accepted ? null : "save-failed"
				});
			}
			syncFromStore(generation) {
				if (this.activeGeneration !== generation) return;
				const stored = this.store.getSnapshot();
				const accepted = acceptedSkin(this.store);
				const nextCommitted = accepted.skin;
				const committedChanged = nextCommitted !== this.snapshot.committed || accepted.unavailableSkin !== this.snapshot.unavailableSkin;
				const nextDraft = !this.snapshot.dirty || committedChanged ? nextCommitted : this.snapshot.draft;
				this.present(nextDraft, generation);
				this.replace({
					status: stored.status,
					committed: nextCommitted,
					draft: nextDraft,
					writable: stored.writable,
					mode: stored.mode,
					unavailableSkin: accepted.unavailableSkin,
					...committedChanged ? { error: null } : {}
				});
			}
			present(skin, generation) {
				if (this.activeGeneration !== generation || skin === this.presented) return;
				const previous = this.tokenDisposer;
				const next = skin === "official" ? void 0 : this.theme.overrideTokens(TOKEN_SOURCE, DEEPSEEK_BLUE_WHALE_CHAN.tokens);
				if (this.activeGeneration !== generation) {
					next?.();
					return;
				}
				this.tokenDisposer = next;
				this.presented = skin;
				previous?.();
			}
			replace(changes) {
				const next = {
					...this.snapshot,
					...changes
				};
				const replacement = {
					...next,
					dirty: next.draft !== next.committed || next.unavailableSkin !== null && next.draft === "official"
				};
				if (!Object.keys(replacement).some((key) => {
					const field = key;
					return replacement[field] !== this.snapshot[field];
				})) return;
				this.snapshot = replacement;
				for (const listener of [...this.listeners]) listener();
			}
		};
		//#endregion
		//#region src/client/SkinSelectorSection.tsx
		/** Settings page for previewing and applying one Kisekae skin. */
		const SECTION_STYLE = {
			containerType: "inline-size",
			display: "flex",
			flexDirection: "column",
			gap: 20,
			minWidth: 0,
			padding: "8px 0 24px"
		};
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
  [data-kisekae-backdrop-mode-group] {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4px !important;
  }
  [data-kisekae-mode-group] button,
  [data-kisekae-backdrop-mode-group] button {
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
`;
		const HEADER_STYLE = {
			display: "flex",
			flexDirection: "column",
			gap: 6
		};
		const TITLE_STYLE = {
			margin: 0,
			color: "var(--dsw-alias-label-primary)",
			fontSize: 20,
			lineHeight: 1.4
		};
		const DESCRIPTION_STYLE = {
			margin: 0,
			color: "var(--dsw-alias-label-secondary)",
			fontSize: 13,
			lineHeight: 1.6
		};
		const CARD_GRID_STYLE = {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
			gap: 12,
			minWidth: 0
		};
		const CARD_BASE_STYLE = {
			boxSizing: "border-box",
			display: "flex",
			flexDirection: "column",
			gap: 14,
			width: "100%",
			minWidth: 0,
			minHeight: 154,
			padding: 18,
			border: "1px solid var(--dsw-alias-border-l2)",
			borderRadius: 16,
			background: "var(--dsw-alias-bg-layer-1)",
			color: "var(--dsw-alias-label-primary)",
			font: "inherit",
			textAlign: "left",
			cursor: "pointer"
		};
		const CARD_SELECTED_STYLE = {
			borderColor: "var(--dsw-alias-state-business-primary)",
			background: "var(--dsw-alias-state-business-tertiary)",
			boxShadow: "0 0 0 1px var(--dsw-alias-state-business-primary)"
		};
		const CARD_HEADING_STYLE = {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 8,
			fontSize: 15,
			fontWeight: 600
		};
		const BADGE_STYLE = {
			flex: "none",
			padding: "2px 8px",
			borderRadius: 999,
			background: "var(--dsw-alias-bg-layer-2)",
			color: "var(--dsw-alias-label-secondary)",
			fontSize: 11,
			fontWeight: 500
		};
		const SWATCH_ROW_STYLE = {
			display: "flex",
			gap: 6,
			padding: 10,
			border: "1px solid var(--dsw-alias-border-l1)",
			borderRadius: 12,
			background: "var(--dsw-alias-bg-base)"
		};
		const SWATCH_STYLE = {
			flex: 1,
			height: 24,
			borderRadius: 7,
			border: "1px solid rgba(127, 127, 127, 0.18)"
		};
		const CARD_DESCRIPTION_STYLE = {
			margin: 0,
			color: "var(--dsw-alias-label-secondary)",
			fontSize: 12,
			lineHeight: 1.55
		};
		const FOOTER_STYLE = {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			flexWrap: "wrap",
			gap: 12,
			paddingTop: 16,
			borderTop: "1px solid var(--dsw-alias-border-l2)"
		};
		const ACTION_GROUP_STYLE = {
			display: "flex",
			flexWrap: "wrap",
			justifyContent: "flex-end",
			gap: 8
		};
		const BUTTON_BASE_STYLE = {
			height: 36,
			padding: "0 14px",
			borderRadius: 18,
			border: "1px solid var(--dsw-alias-border-l2)",
			background: "transparent",
			color: "var(--dsw-alias-label-primary)",
			font: "inherit",
			fontSize: 14,
			cursor: "pointer"
		};
		const PRIMARY_BUTTON_STYLE = {
			...BUTTON_BASE_STYLE,
			borderColor: "transparent",
			background: "var(--dsw-alias-button-primary-fill)",
			color: "var(--dsw-alias-label-primary-foreground)"
		};
		const STATUS_STYLE = {
			minHeight: 20,
			margin: 0,
			color: "var(--dsw-alias-label-secondary)",
			fontSize: 12,
			lineHeight: 1.5
		};
		const SUBSECTION_STYLE = {
			display: "flex",
			flexDirection: "column",
			gap: 10,
			minWidth: 0,
			paddingTop: 18,
			borderTop: "1px solid var(--dsw-alias-border-l2)"
		};
		const SUBTITLE_STYLE = {
			margin: 0,
			color: "var(--dsw-alias-label-primary)",
			fontSize: 16,
			lineHeight: 1.4
		};
		const MODE_GROUP_STYLE = {
			display: "flex",
			flexWrap: "wrap",
			gap: 8
		};
		const MODE_SELECTED_STYLE = {
			borderColor: "var(--dsw-alias-state-business-primary)",
			background: "var(--dsw-alias-state-business-tertiary)"
		};
		const GALLERY_GRID_STYLE = {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fill, minmax(min(112px, 100%), 1fr))",
			gap: 10,
			minWidth: 0
		};
		const ARTWORK_BUTTON_STYLE = {
			display: "flex",
			flexDirection: "column",
			gap: 6,
			minWidth: 0,
			padding: 6,
			border: "1px solid var(--dsw-alias-border-l1)",
			borderRadius: 12,
			background: "var(--dsw-alias-bg-layer-1)",
			color: "var(--dsw-alias-label-primary)",
			font: "inherit",
			cursor: "pointer"
		};
		const ARTWORK_IMAGE_STYLE = {
			display: "block",
			width: "100%",
			aspectRatio: "4 / 5",
			objectFit: "contain",
			borderRadius: 8,
			background: "var(--dsw-alias-bg-layer-2)"
		};
		const ARTWORK_META_STYLE = {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 4,
			minHeight: 20,
			fontSize: 11
		};
		const BACKDROP_CONTROL_STYLE = {
			display: "grid",
			gridTemplateColumns: "minmax(0, 1fr) minmax(150px, 0.8fr)",
			gap: 12,
			minWidth: 0
		};
		const SELECT_LABEL_STYLE = {
			display: "flex",
			flexDirection: "column",
			gap: 6,
			minWidth: 0,
			color: "var(--dsw-alias-label-secondary)",
			fontSize: 12
		};
		const SELECT_STYLE = {
			width: "100%",
			height: 36,
			padding: "0 10px",
			border: "1px solid var(--dsw-alias-border-l2)",
			borderRadius: 10,
			background: "var(--dsw-alias-bg-layer-1)",
			color: "var(--dsw-alias-label-primary)",
			font: "inherit",
			fontSize: 13
		};
		const SIDEBAR_PREVIEW_STYLE = {
			position: "relative",
			height: 300,
			overflow: "hidden",
			border: "1px solid var(--dsw-alias-border-l2)",
			borderRadius: 16,
			background: "var(--dsw-specific-sidebar-fill)"
		};
		const PREVIEW_CONTENT_STYLE = {
			position: "absolute",
			inset: 0,
			zIndex: 1,
			display: "flex",
			flexDirection: "column",
			gap: 10,
			padding: 14
		};
		const PREVIEW_WORDMARK_STYLE = {
			width: "58%",
			height: 14,
			marginBottom: 8,
			borderRadius: 999,
			background: "var(--dsw-alias-label-primary)",
			opacity: .74
		};
		const PREVIEW_ROW_STYLE = {
			height: 34,
			border: "1px solid rgba(255, 255, 255, 0.28)",
			borderRadius: 10,
			background: "var(--dsw-specific-sidebar-nav-item-hover)",
			boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.28)"
		};
		const CARDS = [{
			id: "official",
			nameKey: "official",
			descriptionKey: "officialDescription",
			colors: [
				"#FFFFFF",
				"#F1F3F5",
				"#151517"
			]
		}, {
			id: "deepseek-blue-whale-chan",
			nameKey: "blueWhale",
			descriptionKey: "blueWhaleDescription",
			colors: [
				"#F6FBFE",
				"#69D2F0",
				"#091824"
			]
		}];
		const MAIN_BACKGROUND_MODES = [
			{
				id: "random",
				label: "mainBackgroundRandom"
			},
			{
				id: "fixed",
				label: "mainBackgroundFixed"
			},
			{
				id: "off",
				label: "mainBackgroundOff"
			}
		];
		const BACKDROP_MODES = [
			{
				id: "clear",
				label: "backdropClear"
			},
			{
				id: "immersive",
				label: "backdropImmersive"
			},
			{
				id: "off",
				label: "backdropOff"
			}
		];
		function statusKey(snapshot) {
			if (snapshot.error !== null) return "saveFailed";
			if (snapshot.saving) return "saving";
			if (snapshot.status === "loading") return "loading";
			if (snapshot.mode === "memory" || !snapshot.writable) return "storageUnavailable";
			if (snapshot.unavailableSkin !== null) return "unavailableSkin";
			if (snapshot.dirty) return "previewing";
			return "saved";
		}
		/**
		* Render the responsive two-card skin picker.
		* @param props - Slot-injected controller and localized copy.
		* @returns the settings section element tree.
		*/
		function SkinSelectorSection({ controller, mainBackgroundStore, backdropStore, t }) {
			const snapshot = (0, react.useSyncExternalStore)(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
			const mainBackground = (0, react.useSyncExternalStore)(mainBackgroundStore.subscribe, mainBackgroundStore.getSnapshot, mainBackgroundStore.getSnapshot);
			const backdrop = (0, react.useSyncExternalStore)(backdropStore.subscribe, backdropStore.getSnapshot, backdropStore.getSnapshot);
			const headingId = (0, react.useId)();
			const backdropHeadingId = (0, react.useId)();
			const mainBackgroundHeadingId = (0, react.useId)();
			const galleryHeadingId = (0, react.useId)();
			(0, react.useEffect)(() => () => {
				controller.cancelPreview();
			}, [controller]);
			const busy = snapshot.saving;
			const applyDisabled = !snapshot.dirty || busy || !snapshot.writable || snapshot.status !== "ready";
			const hasPreview = snapshot.draft !== snapshot.committed;
			const status = statusKey(snapshot);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				"data-kisekae-skin-section": "true",
				style: SECTION_STYLE,
				"aria-labelledby": headingId,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: NARROW_LAYOUT_CSS }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						style: HEADER_STYLE,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							id: headingId,
							style: TITLE_STYLE,
							children: t("title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							"data-kisekae-section-description": "true",
							style: DESCRIPTION_STYLE,
							children: t("description")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						role: "group",
						"aria-labelledby": headingId,
						style: CARD_GRID_STYLE,
						children: CARDS.map((card) => {
							const selected = snapshot.draft === card.id;
							const applied = snapshot.committed === card.id;
							const fallback = card.id === "official" && snapshot.unavailableSkin !== null;
							return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": selected,
								disabled: busy,
								"data-kisekae-skin": card.id,
								style: {
									...CARD_BASE_STYLE,
									...selected ? CARD_SELECTED_STYLE : {}
								},
								onClick: () => {
									controller.preview(card.id);
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										"data-kisekae-card-heading": "true",
										style: CARD_HEADING_STYLE,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(card.nameKey) }), (selected || applied) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											style: BADGE_STYLE,
											children: fallback ? t("fallback") : selected && hasPreview ? t("selected") : t("applied")
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										style: SWATCH_ROW_STYLE,
										children: card.colors.map((color) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { style: {
											...SWATCH_STYLE,
											background: color
										} }, color))
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"data-kisekae-card-description": "true",
										style: CARD_DESCRIPTION_STYLE,
										children: t(card.descriptionKey)
									})
								]
							}, card.id);
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("footer", {
						"data-kisekae-footer": "true",
						style: FOOTER_STYLE,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: busy || snapshot.draft === "official",
							style: {
								...BUTTON_BASE_STYLE,
								opacity: busy || snapshot.draft === "official" ? .45 : 1
							},
							onClick: () => {
								controller.preview("official");
							},
							children: t("restoreOfficial")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							"data-kisekae-action-group": "true",
							style: ACTION_GROUP_STYLE,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: !hasPreview || busy,
								style: {
									...BUTTON_BASE_STYLE,
									opacity: !hasPreview || busy ? .45 : 1
								},
								onClick: () => {
									controller.cancelPreview();
								},
								children: t("cancel")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: applyDisabled,
								style: {
									...PRIMARY_BUTTON_STYLE,
									opacity: applyDisabled ? .45 : 1
								},
								onClick: () => {
									controller.applyPreview();
								},
								children: t("apply")
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						"aria-live": snapshot.error === null ? "polite" : "assertive",
						role: snapshot.error === null ? "status" : "alert",
						style: {
							...STATUS_STYLE,
							color: snapshot.error === null ? STATUS_STYLE.color : "var(--dsw-alias-state-error-primary)"
						},
						children: t(status)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						"aria-labelledby": backdropHeadingId,
						"data-kisekae-sidebar-settings": "true",
						style: SUBSECTION_STYLE,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: HEADER_STYLE,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
								id: backdropHeadingId,
								style: SUBTITLE_STYLE,
								children: t("backdropTitle")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								"data-kisekae-subsection-description": "true",
								style: DESCRIPTION_STYLE,
								children: t("backdropDescription")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							"data-kisekae-backdrop-controls": "true",
							style: BACKDROP_CONTROL_STYLE,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								role: "group",
								"aria-labelledby": backdropHeadingId,
								"data-kisekae-backdrop-mode-group": "true",
								style: MODE_GROUP_STYLE,
								children: BACKDROP_MODES.map((mode) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": backdrop.mode === mode.id,
									"data-kisekae-backdrop-mode": mode.id,
									style: {
										...BUTTON_BASE_STYLE,
										...backdrop.mode === mode.id ? MODE_SELECTED_STYLE : {}
									},
									onClick: () => {
										backdropStore.setMode(mode.id);
									},
									children: t(mode.label)
								}, mode.id))
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								style: {
									...SELECT_LABEL_STYLE,
									marginTop: 12
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("backdropArtwork") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
									"aria-label": t("backdropArtwork"),
									"data-kisekae-backdrop-artwork-select": "true",
									style: SELECT_STYLE,
									value: backdrop.artworkId,
									onChange: (event) => {
										backdropStore.setArtwork(event.currentTarget.value);
									},
									children: KISEKAE_ARTWORKS.map((artwork, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
										value: artwork.id,
										children: [
											t("backdropArtworkOption"),
											" ",
											String(index + 1).padStart(2, "0")
										]
									}, artwork.id))
								})]
							})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								role: "img",
								"aria-label": t("backdropPreview"),
								"data-kisekae-sidebar-preview": "true",
								style: SIDEBAR_PREVIEW_STYLE,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SidebarBackdrop, {
									wide: true,
									backdropStore
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									"aria-hidden": "true",
									style: PREVIEW_CONTENT_STYLE,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { style: PREVIEW_WORDMARK_STYLE }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { style: {
											...PREVIEW_ROW_STYLE,
											background: "var(--dsw-specific-sidebar-nav-item-active)"
										} }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { style: PREVIEW_ROW_STYLE }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { style: {
											...PREVIEW_ROW_STYLE,
											opacity: .82
										} })
									]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						"aria-labelledby": mainBackgroundHeadingId,
						style: SUBSECTION_STYLE,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: HEADER_STYLE,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
								id: mainBackgroundHeadingId,
								style: SUBTITLE_STYLE,
								children: t("mainBackgroundTitle")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								"data-kisekae-subsection-description": "true",
								style: DESCRIPTION_STYLE,
								children: t("mainBackgroundDescription")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							role: "group",
							"aria-labelledby": mainBackgroundHeadingId,
							"data-kisekae-mode-group": "true",
							style: MODE_GROUP_STYLE,
							children: MAIN_BACKGROUND_MODES.map((mode) => {
								const selected = mainBackground.mode === mode.id;
								return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": selected,
									"data-kisekae-main-background-mode": mode.id,
									style: {
										...BUTTON_BASE_STYLE,
										...selected ? MODE_SELECTED_STYLE : {}
									},
									onClick: () => {
										mainBackgroundStore.setMode(mode.id);
									},
									children: t(mode.label)
								}, mode.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						"aria-labelledby": galleryHeadingId,
						style: SUBSECTION_STYLE,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: HEADER_STYLE,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
								id: galleryHeadingId,
								style: SUBTITLE_STYLE,
								children: t("galleryTitle")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								"data-kisekae-subsection-description": "true",
								style: DESCRIPTION_STYLE,
								children: t("galleryDescription")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							"data-kisekae-gallery": "true",
							style: GALLERY_GRID_STYLE,
							children: KISEKAE_ARTWORKS.map((artwork, index) => {
								const fixed = mainBackground.mode === "fixed" && mainBackground.fixedArtworkId === artwork.id;
								const shown = mainBackground.mode === "random" && mainBackground.shownArtworkId === artwork.id;
								return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-label": `${t("chooseArtwork")} ${index + 1}`,
									"aria-pressed": fixed,
									"data-kisekae-artwork": artwork.id,
									style: {
										...ARTWORK_BUTTON_STYLE,
										...fixed ? CARD_SELECTED_STYLE : {}
									},
									onClick: () => {
										mainBackgroundStore.fix(artwork.id);
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
										alt: "",
										decoding: "async",
										loading: "lazy",
										src: artworkUrl(artwork.id),
										style: ARTWORK_IMAGE_STYLE
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										style: ARTWORK_META_STYLE,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }), (fixed || shown) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(fixed ? "artworkFixed" : "artworkShown") })]
									})]
								}, artwork.id);
							})
						})]
					})
				]
			});
		}
		//#endregion
		//#region src/client/skin-visual-orchestrator.ts
		/**
		* Mount all Blue Whale shell visuals while its card is the visible draft.
		* @param selection - Current preview selection.
		* @param installVisuals - Installs the complete reversible visual group.
		* @returns cleanup for the subscription and any mounted visual group.
		*/
		function mountSkinVisuals(selection, installVisuals) {
			let disposeVisuals;
			const sync = () => {
				const enabled = selection.getSnapshot().draft === "deepseek-blue-whale-chan";
				if (enabled && disposeVisuals === void 0) disposeVisuals = installVisuals();
				else if (!enabled && disposeVisuals !== void 0) {
					const dispose = disposeVisuals;
					disposeVisuals = void 0;
					dispose();
				}
			};
			const unsubscribe = selection.subscribe(sync);
			sync();
			return () => {
				unsubscribe();
				disposeVisuals?.();
				disposeVisuals = void 0;
			};
		}
		//#endregion
		//#region src/client/index.ts
		/** Browser half: durable skin selection over the official color mode. */
		/** Cordis services required by the browser entry. */
		const inject = [
			"theme",
			"slots",
			"locale"
		];
		/**
		* Mount the durable skin controller and its settings page.
		* @param ctx - Client context with theme, locale, and slot services.
		*/
		function apply(ctx) {
			const store = new BrowserSkinStore(window);
			const controller = new SkinSelectionController(ctx.theme, store);
			const mainBackgroundStore = new MainBackgroundStore();
			const backdropStore = new SidebarBackdropStore();
			ctx.effect(() => {
				const disposeStore = store.mount();
				const disposeController = controller.mount();
				return () => {
					disposeController();
					disposeStore();
				};
			}, "dsh-kisekae: skin selection controller");
			ctx.effect(() => ctx.locale.register(KISEKAE_LOCALE_NAMESPACE, {
				zh,
				en
			}), "dsh-kisekae: settings dictionaries");
			const t = ctx.locale.bind(KISEKAE_LOCALE_NAMESPACE);
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "kisekae-skins",
				order: 15,
				label: () => t("nav"),
				locale: KISEKAE_LOCALE_NAMESPACE,
				inject: () => ({
					controller,
					mainBackgroundStore,
					backdropStore
				})
			}, SkinSelectorSection));
			ctx.effect(() => mountSkinVisuals(controller, () => {
				const disposers = [
					ctx.slots.inject("conversation.composer.bar.decoration", () => ctx.slots.register({ name: "conversation.composer.bar.decoration" }, BlueWhaleComposerDecoration)),
					ctx.slots.inject("conversation.backdrop", () => ctx.slots.register({
						name: "conversation.backdrop",
						inject: () => ({ mainBackgroundStore })
					}, BlueWhaleConversationBackdrop)),
					ctx.slots.inject("sidebar.backdrop", () => ctx.slots.register({
						name: "sidebar.backdrop",
						inject: () => ({ backdropStore })
					}, SidebarBackdrop)),
					ctx.slots.inject("sidebar.newSession.decoration", () => ctx.slots.register({ name: "sidebar.newSession.decoration" }, BlueWhaleNewSessionDecoration)),
					ctx.slots.inject("sidebar.newSession.icon", () => ctx.slots.register({ name: "sidebar.newSession.icon" }, BlueWhaleNewSessionIcon)),
					ctx.slots.inject("settings.trigger.decoration", () => ctx.slots.register({ name: "settings.trigger.decoration" }, BlueWhaleSettingsTriggerDecoration))
				];
				return () => {
					for (const dispose of disposers.toReversed()) dispose();
				};
			}), "dsh-kisekae: skin visual contributions");
		}
		//#endregion
		exports.DEEPSEEK_BLUE_WHALE_CHAN = DEEPSEEK_BLUE_WHALE_CHAN;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map