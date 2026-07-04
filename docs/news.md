## New Releases - 2026-07-04

### Nuvio TV (0.7.15-beta)
## Improvements & Fixes
- Improved MIME type detection by adding support for `.m3u` and playlist-based streams (@halibiram)
- Fixed nullability issues in response handling within AuthManager and StreamSpeedTester (@tapframe)
- Introduced optional Sentry diagnostics for improved crash and performance monitoring (@tapframe)
- Added sign-out confirmation dialog to prevent accidental logout (@tapframe)
- Fixed player retry logic to prevent endless retry loops on permanent HTTP errors (400–410 range) (@halibiram)
- Reverted stream loading overlay fix that caused debrid/player flicker issues (@halibiram)
- Added additional duration options to Playback Auto-Play settings (@tapframe)

### Localization
- Updated Portuguese (Brazil) translations (@danilopagotto82)

### Nuvio Mobile (0.2.18)

- feat(PlaybackAutoPlaySettings): add additional hours @tapframe
- feat: sentry diagnostics @tapframe

### Nuvio Desktop (0.1.10-alpha)
fix: tune streams blur panel @tapframe
feat: add dominant colour bg @tapframe
fix: stabilize dominant colour metadata background @tapframe
fix: multiple profile causing overlap in sidebar @tapframe
Update Compose Multiplatform beta @tapframe

### Nuvio Web (0.3.7-beta)
Improvements & Fixes

* Fixed webOS screensaver appearing during active playback by improving the keep-awake handling during real playback sessions. (@WhiteGiso)
* Improved webOS screensaver blocking with periodic refresh, centralized playback-state handling, and broader webOS runtime compatibility. (@WhiteGiso)
* Aligned Web TV subtitle delay behavior with Android TV, increasing the subtitle delay range to -60s / +60s with 100ms steps. (@WhiteGiso)
* Fixed subtitle delay persistence so each playback starts from 0 and changing subtitle tracks resets the delay when the selected subtitle actually changes. (@WhiteGiso)
* Fixed Samsung Tizen Back button handling during video playback by avoiding fragile browser history navigation and explicitly returning to the previous player context. (@WhiteGiso)
* Improved Tizen player focus handling so the Back button works even when playback controls are hidden, without needing to press Up or Down first. (@WhiteGiso)
* Fixed embedded subtitle selection on older webOS engines by replacing unsupported overlay-clearing behavior with a compatible fallback. (@WhiteGiso)
* Improved subtitle overlay compatibility on webOS 6.5 and older runtimes to prevent crashes when selecting embedded subtitles. (@WhiteGiso)
* Improved subtitle selector scrolling and focus behavior on older Samsung Tizen devices, preventing focus from moving outside the visible list. (@WhiteGiso)
* Adjusted player modal layout and legacy Tizen safe-area spacing to reduce UI, poster, and subtitle menu clipping on older TV browsers. (@WhiteGiso)
* Improved Samsung Tizen installer compatibility for TVs where generic SDB shell setup commands fail with “closed”. (@WhiteGiso)
* Added a safer Tizen install fallback that continues with direct package push and vd_appinstall when shell preparation commands are rejected. (@WhiteGiso)
* Documented the manual Samsung Tizen install workaround using direct SDB push and vd_appinstall for affected devices. (@WhiteGiso)
* Bumped Web TV app metadata to version 0.3.6 and regenerated the Samsung Tizen package as NuvioTV001_0.3.6.wgt. (@WhiteGiso)

---
## New Releases - 2026-07-04

### Nuvio TV (0.7.15-beta)
## Improvements & Fixes
- Improved MIME type detection by adding support for `.m3u` and playlist-based streams (@halibiram)
- Fixed nullability issues in response handling within AuthManager and StreamSpeedTester (@tapframe)
- Introduced optional Sentry diagnostics for improved crash and performance monitoring (@tapframe)
- Added sign-out confirmation dialog to prevent accidental logout (@tapframe)
- Fixed player retry logic to prevent endless retry loops on permanent HTTP errors (400–410 range) (@halibiram)
- Reverted stream loading overlay fix that caused debrid/player flicker issues (@halibiram)
- Added additional duration options to Playback Auto-Play settings (@tapframe)

### Localization
- Updated Portuguese (Brazil) translations (@danilopagotto82)

### Nuvio Mobile (0.2.18)

- feat(PlaybackAutoPlaySettings): add additional hours @tapframe
- feat: sentry diagnostics @tapframe

### Nuvio Desktop (0.1.10-alpha)
fix: tune streams blur panel @tapframe
feat: add dominant colour bg @tapframe
fix: stabilize dominant colour metadata background @tapframe
fix: multiple profile causing overlap in sidebar @tapframe
Update Compose Multiplatform beta @tapframe

### Nuvio Web (0.3.7-beta)
Improvements & Fixes

