[Home](../../README.md) | [Quick Start](../../docs/quick-start.md) | [Overview](../../docs/overview.md) | [Features](../../docs/features.md) | [Installation](../../docs/installation/README.md) | [Settings](../../docs/settings/README.md) | [Troubleshooting](../../docs/troubleshooting.md) | [FAQ](../../docs/faq.md)

---
# Settings Breakdown

Nuvio's settings allow for deep customization. Below is a detailed breakdown, noting differences between the **Mobile** and **Android TV** versions.

> [!IMPORTANT]
> Anything not labeled [TV Only] or [Mobile Only] is a feature of both versions[span_0](start_span)[span_0](end_span).

## 1. General & UI
| Setting | Mobile | Android TV |
| :--- | :--- | :--- |
| **Theme** | Select custom accent color palettes (White, Crimson, Ocean, Violet, Emerald, Amber, Rose). Toggle **AMOLED Black** to use pure black backgrounds for OLED screens. | Select custom accent color palettes (White, Crimson, Ocean, Violet, Emerald, Amber, Rose)[span_1](start_span)[span_1](end_span). Toggle **AMOLED Mode** and **Pure Black Surfaces** to use pure black app backgrounds and card surfaces[span_2](start_span)[span_2](end_span). |
| **Font & Language** | Adjust global App Language overrides. | Adjust global App Font family choices and App Language overrides[span_3](start_span)[span_3](end_span). |
| **Layout / Home Shelf** | Toggle the **Show Continue Watching** shelf on the Home screen. Select a base home card type: **Card** (TV-style landscape card), **Wide** (Info-dense horizontal card), or **Poster** (Artwork-first poster card). Toggle **Resume prompt on launch** popups. | Switch home dashboards between Modern View (with dedicated hero panels), Grid View, or Classic View[span_4](start_span)[span_4](end_span). Toggle Fullscreen Hero Backdrops[span_5](start_span)[span_5](end_span). Configure auto-collapsing sidebars[span_6](start_span)[span_6](end_span). |
| **Up Next Behavior** | Configure granular tracking rules: **Prefer Episode Thumbnails**, **Up Next From Furthest Episode** (disable for rewatches to use most recent), **Show Unaired Next Up Episodes**, and **Blur Unwatched** to avoid spoilers. | Configure series playback lines using *Prefer Binge Group* rules[span_7](start_span)[span_7](end_span), *Reuse Binge Groups*[span_8](start_span)[span_8](end_span), and variable *Next Episode Threshold Mode* percentages[span_9](start_span)[span_9](end_span). |
| **Poster Card Style** | Fine-tune card **Width** (Compact, Dense, Standard, Balanced, Comfort, Large) and **Corner Radius** (Sharp, Subtle, Classic, Rounded, Pill) with a real-time pixel size **Live Preview**. Toggle **Landscape Posters** and **Hide labels**. | Fine-tune card Width metrics (Compact to Large)[span_10](start_span)[span_10](end_span), Corner Radius geometries (Sharp to Pill)[span_11](start_span)[span_11](end_span), and hover **Backdrop Expand Delay** timers[span_12](start_span)[span_12](end_span). Toggle Landscape Posters[span_13](start_span)[span_13](end_span). |

## 2. Playback
- **Internal Player:** Highly recommended for most users. Supports hardware decoding[span_14](start_span)[span_14](end_span).
  - *Internal Engine:* Manually choose between ExoPlayer or libmpv as the primary background media core[span_15](start_span)[span_15](end_span).
  - *Auto-switch engine on startup error [TV Only]:* Automatically falls back from ExoPlayer to libmpv for detected anime or if an initialization failure occurs[span_16](start_span)[span_16](end_span).
