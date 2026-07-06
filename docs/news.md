## New Releases - 2026-07-06

**Nuvio TV (0.7.16-beta)**

* We've improved Trakt reliability by ignoring watched movies that are no longer available and making sure that series markers show up on the Home screen. You can now also fetch watched movies more efficiently and have the option to auto-refresh your content.
* Your Trakt login credentials will now sync across all Nuvio clients, so you only need to log in once.
* We've fixed a few visual issues, including the loading indicator, and made sure that posters load properly even if they're not available.

**Localization**

* We've added and updated translations to make Nuvio TV available in even more languages, including French, Hebrew, Latin American Spanish, Greek, and Italian.
* Our translations are now more accurate and consistent, so you can navigate and enjoy Nuvio TV in your native language.

**Nuvio Mobile (0.2.19)**

* We've added support for Hungarian and Italian languages, and updated Hungarian translations to ensure accuracy and consistency.
* Nuvio Mobile now works seamlessly on both iOS and Android, and you can enjoy Now Playing features, including skipping precision and playback settings for a perfect viewing experience.
* We've also fixed some issues, including ignored episodes, backup settings, and stream playback, so you can focus on watching your favorite shows and movies.

**Nuvio Desktop (0.1.10-alpha)**

* We've fixed some visual issues, including the blur panel and dominant color background, to make Nuvio Desktop more stable and visually appealing.
* Your profiles will no longer overlap in the sidebar, and we've updated Compose Multiplatform beta for better performance.

**Nuvio Web (0.3.8-beta)**

* We've fixed playback issues on Samsung Tizen devices by providing a safer fallback to the alternate playback engine, and improved playback reliability for sources that may fail initially.
* You can now easily navigate the P2P consent dialog on TV devices with proper focus movement between Cancel and Enable P2P, and the focus now starts on Enable P2P for a smoother experience.
* We've fixed playback settings persistence issues related to profile sync responses, and improved Supabase proxy handling for better performance on webOS.
* Additional fixes include syncing profile settings, collections, and watched items, and preserving custom addon names when syncing with the remote server.
---
## New Releases - 2026-07-05

### Nuvio TV (0.7.15-beta)

**New Features & Fixes**

- We've made it easier to detect streams, including playlists, so you can find your favorite shows and movies.
- You won't see an accidental logout anymore; we've added a confirmation dialog to make sure you mean to sign out.
- Our crash-reporting tool just got superpowered with optional diagnostic info, which helps us fix bugs faster.
- If a video won't play, the player will now retry, but only a few times, to prevent endless loop frustrations.
- Some stream loading fixes got reversed, and now you won't see that flickering issue anymore.
- You can now personalize the auto-play settings to suit your viewing habits.

**Localization Update**

- We've got some Portuguese (Brazil) translations updated to make sure Nuvio TV feels more at home in Brazil!

### Nuvio Mobile (0.2.18)

**Mobile Improvements**

- You can now customize your auto-play settings for even longer, with the option to set it to hours instead of minutes.
- Our crash-reporting tool is also here on mobile, giving us valuable info to fix issues.

### Nuvio Desktop (0.1.10-alpha)

**Desktop Updates**

- The stream blur issue is fixed now, and you won't see that fuzzy image anymore.
- We've added a cool feature where the background of our app changes color to match the dominant color of your stream.
- The metadata background is stabilized now, so you can enjoy a more seamless experience.
- If you have multiple profiles, they won't overlap anymore in the sidebar.
- We've also updated our beta app to make it better for all users.

### Nuvio Web (0.3.8-beta)

**Web Improvements & Fixes**

- If you're using Samsung Tizen, you should find that playback works better now, even with weird network issues.
- We've fixed some Tizen playback issues so it's more reliable, especially when switching between different playback engines.
- The P2P consent dialog on TV devices just got a lot more navigable, so you can focus on enabling peer-to-peer sharing instead of canceling by accident.
- When setting up P2P sharing, the focus is now on Enable P2P, reducing accidental cancels.
- Some playback settings got stuck on profile sync responses, but we've fixed that, so your settings persist correctly.
- Some webOS sync issues got fixed, especially with those pesky 204, 205, and 304 responses.
- We've made some changes to webOS sync, so it behaves better and is more reliable.
- You can now choose your preferred audio language, including Original Language, on Web TV.
- The player's original content language is now passed along to playback when available.