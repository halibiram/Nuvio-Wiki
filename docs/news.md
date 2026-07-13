## New Releases - 2026-07-13

### Nuvio TV (0.7.16-beta)

- **Trakt Time**: We've fixed some pesky Trakt problems. Our system now ignores out-of-date play history and makes sure watched series markers appear on the Home screen. We've also updated the way we fetch watched movies, so everything should load faster and more smoothly. 
- **Credentials Sorted**: Now, your Trakt login is synced across all Nuvio devices, so you only need to log in once.
- **Updates Galore**: We've added some sweet features like periodic refresh support, which updates your content in the background. We've also fixed the loading screen startup issue and made the stream chip loading badge look better on your TV.
- **Tech Talk**: Behind the scenes, we've enabled Sentry tombstone reporting for faster diagnostic help.

### Localization

- **Bonjour France!** We've added a bunch of missing French translations to Nuvio TV, so everything should be more readable and friendly for our French friends.
- **Shalom Hebrew!** We've added new Hebrew translations and updated some of the existing ones to make Nuvio TV more accessible and fun for Hebrew speakers.
- **Hola Amigos!**: We've updated the Latin American Spanish localization strings and added more Italian translations to make Nuvio TV a global player.

### Nuvio Mobile (0.2.23)

- **New Card Style**: We've added customizable card depth effects on Nuvio Mobile, so you can choose your favorite style and make it pop on your mobile screen.
- **Settings Saved**: We've fixed a critical bug that could reset your synced profile settings. Your settings should now stay saved and be ready for next time.

### Nuvio Desktop (0.1.12-alpha)

- **Fixes Galore**: We've fixed a bunch of issues on Nuvio Desktop, including restoring unaired episodes and preventing settings sync reset.
- **Card Customization**: You can now customize your card depth on Nuvio Desktop, so it looks exactly how you like it.
- **Runtimes and Sync**: We've improved the way player runtimes work on Nuvio Desktop and added foreground sync, so you can enjoy your favorite shows and movies without interruptions.
- **Debrid Resolution**: We've prioritized debrid resolution in player sources, so you should get the best possible video quality.
- **Playback Pro**: We've fixed the playback proxy issue and made sure everything runs smoothly.

### Nuvio Web (0.3.12-beta)

- **Navigation Navigated**: On Samsung Tizen, we've fixed duplicate Back events that could cause the sidebar to open unexpectedly.
- **Playback Smooth**: We've improved adaptive stream playback on Samsung Tizen, so you get the best possible video quality without buffering.
- **Trailer Tamed**: We've reduced recurring trailer stutters on Samsung Tizen by optimizing the way we load and display trailers.
- **Subtitles Sorted**: We've fixed a problem that made built-in subtitle tracks appear as "Unknown". Now, they should display correctly.
- **Language Labels**: We've improved subtitle language detection for regional variants and updated the subtitle selection menu to look more like Android TV.
- **Hidden Languages**: We've added an option to show only preferred languages, so unrelated subtitle languages are hidden from view.
- **Profile Performance**: We've improved profile startup performance by reusing loaded data and reducing duplicate synchronization passes.
- **Startup Watchdog**: We've improved the startup watchdog by renewing its timeout during boot progress, preventing slow initialization stages from being reported as frozen.
- **Playback Stability**: We've improved webOS playback startup stability by delaying subtitle decoder initialization until the first playback frame.
- **Collection Caching**: We've preloaded focused artwork ahead of the visual update, so backdrops and Hero images load faster.
---
## New Releases - 2026-07-12

**Nuvio TV (0.7.16-beta)**

### Improvements & Fixes
We've got a major update for Nuvio TV to make it a better viewing experience:

- Fixed a pesky bug that was causing watched series markers to disappear on your Home screen. We've also updated Trakt's reliability so that you can trust your watched list.
- Now, you can fetch watched movies with pagination to match recent Trakt API changes, making it easier to browse through your favorite movies.
- Syncing Trakt credentials is now easier and more convenient across all your devices.
- Periodic refreshes keep your Nuvio TV experience fresh and up-to-date.
- We've also fixed some loading indicator and poster prefetch issues, so you can get back to binge-watching your favorite shows.
- Dolby Vision tracks now have their own special MIME type override, so you can enjoy the best picture quality.
- And, we've made some visual tweaks to improve the stream chip loading badge size for a more polished look.

### Localization
Get ready for a world of languages in Nuvio TV!

- We've added and updated French, Hebrew, Italian, and Latin American Spanish translations to make your Nuvio TV experience more enjoyable in your native language.
- Missing Greek strings have been added, with English placeholders for translations that haven't been done yet.
- Now, you can switch between languages with ease, and we'll keep improving our localization to make Nuvio TV a truly global service.

**Nuvio Mobile (0.2.22)**

### Improvements & Fixes
Get the latest update for Nuvio Mobile and enjoy a better mobile experience:

- Introducing Content Warnings, just like on TV! You can now control what you want to see and when.
- We've added support for Vietnamese, making Nuvio Mobile a more inclusive experience.
- Display section spacing in Stream Settings has been fixed to look cleaner and more organized.
- Romanian, Dutch, and Italian translations have been added to make your experience more enjoyable in your native language.
- Sync watch progress source has been fixed, so you won't lose your place while watching your favorite shows.
- And, we've improved navigation and stability on iOS to make Nuvio Mobile a seamless experience.
- Content warnings, new languages, and improved stability mean you can enjoy Nuvio Mobile like never before!