- **External Player:** Useful if you encounter codec issues. Nuvio can pass the stream to VLC, MX Player, or JustPlayer[span_17](start_span)[span_17](end_span).
- **Hardware Acceleration:** Toggle this if you experience stuttering on older devices[span_18](start_span)[span_18](end_span).
- **Auto-Play Next:** Automatically start the next episode in a series[span_19](start_span)[span_19](end_span).
- **Intro and Outro Skip:** Prioritizes segment database filters across IntroDB, AniSkip, and Anime Skip[span_20](start_span)[span_20](end_span). Includes automated community timestamp submission tools **[Mobile Only]**[span_21](start_span)[span_21](end_span) alongside custom parental guidance Content Warnings and automated segment skipping filters **[TV Only]**[span_22](start_span)[span_22](end_span).
- **Stream Selection & Auto-Play:** Configures connection handshakes using *Reuse Last Link*, *Last Link Cache Duration* thresholds, explicit *Selection Modes* (Auto-play first source, Manual list, or custom Regex text matching)[span_23](start_span)[span_23](end_span), scraper *Timeout* settings, and granular *Filtering Scopes* for plugins/addons[span_24](start_span)[span_24](end_span).
- **Binge Watching Options:** Customizes automated series playback chains via *Prefer Binge Group* rules[span_25](start_span)[span_25](end_span), *Reuse Binge Groups*, variable *Next Episode Threshold Mode* percentages[span_26](start_span)[span_26](end_span), and idle security prompts via *Are You Still Watching? [TV Only]*[span_27](start_span)[span_27](end_span).
- **Subtitle and Audio Preferences:** Locks primary and secondary multi-track audio/subtitle languages, filters out non-preferred tracking layers, utilizes a *Skip Silence* trigger, and offers an *Enable downmix* route to crush multichannel surround sound into clear stereo speaker arrays[span_28](start_span)[span_28](end_span).
- **Subtitle Layout Adjustments:** Tailors caption scaling sizes, custom text/background color profiles, outline parameters, and *Vertical Offset*. Includes an experimental toggle to deploy the **libass rendering engine** for heavy ASS/SSA dynamic typesetting scripts[span_29](start_span)[span_29](end_span).
- **Interface & Control Overlays:** Features standard *Loading Overlays* to hide network lag[span_30](start_span)[span_30](end_span). Includes passive informational *Pause Overlays [TV Only]*[span_31](start_span)[span_31](end_span), *OSD System Clocks [TV Only]*[span_32](start_span)[span_32](end_span), touchscreen *Hold To Speed / Hold Speed* scaling multipliers **[Mobile Only]**[span_33](start_span)[span_33](end_span), and sliding vertical *Gesture Controls* for volume/brightness **[Mobile Only]**[span_34](start_span)[span_34](end_span).

## 3. Account Integrations
- **Trakt.tv:** Syncs your "Up Next" list and watch history across all Nuvio devices[span_35](start_span)[span_35](end_span).
- **Torbox / Premiumize:** 
  - Essential for high-quality, buffer-free 4K streams[span_36](start_span)[span_36](end_span).
  - Requires an API Key or Device Code for authorization[span_37](start_span)[span_37](end_span).
- **Plugins & Extensions:** Manages third-party scraper repositories globally, allowing integrations via direct URL inputs or mobile QR code syncing codes[span_38](start_span)[span_38](end_span).
- **TMDB Enrichment Sourcing:** Pulls downstream artwork, textless backdrops, synchronized release countdown metrics, cast crew indices, production networks, and dedicated episode runtimes[span_39](start_span)[span_39](end_span).
- **MDBList Ratings API:** Connects a custom key to fetch and layer platform rating scores (Trakt, IMDb, TMDB, Letterboxd, Rotten Tomatoes, Audience, and Metacritic) over title dashboard views[span_40](start_span)[span_40](end_span).
- **Anime Skip Integration:** Authorizes account validation links via an external Client ID to activate accurate crowd-sourced timestamp skipping triggers[span_41](start_span)[span_41](end_span).