* Fixed webOS screensaver appearing during active playback by improving the keep-awake handling during real playback sessions. (@WhiteGiso)
* Improved webOS screensaver blocking with periodic refresh, centralized playback-state handling, and broader webOS runtime compatibility. (@WhiteGiso)
* Aligned Web TV subtitle delay behavior with Android TV, increasing the subtitle delay range to -60s / +60s with 100ms steps. (@WhiteGiso)
* Fixed subtitle delay persistence so each playback starts from 0 and changing subtitle tracks resets the delay when the selected subtitle actually changes. (@WhiteGiso)
* Fixed Samsung Tizen Back button handling during video playback by avoiding fragile browser history navigation and explicitly returning to the previous player context. (@WhiteGiso)
* Improved Tizen player focus handling so the Back button works even when playback controls are hidden, without needing to press Up or Down first. (@WhiteGiso)
* Fixed embedded subtitle selection on older webOS engines by replacing unsupported overlay-clearing behavior with a compatible fallback. (@WhiteGiso)
* Improved subtitle overlay compatibility on webOS 6.5 and older runtimes to prevent crashes when selecting embedded subtitles. (@WhiteGiso)
* Improved subtitle selector scrolling and focus behavior on older Samsung Tizen devices, preventing focus from moving outside the visible list. (@WhiteGiso)
* Adjusted player modal layout and legacy Tizen safe-area spacing to reduce UI, poster, and subtitle menu clipping on older TV browsers. (@WhiteGiso)
* Improved Samsung Tizen installer compatibility for TVs where generic SDB shell setup commands fail with “closed”. (@WhiteGiso)
* Added a safer Tizen install fallback that continues with direct package push and vd_appinstall when shell preparation commands are rejected. (@WhiteGiso)
* Documented the manual Samsung Tizen install workaround using direct SDB push and vd_appinstall for affected devices. (@WhiteGiso)
* Bumped Web TV app metadata to version 0.3.6 and regenerated the Samsung Tizen package as NuvioTV001_0.3.6.wgt. (@WhiteGiso)

---
## New Releases - 2026-07-04

### Nuvio TV (0.7.15-beta)
## Improvements & Fixes
- Improved MIME type detection by adding support for `.m3u` and playlist-based streams (@halibiram)
- Fixed nullability issues in response handling within AuthManager and StreamSpeedTester (@tapframe)
- Introduced optional Sentry diagnostics for improved crash and performance monitoring (@tapframe)
- Added sign-out confirmation dialog to prevent accidental logout (@tapframe)
- Fixed player retry logic to prevent endless retry loops on permanent HTTP errors (400–410 range) (@halibiram)
- Reverted stream loading overlay fix that caused debrid/player flicker issues (@halibiram)
- Added additional duration options to Playback Auto-Play settings (@tapframe)

### Localization
- Updated Portuguese (Brazil) translations (@danilopagotto82)

### Nuvio Mobile (0.2.18)

- feat(PlaybackAutoPlaySettings): add additional hours @tapframe
- feat: sentry diagnostics @tapframe

### Nuvio Desktop (0.1.10-alpha)
fix: tune streams blur panel @tapframe
feat: add dominant colour bg @tapframe
fix: stabilize dominant colour metadata background @tapframe
fix: multiple profile causing overlap in sidebar @tapframe
Update Compose Multiplatform beta @tapframe

### Nuvio Web (0.3.7-beta)
Improvements & Fixes

* Fixed webOS screensaver appearing during active playback by improving the keep-awake handling during real playback sessions. (@WhiteGiso)
* Improved webOS screensaver blocking with periodic refresh, centralized playback-state handling, and broader webOS runtime compatibility. (@WhiteGiso)
* Aligned Web TV subtitle delay behavior with Android TV, increasing the subtitle delay range to -60s / +60s with 100ms steps. (@WhiteGiso)
* Fixed subtitle delay persistence so each playback starts from 0 and changing subtitle tracks resets the delay when the selected subtitle actually changes. (@WhiteGiso)
* Fixed Samsung Tizen Back button handling during video playback by avoiding fragile browser history navigation and explicitly returning to the previous player context. (@WhiteGiso)
* Improved Tizen player focus handling so the Back button works even when playback controls are hidden, without needing to press Up or Down first. (@WhiteGiso)
* Fixed embedded subtitle selection on older webOS engines by replacing unsupported overlay-clearing behavior with a compatible fallback. (@WhiteGiso)
* Improved subtitle overlay compatibility on webOS 6.5 and older runtimes to prevent crashes when selecting embedded subtitles. (@WhiteGiso)
* Improved subtitle selector scrolling and focus behavior on older Samsung Tizen devices, preventing focus from moving outside the visible list. (@WhiteGiso)
* Adjusted player modal layout and legacy Tizen safe-area spacing to reduce UI, poster, and subtitle menu clipping on older TV browsers. (@WhiteGiso)
* Improved Samsung Tizen installer compatibility for TVs where generic SDB shell setup commands fail with “closed”. (@WhiteGiso)
* Added a safer Tizen install fallback that continues with direct package push and vd_appinstall when shell preparation commands are rejected. (@WhiteGiso)
* Documented the manual Samsung Tizen install workaround using direct SDB push and vd_appinstall for affected devices. (@WhiteGiso)
* Bumped Web TV app metadata to version 0.3.6 and regenerated the Samsung Tizen package as NuvioTV001_0.3.6.wgt. (@WhiteGiso)
