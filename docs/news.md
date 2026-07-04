## New Releases - 2026-07-04

### Nuvio TV (0.7.15-beta)

### Improvements & Fixes

- We've made it easier to detect what type of content you're trying to watch (like music playlists) by adding support for more file types. This means you get a smoother experience overall.
- We've fixed some behind-the-scenes issues that could cause problems when responding to your requests. Don't worry, these changes are all under the hood.
- Now, when something crashes (we hope it doesn't!), we're sending more information to our crash-reporting team so they can figure out what went wrong. This helps us make the app more stable over time.
- We've added a confirmation dialog when you try to log out, so you won't accidentally close the app.
- Our player now knows when to give up trying to connect to a stream that's not working. This prevents endless loops where the player keeps trying to load the stream and failing.
- We've reverted a change that caused some issues with loading streams in the background. This should make the app feel more responsive.
- You can now choose how long to auto-play videos on Nuvio TV. This is a great way to customize your viewing experience.

### Localization

- We've updated the translations for Portuguese (Brazil) to make the app more intuitive for users who speak this language.

### Nuvio Mobile (0.2.18)

- We've added the option to auto-play videos up to 24 hours after they start playing. This is convenient if you like to watch long videos but might step away for a bit.
- We've started collecting data with Sentry to help us understand how the app is performing on your device. This means we can make improvements to make the app more stable and efficient over time.

### Nuvio Desktop (0.1.10-alpha)

- We've fixed a glitch that made the stream panel blur when you're tuning in. It should look crisp and clean now.
- The dominant color of your stream's background is now more prominent, making it easier to differentiate streams on the app's home screen.
- We've fixed a metadata issue that caused background flickering. This should be smoother now.
- We've adjusted the profile sidebar to prevent overlap when you have multiple profiles set up.
- We've upgraded our compose tool to the latest beta version. This improves our ability to create and render content for you.

### Nuvio Web (0.3.7-beta)

#### Improvements & Fixes

- We've fixed an issue where the screensaver was turning on during active playback on some webOS devices. Now, you can watch without interruptions.
- We've enhanced the webOS screensaver blocking mechanism to make it work better with periodic refreshes, centralized playback-state handling, and broader compatibility with webOS runtimes.
- We've aligned the Web TV subtitle delay behavior with Android TV, allowing for a more seamless experience across devices.
- Subtitle delays are now persisted, so each playback session starts from scratch, and you can reset the delay when switching to a different subtitle track.
- We've fixed an issue with Samsung Tizen Back button handling during video playback, ensuring you can navigate back to the previous player context without issues.
- We've improved the Tizen player focus handling, allowing the Back button to work when playback controls are hidden, without requiring additional presses.
- We've fixed an issue with embedded subtitle selection on older webOS engines, providing a more stable experience.
- We've improved subtitle overlay compatibility on webOS 6.5 and older runtimes, preventing crashes when selecting embedded subtitles.
- We've enhanced the scrolling and focus behavior of the subtitle selector on older Samsung Tizen devices, ensuring a smooth experience.
- We've adjusted the player modal layout and legacy Tizen safe-area spacing to reduce UI, poster, and subtitle menu clipping on older TV browsers.
- We've improved Samsung Tizen installer compatibility for TVs where the generic SDB shell setup commands fail with “closed”. For affected devices, we've implemented a safer install fallback that continues with direct package push and vd_appinstall when shell preparation commands are rejected.
- We've added documentation on the manual Samsung Tizen install workaround using direct SDB push and vd_appinstall for affected devices.
- We've bumped Web TV app metadata to version 0.3.6 and regenerated the Samsung Tizen package as NuvioTV001_0.3.6.wgt.