## 4. Advanced (Android TV Only)
- **Decoder Priority:** Dictates processing priorities across *Device decoders only* (strict hardware parsing), *Prefer device decoders* (hardware priority with software fallbacks), or *Prefer app decoders (FFmpeg)* (software processing for legacy formats)[span_42](start_span)[span_42](end_span).
- **Advanced Display Formatting:** Utilizes standard *DV7 - HEVC Fallback* layers to fix distorted purple/green color rendering profiles[span_43](start_span)[span_43](end_span). Adds options for *Preserve DV mapping (DV7 to DV8.1)* and *Convert DV5 to DV8.1* matrices[span_44](start_span)[span_44](end_span).
- **Refresh Rate Switching (AFR):** Automatically matches your TV's refresh rate to the content (e.g., 24fps) to eliminate judder[span_45](start_span)[span_45](end_span). Configurable as *Off*, *On start*, or *On start/stop* parameters[span_46](start_span)[span_46](end_span).
- **Tunnelled Playback:** Improves synchronization and reduces overhead on supported Android TV hardware[span_47](start_span)[span_47](end_span). It sends raw video streams directly to the display chips to optimize heavy 4K HDR playback rendering chains[span_48](start_span)[span_48](end_span).
- **Force AC-3 Transcoding (Optical/SPDIF):** Live-transcodes heavy modern multichannel sound formats (TrueHD, DTS, AAC) into traditional compressed Dolby Digital 5.1 tracks to maintain output over bandwidth-limited digital optical audio connections[span_49](start_span)[span_49](end_span).

## 5. Buffer and Network
These configurations govern internal memory allocation thresholds, local system caching pools, and network data transit rules[span_50](start_span)[span_50](end_span).

- **Custom Playback Buffers:** Completely overrides stock Media3 parameters with specialized processing limits[span_51](start_span)[span_51](end_span):
  - *Min / Max Buffer Duration:* Calibrates the safe minimum and maximum content duration thresholds to cache ahead of the active video cursor position[span_52](start_span)[span_52](end_span).
  - *Initial Buffer & Buffer After Rebuffer:* Sets the precise buffering depth required before an initialized video stream boots, or when reclaiming feeds after a playback stall[span_53](start_span)[span_53](end_span).
  - *Back Buffer Duration:* Holds already-viewed stream data inside local system memory arrays to enable instant seek-back actions without re-downloading source content[span_54](start_span)[span_54](end_span).
  - *Target Buffer Allocations:* Manages device RAM footprints safely via an automated *Managed Memory Budget* filter, or overrides restrictions to unlock manual caching sliders up to 2GB via the *Allow Larger Target Buffer* toggle[span_55](start_span)[span_55](end_span).
- **Disk Cache Performance:** Establishes fixed storage caching partitions[span_56](start_span)[span_56](end_span):
  - *VOD Disk Cache:* Saves active downloaded file arrays directly onto internal storage to shield progressive media playback from momentary network drops[span_57](start_span)[span_57](end_span).
  - *Auto Size:* Automates cache constraints targeting roughly 10% of total available free space, with manual overrides to maintain strict storage headroom margins[span_58](start_span)[span_58](end_span).
- **Network & P2P Stream Filters:** Deploys a *Custom Network* filter to open parallel download connections for progressive links[span_59](start_span)[span_59](end_span). Includes a toggle to clear *P2P Streaming* chains for torrent configurations and options to *Hide torrent stats* overlays during playback screens[span_60](start_span)[span_60](end_span).

## 6. Customization & Management
- **Profiles:** Manage multiple users, watch histories, and recommendations separately. [View Profiles Guide](profiles.md)[span_61](start_span)[span_61](end_span)
- **Collections:** Create deep custom collections grouping media by genre, studio, or custom lists. [View Collections Guide](collections.md)[span_62](start_span)[span_62](end_span)
- **Backup & Synchronization:** Exports or imports compiled application configurations to instantly mirror visual formats, tracking scripts, and engine limits across backup hardware keys[span_63](start_span)[span_63](end_span).
- 
