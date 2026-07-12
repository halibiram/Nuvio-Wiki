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
---
## New Releases - 2026-07-10

### Nuvio TV (0.7.16-beta)

**What's New for Nuvio TV:**

- We've made some great improvements to Trakt, the service you love, to make your experience even better. We've fixed issues where markers didn't appear on Home and some watched series weren't syncing correctly.
- You'll now see watch movies on Trakt, too, so you can keep track of all your favorite flicks. And guess what? We've got pagination, so you won't see them all at once – it's like browsing through your favorite movie catalog!
- Your Trakt credentials will now sync across all your devices, so you won't have to log in every time you switch between your TV and phone.
- If you've got a slow internet connection, don't worry! Your Nuvio TV will automatically refresh the info when it detects a stable connection, ensuring you always have the latest info.
- And, as a bonus, we've improved the loading indicator so it doesn't reset when you start a new media. It's the little things that count, right?
- We've also fixed some pesky bugs that made your posters appear with weird sizes. It's now a nice, clean image – no more squished or stretched posters!
- Dolby Vision lovers, rejoice! We've ensured that only Dolby Vision tracks override the video MIME type, so you get the best audio-visual experience possible.
- Your visual experience just got a little better, with a resized stream chip loading badge for better visual consistency.
- Last but not least, we've made it easier for our developers to fix issues by enabling Sentry tombstone reporting for improved diagnostics.

### Localization

**Language and Translation Updates:**

- We're thrilled to announce the addition of formal French translations, making your experience even more enjoyable in French. We backfilled missing translations so you can now enjoy Nuvio TV with more precise language.
- Get ready for a richer experience in Hebrew! We've added new translations for a more immersive experience.
- For our Latin American Spanish friends, we've got some new updates: fresh strings to make your experience even smoother.
- We've added missing Greek translations, and when we don't have a translation, we'll now show English placeholders – it's all about making things clear and easy to understand.
- Italian speakers, rejoice! We've got new translations to bring you closer to the action, with the added benefit of clearer placeholders for what we're still working on.

### Nuvio Mobile (0.2.21)

**Mobile Improvements:**

- We've improved iOS player rotation to give you a seamless, distraction-free experience when rotating your device.
- To reduce lag and improve overall performance, we've increased the build memory and implemented a device fallback feature.
- To ensure stability, we've updated our MPVKit to support the latest libmpv release and fixed an issue with AudioUnits.
- To keep your watching experience seamless, we've fixed issues related to the Trakt continue watching sync.
- We've fixed the stream continue watching metadata enrichment, so you get the right information at the right time.
- We've also fixed issues related to preserving home catalog sync keys, ensuring your watchlist is accurate.

### Nuvio Desktop (0.1.11-alpha)

**Your Desktop Just Got a Boost:**

- We've fine-tuned the buffer cache to optimize your media buffering experience.
- To improve desktop stability, we've fixed desktop compile issues and ensured that the actuals are accurate.
- A fix to prevent the desktop loading spinner crashes will give you a smoother experience.
- We've added desktop scrollbars, making it easier to navigate through your watchlist and collections.
- We've fixed issues related to the entity browse plural crash, ensuring that you can browse through your media without issues.
- With this update, you can now wire deeplinks into the desktop app, making it easier to access your favorite content directly.
- We've also fixed an issue where Windows would go to sleep during playback, and we've made sure desktop addon and playback networking are in sync.
- Last but not least, we've fixed an issue where your window's fullscreen state, position, and size wouldn't restore properly on relaunch. 

### Nuvio Web (0.3.8-beta)

**New Features and Improvements:**

- For Samsung Tizen users, we've now got a safer fallback to alternate playback engines when AVPlay fails with network-related startup errors, reducing playback startup failures.
- We've improved Tizen playback reliability for sources that may fail on the first selected engine, making sure you can watch your favorite media without issues.
- To enhance the navigation, we've fixed the P2P consent dialog on TV devices, allowing proper left/right focus movement between Cancel and Enable P2P.
- We've updated the P2P enable flow so the focus starts on Enable P2P, reducing the risk of accidentally confirming Cancel instead of enabling the option.
- For webOS users, we've fixed playback settings persistence issues related to profile sync responses by handling no-content Supabase responses correctly.
- We've fixed Supabase sync failures caused by 204, 205, and 304 responses, and improved the sync by routing proxy requests through the Luna service instead of calling the local media server directly.
- To address webOS sync errors where profile, settings, collections, plugins, addons, library, and watched items could fail, we've made some adjustments to make sure your watchlist and other settings are always up-to-date.
- In this update, we've preserved local custom addon names on Web TV when remote sync data doesn't explicitly include an override, giving you more control over your experience.
- We've also updated the addon name override sync on Web TV to safely support legacy addon sync, making sure you don't lose your favorite plugins.
- To make your experience even better, we've added support for Original Language as a preferred audio language option on Web TV, giving you more control over your media playback.
- We've updated the preferred audio language behavior to be more consistent with Android TV, using TMDB original-language metadata when Original Language is selected.
- To bring you even more info, we've improved the player route metadata to include the original content language from detail pages into playback when available.
- Lastly, we've aligned Web TV profile settings sync with Android TV for the Original Language audio preference, bringing you more consistency across your favorite streaming devices.