**Nuvio Desktop (0.1.11-alpha)**

### Improvements & Fixes
A new update for Nuvio Desktop brings some great improvements:

- Buffer cache has been adjusted to reduce lag and improve playback.
- We've fixed some desktop compile issues to make sure you can get the latest version of Nuvio Desktop.
- Loading spinner crashes have been fixed, so you can get back to watching your favorite shows without interruption.
- Desktop scrollbars have been improved to make navigation smoother and more enjoyable.
- And, we've fixed some entity browse plural and deep linking issues to ensure that Nuvio Desktop runs smoothly on Windows.
- Your Nuvio Desktop experience just got a whole lot better!

**Nuvio Web (0.3.10-beta)**

### Improvements & Fixes
Get the latest update for Nuvio Web, with improved performance and stability:

- We've added a startup diagnostics screen for early boot failures on webOS and Tizen, making it easier to identify initialization errors.
- Localized "Error Details" text has been added for all supported languages, eliminating missing translation warnings across the app.
- Duplicate subtitles on Samsung Tizen have been fixed, so you no longer see two sets of subtitles at once.
- Live TV details pages now fully initialize when channels are opened from catalogs, and the Play button responds as expected on Samsung Tizen.
- Live TV metadata resolution has been improved, ensuring the correct addon and content type are used when loading details and streams.
- Initial profile settings synchronization has been fixed, so your settings are saved on first use.
- Missing playback setting translations for Next Episode Threshold options have been added, removing related localization warnings.
- The in-app diagnostics console on older webOS and Tizen versions has been improved, with reliable scrolling, page navigation, and legacy input events.
- Hero artwork positioning and gradient rendering on older TV browsers have been fixed to prevent logos from being clipped or gradient issues.
- Stream selection panels now render with transparent backgrounds on older TV browsers, restoring the intended appearance.
---
## New Releases - 2026-07-11

### Nuvio TV (0.7.16-beta)

**What's New**

Watchlist woes are now a thing of the past! We've fixed a pesky issue where watched series markers weren't showing up on the main Home page, and made Trakt more reliable by ignoring old watched playback data. You'll also appreciate the new pagination feature for fetching watched movies, Trakt credential syncing across devices, and periodic refresh support.

**Other Fixes and Tweaks**

We've made some behind-the-scenes changes to improve the overall experience:

- The loading indicator now resets properly when you start playback.
- We've squashed a bug that caused zero-size poster requests.
- You can now override Dolby Vision MIME types with ease.
- Our stream chip loading badge is now a consistent size, making it easier to use. 
- And, to make troubleshooting easier, we're now sending diagnostic data when you report issues.

### Localization

**New Translations and Updates**

Language lovers rejoice! We've added:

- New French translations, using formal wording where needed.
- Hebrew translations, with many new and updated strings.
- Latin American Spanish localization strings, so you can find your favorite shows.
- Greek strings, with English placeholders for missing translations.
- Italian translations, so you can enjoy your favorite shows with friends.

### Nuvio Mobile (0.2.21)

**Mobile Fixes and Improvements**

We've been working hard to resolve some issues on your mobile devices:

- Fixed video playback rotation issues on iOS devices.
- Improved memory allocation for better performance.
- We're directing the MPVKit to the latest libmpv binary.
- Our AudioUnit crash guard is now more robust.
- Your Trakt credentials will now sync properly during playback.
- Fixed an issue with stream continue watching metadata enrichment.
- And, to top it off, we've made sure your Home catalog sync keys are preserved.

### Nuvio Desktop (0.1.11-alpha)

**Desktop Fixes and Performance Enhancements**

We've been working hard to improve your desktop experience:

- We've tweaked the buffer cache for better performance.
- Fixed a compiling issue that was causing problems.
- Our loading spinner now works as expected.
- And, to make things easier to navigate, we've added scrollbars to the app.
- Fixed a crash that was happening when browsing entities.
- Wired up deeplinks to work within the desktop app.
- And, to keep you up all night, we've fixed a display sleep issue on Windows.
- Finally, we've aligned your addon and playback networking on desktop.

### Nuvio Web (0.3.9-beta)

**Web Updates and Fixes**

We've been working on some significant updates for our web experience:

- We've aligned our autoplay and source selection with Android TV, so you can find your next episode with ease.
- Fixed an issue where completed episodes would start near the end of playback.
- We've improved embedded subtitle handling on webOS and Tizen devices.
- Fixed subtitle sizing on older Samsung Tizen TVs.
- Improved playback reliability on webOS, so your screensaver can't interrupt you.
- Fixed automatic audio-language selection when metadata was incorrect.
- We've fixed Skip Intro so it stays hidden when you're done with it.
- Restored stream badge preloading and caching for faster loading times.
- Aligned quality sorting with Android TV by ordering streams by resolution, quality, and file size.
- Fixed Trakt credential sync errors and improved synchronization with Nuvio Sync.
- And, to top it off, we've improved Continue Watching synchronization when restoring or selecting profiles.