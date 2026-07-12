export type AreaId = 'install' | 'streams' | 'playback' | 'sync' | 'connection'

export type PlatformId =
  | 'android-tv'
  | 'android-mobile'
  | 'ios'
  | 'tizen'
  | 'webos'
  | 'windows'

export type AnswerValue =
  | 'yes'
  | 'no'
  | 'unsure'
  | 'not-used'
  | 'store'
  | 'faster-off'
  | 'faster-on'
  | 'same'
  | 'not-tried'

export type AnswerOption = {
  value: AnswerValue
  label: string
}

export type Finding = {
  title: string
  summary: string
  fixes: readonly string[]
  href: string
  linkLabel: string
}

export const findings = {
  'common-checks-passed': {
    title: 'No single common cause stood out',
    summary: 'Your answers rule out the usual setup problems for this symptom. The issue may be specific to a stream, service, app version, or device.',
    fixes: [
      'Restart Nuvio and repeat the exact action once, noting the error text and when it appears.',
      'If it persists, note your device, OS, Nuvio version, setup, and the steps you already tried.'
    ],
    href: '/troubleshooting#_9-when-to-seek-further-help',
    linkLabel: 'Prepare a useful support report'
  },
  'wrong-build': {
    title: 'The package may not match your device',
    summary: 'Nuvio uses different installation packages and methods for phones, TV devices, iOS, Tizen, webOS, and Windows.',
    fixes: [
      'Download the latest package made specifically for your device.',
      'On Android, use the TV build for Android TV, Google TV, and Fire TV; use the Mobile build for phones and tablets.'
    ],
    href: '/troubleshooting#_2-1-app-not-installed-error',
    linkLabel: 'Check installation fixes'
  },
  'low-storage': {
    title: 'The device may be short on storage',
    summary: 'Low free space can block installation and make Nuvio slow or unstable.',
    fixes: [
      'Free at least 500 MB of storage and restart the device.',
      'On Android, clear the package installer cache before trying again.'
    ],
    href: '/troubleshooting#_2-1-app-not-installed-error',
    linkLabel: 'Review storage guidance'
  },
  'signature-conflict': {
    title: 'An older install may have a different signature',
    summary: 'Android can reject an update when the installed app and new APK were signed differently.',
    fixes: [
      'Save your addon URLs or export anything you need first.',
      'Uninstall the existing app, reboot, and install the current package from scratch.'
    ],
    href: '/troubleshooting#_2-1-app-not-installed-error',
    linkLabel: 'See clean-install steps'
  },
  'unknown-sources': {
    title: 'Sideloading permission may be blocked',
    summary: 'Android and TV devices need permission to install an app outside their store.',
    fixes: [
      'Enable Install unknown apps for the browser or file manager you are using.',
      'On Fire TV, check Developer Options and allow Nuvio installation.'
    ],
    href: '/troubleshooting#_2-3-app-won-t-update',
    linkLabel: 'Review update fixes'
  },
  'platform-install': {
    title: 'The platform-specific install flow may be incomplete',
    summary: 'Nuvio is installed differently on Android, iOS, Tizen, webOS, and Windows. A package alone is not enough on every platform.',
    fixes: [
      'Follow the complete guide for this device from the beginning.',
      'Download only the current official package for the selected platform.'
    ],
    href: '/installation/',
    linkLabel: 'Open installation guides'
  },
  'ios-signing': {
    title: 'The iOS signing or trust step may have expired',
    summary: 'Sideloaded iOS apps need an active signature, a trusted developer profile, and Developer Mode on supported iOS versions.',
    fixes: [
      'Re-sign and reinstall the current IPA with your sideloading tool.',
      'Trust the developer profile and enable Developer Mode before opening Nuvio.'
    ],
    href: '/installation/ios',
    linkLabel: 'Open the iOS install guide'
  },
  'tizen-setup': {
    title: 'The Tizen developer connection may be incomplete',
    summary: 'Samsung installation depends on Developer Mode, the correct Host PC IP, and a certificate tied to the connected TV.',
    fixes: [
      'Enable Developer Mode, enter the installing PC’s current IP, and reboot the TV.',
      'If a certificate fails, generate it again while the TV is connected so its DUID is included.'
    ],
    href: '/installation/tizen#troubleshooting',
    linkLabel: 'Fix the Tizen connection'
  },
  'webos-setup': {
    title: 'The webOS developer session or connection may be inactive',
    summary: 'LG installation needs Developer Mode, Key Server, an active session, and the TV and installer on the same local network.',
    fixes: [
      'Turn on Developer Mode and Key Server, then extend the developer session.',
      'Confirm the TV and computer share a network and reconnect with the current IP and passphrase.'
    ],
    href: '/installation/webos#troubleshooting',
    linkLabel: 'Fix the webOS setup'
  },
  'windows-install': {
    title: 'Windows may be blocking the installer',
    summary: 'SmartScreen and User Account Control can stop a new or unsigned Nuvio release before setup finishes.',
    fixes: [
      'Use the current official Windows installer.',
      'In SmartScreen choose More info → Run anyway, then approve the UAC prompt.'
    ],
    href: '/installation/windows',
    linkLabel: 'Open the Windows install guide'
  },
  'stale-app-data': {
    title: 'Cached app data may be damaged',
    summary: 'Corrupt or outdated local data is a common cause of launch crashes, sluggish navigation, and stale lists.',
    fixes: [
      'Clear Nuvio\'s cache in your device settings and restart the app.',
      'If that fails, save important setup details before clearing data or reinstalling.'
    ],
    href: '/troubleshooting#_2-2-app-crashes-on-launch',
    linkLabel: 'See crash recovery steps'
  },
  'os-compatibility': {
    title: 'The app and operating system may not be compatible',
    summary: 'A newer Nuvio release can require an OS version or device capability that older hardware does not provide.',
    fixes: [
      'Compare your OS version with the current release notes.',
      'Install the newest Nuvio build supported by your device.'
    ],
    href: '/troubleshooting#_2-2-app-crashes-on-launch',
    linkLabel: 'Check launch troubleshooting'
  },
  'device-clock': {
    title: 'The device clock may be breaking sign-in',
    summary: 'Authentication tokens can fail when the device date or time is significantly wrong.',
    fixes: [
      'Turn on automatic date, time, and time zone in device settings.',
      'Restart Nuvio and sign in again.'
    ],
    href: '/troubleshooting#_2-4-login-account-issues',
    linkLabel: 'See account fixes'
  },
  'account-session': {
    title: 'Your account session may need to be refreshed',
    summary: 'Updates and expired sessions can leave Nuvio signed out or unable to validate an account.',
    fixes: [
      'Sign out, restart Nuvio, and enter your credentials again.',
      'Use the official password reset flow if the credentials are not accepted.'
    ],
    href: '/troubleshooting#_2-4-login-account-issues',
    linkLabel: 'Review login guidance'
  },
  'addon-disabled': {
    title: 'No streaming addon is active',
    summary: 'Nuvio cannot return streams unless at least one compatible streaming addon is installed and enabled.',
    fixes: [
      'Open Settings → Addons and enable a streaming addon.',
      'If the list is empty, install an addon using its manifest URL.'
    ],
    href: '/troubleshooting#_1-3-no-streams-found',
    linkLabel: 'See no-stream fixes'
  },
  'addon-config': {
    title: 'The addon configuration may be stale',
    summary: 'The wrong stream mode, changed provider details, filters, or an outdated manifest can leave an installed addon with no usable results.',
    fixes: [
      'Review the addon configuration for the Debrid mode you use.',
      'For Nuvio-native Debrid use a keyless P2P scraper; for addon-managed Debrid refresh the credentials inside the addon.',
      'Re-add the new manifest URL, and never share that private URL publicly.'
    ],
    href: '/troubleshooting#_1-3-no-streams-found',
    linkLabel: 'Review addon checks'
  },
  'content-availability': {
    title: 'The title may not be indexed or cached yet',
    summary: 'A newly released or uncommon title can have no usable sources even when the setup is healthy.',
    fixes: [
      'Try another enabled addon or another title to compare.',
      'For a new release, wait 24–72 hours and try again.'
    ],
    href: '/troubleshooting#_1-3-no-streams-found',
    linkLabel: 'Read about source availability'
  },
  'manifest-address': {
    title: 'The manifest address is invalid',
    summary: 'A missing HTTPS prefix, typo, or invisible trailing space prevents Nuvio from loading a manifest.',
    fixes: [
      'Copy the address again, remove whitespace, and confirm it starts with https://.',
      'Open it in a browser; a working manifest should return JSON.'
    ],
    href: '/troubleshooting#_4-1-manifest-url-error',
    linkLabel: 'Check manifest errors'
  },
  'addon-server': {
    title: 'The addon server may be unavailable',
    summary: 'A timeout or error when opening the manifest usually points to the addon host or a network restriction.',
    fixes: [
      'Try the manifest in a browser and retry later if its server is down.',
      'Test with and without a VPN if the server may be region-restricted.'
    ],
    href: '/troubleshooting#_4-1-manifest-url-error',
    linkLabel: 'See server checks'
  },
  'addon-host-load': {
    title: 'The addon host may be slow or overloaded',
    summary: 'Remote community addon servers can respond slowly during busy periods even when Nuvio and your connection are healthy.',
    fixes: [
      'Compare another enabled addon or retry outside peak hours.',
      'For a self-hosted addon, inspect server resource use and logs.'
    ],
    href: '/troubleshooting#_4-3-addon-loads-slowly',
    linkLabel: 'Review slow addon responses'
  },
  'lost-addon-config': {
    title: 'The update may have reset your addons',
    summary: 'Addon configurations can disappear after an app update or data reset.',
    fixes: [
      'Re-add your saved manifest links under Settings → Addons.',
      'Check the official Nuvio channels if a community addon address has changed.'
    ],
    href: '/troubleshooting#_4-2-addons-disappeared-after-update',
    linkLabel: 'Restore missing addons'
  },
  'debrid-session': {
    title: 'The addon-managed Debrid credentials may be stale',
    summary: 'When an addon resolves Debrid links itself, an expired subscription or rotated API key can remove usable results.',
    fixes: [
      'Verify the subscription and API key on the provider website.',
      'Regenerate the addon manifest with the current credentials, then replace the old manifest in Nuvio.'
    ],
    href: '/troubleshooting#_5-1-debrid-not-connecting-debrid-integration-only',
    linkLabel: 'Check addon-managed Debrid'
  },
  'native-debrid-connection': {
    title: 'Nuvio’s native Debrid resolver may not be ready',
    summary: 'Native TorBox or Premiumize needs a connected account with Resolve playable links turned on.',
    fixes: [
      'Open Settings → Integrations → Connected Services and reconnect the provider.',
      'Confirm Resolve playable links is On.'
    ],
    href: '/integrations/debrid#step-2-linking-an-account-initial-toggles',
    linkLabel: 'Check native Debrid toggles'
  },
  'native-debrid-readiness': {
    title: 'The native Debrid setup may be incomplete',
    summary: 'Nuvio-native TorBox or Premiumize needs an active subscription, a connected account, Resolve playable links, and a keyless P2P scraper.',
    fixes: [
      'Confirm the provider is active and connected under Settings → Integrations → Connected Services.',
      'Turn Resolve playable links On and configure a P2P-capable scraper without a Debrid API key.'
    ],
    href: '/integrations/debrid',
    linkLabel: 'Check the complete native setup'
  },
  'native-debrid-p2p': {
    title: 'The native resolver may not be receiving P2P hashes',
    summary: 'Nuvio can resolve links only when a P2P-capable scraper returns raw hashes instead of resolving Debrid inside the addon.',
    fixes: [
      'Configure a P2P-capable scraper without any Debrid API key.',
      'Enable P2P output and exclude already-resolved Debrid stream types.'
    ],
    href: '/integrations/debrid#step-3-configuring-aiostreams-p2p-addons',
    linkLabel: 'Configure a keyless P2P scraper'
  },
  'debrid-subscription': {
    title: 'The Debrid subscription may be inactive',
    summary: 'Expired or not-yet-recognized service time prevents Debrid-backed streams from resolving.',
    fixes: [
      'Check the subscription directly on the provider website.',
      'After renewing, reconnect it in Nuvio if using the native resolver, or regenerate the private addon manifest if the addon manages Debrid.'
    ],
    href: '/troubleshooting#_5-2-subscription-expired-or-unrecognized',
    linkLabel: 'Review subscription fixes'
  },
  'vpn-filter': {
    title: 'A VPN, DNS filter, or firewall may be interfering',
    summary: 'Filtering tools can block Nuvio, an addon host, or a Debrid provider even while other apps still work.',
    fixes: [
      'Temporarily disable the VPN or filter and retry the same action.',
      'If that works, change server or allowlist the affected service.'
    ],
    href: '/troubleshooting#_6-2-vpn-conflicts',
    linkLabel: 'Check VPN conflicts'
  },
  'network-buffering': {
    title: 'The stream may be outrunning the connection',
    summary: 'High-bitrate video needs stable bandwidth, not only a high advertised internet speed.',
    fixes: [
      'Run a speed test on this device and try a lower-bitrate stream.',
      'Use Ethernet or 5 GHz Wi-Fi where possible; Android TV users can also increase playback buffers.'
    ],
    href: '/troubleshooting#_1-1-video-stutters-or-buffers',
    linkLabel: 'Tune buffering and playback'
  },
  'local-network': {
    title: 'The device or local network is the likely bottleneck',
    summary: 'If websites or other apps also fail, the problem is outside Nuvio.',
    fixes: [
      'Restart the router and device, then test another app.',
      'Switch between Wi-Fi, Ethernet, or mobile data to isolate the connection.'
    ],
    href: '/troubleshooting#_6-1-general-connectivity-problems',
    linkLabel: 'Run connectivity checks'
  },
  'wifi-quality': {
    title: 'Wi-Fi quality may be limiting streams',
    summary: 'Distance, congestion, and a 2.4 GHz connection can make video unstable even when browsing seems normal.',
    fixes: [
      'Move closer to the router or switch to a 5 GHz network.',
      'Use wired Ethernet on TV devices when available.'
    ],
    href: '/troubleshooting#_6-3-slow-stream-speeds',
    linkLabel: 'Improve stream speed'
  },
  'isp-routing': {
    title: 'Your ISP route may be slowing video traffic',
    summary: 'A stream that becomes faster only through a VPN can indicate ISP throttling or a poor route to the source.',
    fixes: [
      'Compare multiple VPN locations before assuming Nuvio is at fault.',
      'Keep the faster stable route or contact the ISP if the slowdown affects video services consistently.'
    ],
    href: '/troubleshooting#_6-3-slow-stream-speeds',
    linkLabel: 'Review slow-stream checks'
  },
  'stream-file': {
    title: 'The selected stream is probably the problem',
    summary: 'One malformed, uncached, or incompatible file can fail while other sources play normally.',
    fixes: [
      'Open the stream picker and choose a different source for the same title.',
      'Compare with another title before changing global settings.'
    ],
    href: '/troubleshooting#_1-playback-issues',
    linkLabel: 'See playback checks'
  },
  'ios-p2p-unsupported': {
    title: 'iOS does not support peer-to-peer (P2P) streaming',
    summary: 'Apple does not allow or support raw torrent/P2P streaming on iOS, and it likely never will.',
    fixes: [
      'Use a Debrid service (TorBox, Real-Debrid, Premiumize) or a plugin to cache and stream the file over HTTPS.',
      'Make sure you configure your scraper addons to resolve streams via Debrid rather than returning raw P2P links.'
    ],
    href: '/troubleshooting#_8-4-ios-ipados',
    linkLabel: 'Check iOS troubleshooting'
  },
  'codec-renderer': {
    title: 'The built-in player may not support this codec',
    summary: 'Black video, silent audio, or playback that works elsewhere usually points to decoder or renderer compatibility.',
    fixes: [
      'Try VLC or MX Player as the external player.',
      'For missing dialogue, enable audio downmix; optical/SPDIF users can try Force AC-3 Transcoding.'
    ],
    href: '/troubleshooting#_1-2-no-audio-or-black-screen',
    linkLabel: 'Fix audio and video output'
  },
  'dolby-vision': {
    title: 'The stream may use an unsupported Dolby Vision profile',
    summary: 'Green, purple, or washed-out video is a strong sign that the device cannot decode the Dolby Vision layer.',
    fixes: [
      'Enable DV7 - HEVC Fallback in the player decoding settings.',
      'On Android TV, DV5 content may also improve with Convert DV5 to DV8.1.'
    ],
    href: '/troubleshooting#_1-2-no-audio-or-black-screen',
    linkLabel: 'Fix distorted colors'
  },
  'subtitle-settings': {
    title: 'Subtitle preferences or startup mode may be hiding tracks',
    summary: 'Fast startup skips the automatic external subtitle fetch, and an unset language can prevent preferred tracks from appearing.',
    fixes: [
      'Confirm subtitles and a preferred language are enabled in player settings.',
      'Use Preferred only or All instead of Fast startup, or select a track manually during playback.'
    ],
    href: '/troubleshooting#_1-5-subtitles-not-working',
    linkLabel: 'Check subtitle settings'
  },
  'subtitle-source': {
    title: 'This stream may not include subtitle tracks',
    summary: 'Some files have no embedded subtitles, and external sources may not have a match.',
    fixes: [
      'Try another stream for the same title.',
      'Allow the automatic subtitle fetch or choose a subtitle manually after playback starts.'
    ],
    href: '/troubleshooting#_1-5-subtitles-not-working',
    linkLabel: 'See subtitle troubleshooting'
  },
  'subtitle-sync': {
    title: 'The subtitle timing does not match this stream',
    summary: 'Subtitle timing can differ between releases, and an audio delay can make every track appear offset.',
    fixes: [
      'Use the subtitle delay or offset control to move the track forward or backward.',
      'Try another stream if the required offset is large, and reset any player audio delay.'
    ],
    href: '/troubleshooting#_1-5-subtitles-not-working',
    linkLabel: 'Fix subtitle timing'
  },
  'subtitle-startup': {
    title: 'Automatic subtitle fetching is delaying playback',
    summary: 'Loading external subtitle sources before playback can cause a slow or stuttering start.',
    fixes: [
      'Set Addon Subtitle Startup to Fast startup so playback begins without the automatic fetch.',
      'Choose subtitles manually after playback starts, or use Preferred only as a middle option.'
    ],
    href: '/troubleshooting#_1-5-subtitles-not-working',
    linkLabel: 'Tune subtitle startup'
  },
  'audio-language': {
    title: 'The preferred audio language is not configured',
    summary: 'Nuvio may select the first available track when no primary and fallback language are set.',
    fixes: [
      'Choose the correct Audio Track from the playback menu.',
      'Set Preferred Audio Language and a secondary fallback in player settings.'
    ],
    href: '/troubleshooting#_1-6-wrong-audio-track-playing',
    linkLabel: 'Set the audio language'
  },
  'quality-filter': {
    title: 'The addon may be filtering out higher quality',
    summary: 'A configured quality cap can leave only 480p or 720p results even when better sources exist.',
    fixes: [
      'Reconfigure the addon to allow 1080p or 4K results.',
      'Check the stream picker for a higher-quality cached source.'
    ],
    href: '/troubleshooting#_1-4-poor-video-quality',
    linkLabel: 'Improve video quality'
  },
  'trakt-auth': {
    title: 'The Trakt authorization may have expired',
    summary: 'A stale access token is the most common reason history, progress, or lists stop syncing.',
    fixes: [
      'Open Settings → Trakt, log out, and complete authorization again.',
      'Restart Nuvio after reconnecting and test with one item.'
    ],
    href: '/troubleshooting#_3-1-trakt-sync-not-working',
    linkLabel: 'Reconnect Trakt'
  },
  'trakt-outage': {
    title: 'Trakt may be temporarily unavailable',
    summary: 'An upstream outage can stop sync even when your Nuvio setup is correct.',
    fixes: [
      'Check Trakt\'s service status or community reports.',
      'Wait for the service to recover before repeatedly changing your setup.'
    ],
    href: '/troubleshooting#_3-1-trakt-sync-not-working',
    linkLabel: 'Review Trakt troubleshooting'
  },
  'progress-threshold': {
    title: 'Playback may not have reached the scrobble threshold',
    summary: 'Playing only a few seconds may not be enough for Nuvio to save progress.',
    fixes: [
      'Play long enough to create meaningful progress, then stop normally.',
      'Refresh the item and check whether the new position appears.'
    ],
    href: '/troubleshooting#_3-2-watch-progress-not-saving',
    linkLabel: 'Check progress saving'
  },
  'external-scrobble': {
    title: 'The external player may not report progress',
    summary: 'Some external players do not return enough playback information for automatic scrobbling.',
    fixes: [
      'Play the same item in Nuvio\'s internal player.',
      'Use the internal player when automatic Trakt progress is important.'
    ],
    href: '/troubleshooting#_3-2-watch-progress-not-saving',
    linkLabel: 'See progress limitations'
  },
  'account-mismatch': {
    title: 'The devices may use different Trakt accounts',
    summary: 'Lists and watch history cannot match if each Nuvio installation is connected to a different account.',
    fixes: [
      'Verify the Trakt username on every device or profile.',
      'Reconnect both devices to the same Trakt account.'
    ],
    href: '/troubleshooting#_3-3-library-or-watchlist-not-updating',
    linkLabel: 'Fix list synchronization'
  },
  'device-resources': {
    title: 'The device may be under memory or storage pressure',
    summary: 'Low storage and many background apps can make navigation and playback feel sluggish.',
    fixes: [
      'Close background apps, clear Nuvio\'s cache, and free storage.',
      'Prefer device decoders when available to reduce CPU use.'
    ],
    href: '/troubleshooting#_7-1-app-running-slowly-or-feeling-sluggish',
    linkLabel: 'Improve app performance'
  }
} as const satisfies Record<string, Finding>

export type FindingId = keyof typeof findings

export type DoctorCheck = {
  id: string
  question: string
  hint: string
  options: readonly AnswerOption[]
  findingByAnswer: Partial<Record<AnswerValue, FindingId>>
}

export type SubSymptom = {
  id: string
  label: string
  description: string
  checks: readonly DoctorCheck[]
}

export type Symptom = {
  id: string
  label: string
  description: string
  checks?: readonly DoctorCheck[]
  subSymptoms?: readonly SubSymptom[]
}

export const areas = [
  { id: 'install', label: 'Install or open Nuvio', description: 'Install errors, updates, crashes, or login' },
  { id: 'streams', label: 'Streams, addons, or Debrid', description: 'No results, manifest errors, or provider issues' },
  { id: 'playback', label: 'Playback', description: 'Buffering, picture, audio, subtitles, or quality' },
  { id: 'sync', label: 'Trakt or sync', description: 'History, progress, library, or watchlist' },
  { id: 'connection', label: 'Speed or connectivity', description: 'Nothing loads, slow streams, or a sluggish app' }
] as const satisfies readonly { id: AreaId; label: string; description: string }[]

export const platforms = [
  { id: 'android-tv', label: 'TV device', description: 'Android TV, Google TV, or Fire TV', installHref: '/installation/android-tv' },
  { id: 'android-mobile', label: 'Android mobile', description: 'Phone or tablet', installHref: '/installation/android-mobile' },
  { id: 'ios', label: 'iPhone or iPad', description: 'iOS or iPadOS', installHref: '/installation/ios' },
  { id: 'tizen', label: 'Samsung TV', description: 'Tizen or TizenBrew', installHref: '/installation/tizen' },
  { id: 'webos', label: 'LG TV', description: 'webOS', installHref: '/installation/webos' },
  { id: 'windows', label: 'Windows', description: 'Desktop or laptop', installHref: '/installation/windows' }
] as const satisfies readonly { id: PlatformId; label: string; description: string; installHref: string }[]

const yesNoUnsure = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unsure', label: 'Not sure' }
] as const satisfies readonly AnswerOption[]

const yesNoStoreUnsure = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'store', label: 'Store install' },
  { value: 'unsure', label: 'Not sure' }
] as const satisfies readonly AnswerOption[]

const iosInstallMethodOptions = [
  { value: 'yes', label: 'Sideloaded' },
  { value: 'store', label: 'Store install' },
  { value: 'unsure', label: 'Not sure' }
] as const satisfies readonly AnswerOption[]

const check = (
  id: string,
  question: string,
  hint: string,
  findingByAnswer: Partial<Record<AnswerValue, FindingId>>,
  options: readonly AnswerOption[] = yesNoUnsure
): DoctorCheck => ({ id, question, hint, findingByAnswer, options })

const androidInstallChecks = [
  check('correct-build', 'Is this the current build for this Android device?', 'TV devices need the TV build; phones and tablets need the Mobile build.', { no: 'wrong-build', unsure: 'wrong-build' }),
  check('free-storage', 'Does the device have at least 500 MB free?', 'Low storage can stop Android’s package installer.', { no: 'low-storage', unsure: 'low-storage' }),
  check('signature-message', 'Does the error mention a conflicting package or signature?', 'Only an explicit conflict makes a clean uninstall the likely next step.', { yes: 'signature-conflict', unsure: 'signature-conflict' })
]

const androidUpdateChecks = [
  check('correct-build', 'Did you download the current build for this Android device?', 'Mobile and TV packages are not interchangeable.', { no: 'wrong-build', unsure: 'wrong-build' }),
  check('install-permission', 'If this is an APK, is Install unknown apps allowed?', 'Choose Store install when the update comes from an app store.', { no: 'unknown-sources', unsure: 'unknown-sources' }, yesNoStoreUnsure),
  check('signature-message', 'Does the installer explicitly report a package or signature conflict?', 'Having an older version installed is normal during an update; the error wording is what matters.', { yes: 'signature-conflict', unsure: 'signature-conflict' })
]

const iosInstallChecks = [
  check('ios-install-method', 'How was Nuvio installed?', 'Signing checks apply only to sideloaded copies.', {}, iosInstallMethodOptions),
  check('ios-profile-ready', 'If sideloaded, are Developer Mode and the profile trust enabled?', 'Store installs do not require these steps.', { no: 'ios-signing', unsure: 'ios-signing' }, yesNoStoreUnsure),
  check('ios-signature-current', 'If sideloaded, is the IPA signature current?', 'A sideloaded app stops opening after its signature expires.', { no: 'ios-signing', unsure: 'ios-signing' }, yesNoStoreUnsure)
]

const tizenInstallChecks = [
  check('tizen-developer-mode', 'Is Tizen Developer Mode enabled?', 'Enable it from Apps and reboot the TV.', { no: 'tizen-setup', unsure: 'tizen-setup' }),
  check('tizen-host-ip', 'Does Host PC IP match the computer doing the install?', 'A changed local IP prevents the SDB connection.', { no: 'tizen-setup', unsure: 'tizen-setup' }),
  check('tizen-certificate', 'Was the certificate created while this TV was connected?', 'The certificate needs the TV’s DUID.', { no: 'tizen-setup', unsure: 'tizen-setup' })
]

const webosInstallChecks = [
  check('webos-developer-mode', 'Are Developer Mode and Key Server both on?', 'Both switches are in the LG Developer Mode app.', { no: 'webos-setup', unsure: 'webos-setup' }),
  check('webos-session', 'Is the developer session still active?', 'Expired sessions can make apps disappear or stop launching.', { no: 'webos-setup', unsure: 'webos-setup' }),
  check('webos-network', 'Are the TV and installer on the same local network?', 'The current TV IP and passphrase must be reachable from the computer.', { no: 'webos-setup', unsure: 'webos-setup' })
]

const windowsInstallChecks = [
  check('windows-installer', 'Are you using the current official Windows installer?', 'Use the Windows release rather than an Android or TV package.', { no: 'wrong-build', unsure: 'wrong-build' }),
  check('windows-smartscreen', 'Did you allow the app through SmartScreen?', 'Choose More info → Run anyway for the official release.', { no: 'windows-install', unsure: 'windows-install' }),
  check('windows-uac', 'Did you approve the User Account Control prompt?', 'Setup cannot continue without that permission.', { no: 'windows-install', unsure: 'windows-install' })
]

export const installChecksByPlatform: Record<PlatformId, Partial<Record<string, readonly DoctorCheck[]>>> = {
  'android-tv': { 'install-error': androidInstallChecks, 'wont-update': androidUpdateChecks },
  'android-mobile': { 'install-error': androidInstallChecks, 'wont-update': androidUpdateChecks },
  ios: { 'install-error': iosInstallChecks, 'wont-update': iosInstallChecks },
  tizen: { 'install-error': tizenInstallChecks, 'wont-update': tizenInstallChecks },
  webos: { 'install-error': webosInstallChecks, 'wont-update': webosInstallChecks },
  windows: { 'install-error': windowsInstallChecks, 'wont-update': windowsInstallChecks }
}

const defaultPlaybackErrorChecks = [
  check('is-standard-file', 'Is this a standard media file format (e.g., MP4 or MKV)?', 'Unusual or non-standard file formats may fail to load natively.', { no: 'stream-file', unsure: 'stream-file' }),
  check('external-player-tried', 'Have you tried playing the stream in an external player?', 'Using VLC or MX Player can resolve built-in player format/codec limitations.', { no: 'codec-renderer', unsure: 'codec-renderer' })
]

const iosPlaybackErrorChecks = [
  check('is-standard-file', 'Is this a standard media file format (e.g., MP4 or MKV)?', 'Unusual or non-standard file formats may fail to load natively.', { no: 'stream-file', unsure: 'stream-file' }),
  check('debrid-plugin-used-ios', 'Are you using a Debrid service or plugin to stream?', 'Debrid services (like TorBox or Real-Debrid) or specialized plugins resolve torrents to HTTPS links.', { no: 'ios-p2p-unsupported', unsure: 'ios-p2p-unsupported', yes: 'codec-renderer' })
]

export const playbackChecksByPlatform: Record<PlatformId, Partial<Record<string, readonly DoctorCheck[]>>> = {
  'android-tv': { 'file-type-unsupported': defaultPlaybackErrorChecks },
  'android-mobile': { 'file-type-unsupported': defaultPlaybackErrorChecks },
  ios: { 'file-type-unsupported': iosPlaybackErrorChecks },
  tizen: { 'file-type-unsupported': defaultPlaybackErrorChecks },
  webos: { 'file-type-unsupported': defaultPlaybackErrorChecks },
  windows: { 'file-type-unsupported': defaultPlaybackErrorChecks }
}

export const symptomsByArea: Record<AreaId, readonly Symptom[]> = {
  install: [
    {
      id: 'install-error',
      label: '“App not installed”',
      description: 'The installer rejects the package.',
      checks: [
        check('correct-build', 'Is this package made for your device?', 'For example, Android TV needs the TV build—not the Mobile build.', { no: 'wrong-build', unsure: 'wrong-build' }),
        check('free-storage', 'Does the device have at least 500 MB free?', 'Low storage can stop the package installer.', { no: 'low-storage', unsure: 'low-storage' }),
        check('signature-message', 'Does the installer mention a conflicting package or signature?', 'Only an explicit conflict makes a clean uninstall the likely next step.', { yes: 'signature-conflict', unsure: 'signature-conflict' })
      ]
    },
    {
      id: 'wont-update',
      label: 'Nuvio will not update',
      description: 'A new APK or package will not replace the current app.',
      checks: [
        check('correct-build', 'Did you download the current build for this device?', 'Mobile and TV packages are not interchangeable.', { no: 'wrong-build', unsure: 'wrong-build' }),
        check('install-permission', 'Is sideloading or developer installation allowed?', 'This is usually called Install unknown apps on Android.', { no: 'unknown-sources', unsure: 'unknown-sources' }),
        check('signature-message', 'Does the installer explicitly report a package or signature conflict?', 'Having an older version installed is normal during an update.', { yes: 'signature-conflict', unsure: 'signature-conflict' })
      ]
    },
    {
      id: 'crashes',
      label: 'Crashes on launch',
      description: 'Nuvio closes or freezes as soon as it opens.',
      checks: [
        check('cache-cleared', 'Have you cleared Nuvio’s cache?', 'Clear cache first; clear data only after saving important setup details.', { no: 'stale-app-data', unsure: 'stale-app-data' }),
        check('supported-os', 'Does the device meet the release’s OS requirement?', 'Older operating systems may not run the latest build.', { no: 'os-compatibility', unsure: 'os-compatibility' }),
        check('filter-active', 'Is a VPN, firewall, or DNS filter active?', 'Filtering apps can block Nuvio while it initializes.', { yes: 'vpn-filter' })
      ]
    },
    {
      id: 'login',
      label: 'Login or account problem',
      description: 'You were signed out or your credentials are rejected.',
      checks: [
        check('clock-correct', 'Is automatic date and time enabled?', 'A wrong clock can invalidate authentication tokens.', { no: 'device-clock', unsure: 'device-clock' }),
        check('internet-works', 'Can this device open a normal website?', 'This separates an account issue from a device connection issue.', { no: 'local-network', unsure: 'local-network' }),
        check('signed-in-again', 'Have you signed out and entered your credentials again?', 'Refreshing the session often resolves post-update login problems.', { no: 'account-session', unsure: 'account-session' })
      ]
    }
  ],
  streams: [
    {
      id: 'no-streams',
      label: 'No streams found',
      description: 'A title opens, but Nuvio returns no playable results.',
      checks: [
        check('addon-enabled', 'Is at least one streaming addon enabled?', 'Check Settings → Addons, not only catalog or subtitle addons.', { no: 'addon-disabled', unsure: 'addon-disabled' }),
        check('native-ready', 'If using Nuvio-native Debrid, is the full setup ready?', 'Connected provider, active subscription, Resolve playable links, and a keyless P2P scraper are all required.', { no: 'native-debrid-readiness', unsure: 'native-debrid-readiness' }, [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not-used', label: 'Not using native' },
          { value: 'unsure', label: 'Not sure' }
        ]),
        check('addon-debrid-ready', 'If the addon manages Debrid, is its subscription and private manifest current?', 'Choose Not using this mode for native or Debrid-free setups.', { no: 'debrid-session', unsure: 'debrid-session' }, [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not-used', label: 'Not using this mode' },
          { value: 'unsure', label: 'Not sure' }
        ]),
        check('all-titles', 'Does this happen on several older titles too?', 'A brand-new release may simply not be indexed or cached yet.', { yes: 'addon-config', no: 'content-availability', unsure: 'content-availability' })
      ]
    },
    {
      id: 'manifest-error',
      label: 'Manifest URL error',
      description: 'Nuvio cannot add or load an addon address.',
      checks: [
        check('https-url', 'Does the address begin with https://?', 'HTTP, typos, and trailing spaces can break the request.', { no: 'manifest-address', unsure: 'manifest-address' }),
        check('manifest-json', 'Does the address show JSON in a browser?', 'A timeout or error suggests the addon server is unavailable.', { no: 'addon-server', unsure: 'addon-server' }),
        check('filter-active', 'Is a VPN or DNS filter active?', 'Some addon hosts are blocked by a region or filtering rule.', { yes: 'vpn-filter' })
      ]
    },
    {
      id: 'addons-missing',
      label: 'Addons disappeared',
      description: 'Your addon list was reset after an update or reinstall.',
      checks: [
        check('after-update', 'Did this start immediately after an update?', 'Updates can occasionally reset addon configuration.', { yes: 'lost-addon-config', unsure: 'lost-addon-config' }),
        check('saved-urls', 'Do you still have your private manifest URLs?', 'You will need those URLs to restore custom addons.', { no: 'lost-addon-config', unsure: 'lost-addon-config' }),
        check('urls-current', 'Have you checked whether the addon URLs changed?', 'Community addon addresses can move.', { no: 'addon-config', unsure: 'addon-config' })
      ]
    },
    {
      id: 'native-debrid-error',
      label: 'Nuvio-native Debrid fails',
      description: 'TorBox or Premiumize is linked in Nuvio itself.',
      checks: [
        check('subscription-active', 'Is the provider subscription active?', 'Verify this directly on the TorBox or Premiumize website.', { no: 'debrid-subscription', unsure: 'debrid-subscription' }),
        check('native-connected', 'Does it show Connected with Resolve playable links On?', 'Check Settings → Integrations → Connected Services.', { no: 'native-debrid-connection', unsure: 'native-debrid-connection' }),
        check('p2p-keyless', 'Does a keyless P2P scraper return raw hashes?', 'Do not put a Debrid API key in the scraper when Nuvio is the resolver.', { no: 'native-debrid-p2p', unsure: 'native-debrid-p2p' })
      ]
    },
    {
      id: 'addon-debrid-error',
      label: 'Addon-managed Debrid fails',
      description: 'The addon itself holds the provider credentials.',
      checks: [
        check('subscription-active', 'Is the provider subscription active?', 'Check on the provider website, not only inside Nuvio.', { no: 'debrid-subscription', unsure: 'debrid-subscription' }),
        check('key-current', 'Did you regenerate the addon after the API key changed?', 'A new key requires a new private manifest URL.', { no: 'debrid-session', unsure: 'debrid-session' }),
        check('filter-active', 'Is a VPN active?', 'Some Debrid services block known VPN IP ranges.', { yes: 'vpn-filter' })
      ]
    },
    {
      id: 'addon-slow',
      label: 'An addon loads slowly',
      description: 'The stream list waits on one or more addon servers.',
      checks: [
        check('one-addon-slow', 'Is one addon noticeably slower than the others?', 'Comparing addons separates a remote host problem from a broader slowdown.', { yes: 'addon-host-load', unsure: 'addon-host-load' }),
        check('peak-hours', 'Is it worse during busy hours?', 'Community hosts can run out of capacity at peak times.', { yes: 'addon-host-load', unsure: 'addon-host-load' }),
        check('self-hosted', 'Is the slow addon self-hosted?', 'Server CPU, memory, and logs are the next checks for a private host.', { yes: 'addon-host-load' })
      ]
    }
  ],
  playback: [
    {
      id: 'buffering',
      label: 'Buffers or stutters',
      description: 'Playback pauses, catches up, or drops frames.',
      checks: [
        check('all-streams', 'Does it happen with every stream you try?', 'A single failing source is usually a file or host problem.', { no: 'stream-file', yes: 'network-buffering', unsure: 'network-buffering' }),
        check('debrid-connected', 'If you use Debrid, is it connected and active?', 'Choose “Not using it” for a Debrid-free setup.', { no: 'debrid-subscription', unsure: 'debrid-subscription' }, [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'not-used', label: 'Not using it' },
          { value: 'unsure', label: 'Not sure' }
        ]),
        check('cache-cleared', 'Have you restarted Nuvio and cleared its cache?', 'Stale local playback data can affect every stream.', { no: 'stale-app-data', unsure: 'stale-app-data' })
      ]
    },
    {
      id: 'playback-error',
      label: 'Playback error or failed to play',
      description: 'The player refuses to play, crashes, or returns format errors.',
      subSymptoms: [
        {
          id: 'file-type-unsupported',
          label: '“File type not supported”',
          description: 'The player rejects the stream with a format/codec compatibility message.',
          checks: defaultPlaybackErrorChecks
        }
      ]
    },
    {
      id: 'black-or-silent',
      label: 'Black screen or no audio',
      description: 'The stream starts, but picture or sound is missing.',
      checks: [
        check('other-stream-works', 'Does another stream for the title work?', 'If yes, the original file is the likely problem.', { yes: 'stream-file', no: 'codec-renderer', unsure: 'codec-renderer' }),
        check('external-tried', 'Have you tried VLC or MX Player?', 'An external player is the fastest codec compatibility test.', { no: 'codec-renderer', unsure: 'codec-renderer' }),
        check('colors-wrong', 'Is the picture green, purple, or washed out?', 'That strongly suggests an unsupported Dolby Vision profile.', { yes: 'dolby-vision' })
      ]
    },
    {
      id: 'subtitles-missing',
      label: 'Subtitles are missing',
      description: 'No suitable embedded or external track appears.',
      checks: [
        check('tracks-listed', 'Are any subtitle tracks listed?', 'Some files contain no embedded tracks.', { no: 'subtitle-source', unsure: 'subtitle-source' }),
        check('language-set', 'Is a preferred subtitle language configured?', 'This controls which external tracks Nuvio looks for first.', { no: 'subtitle-settings', unsure: 'subtitle-settings' }),
        check('fast-startup', 'Is Addon Subtitle Startup set to Fast startup?', 'Fast startup intentionally skips the automatic external subtitle fetch.', { yes: 'subtitle-settings', unsure: 'subtitle-settings' })
      ]
    },
    {
      id: 'subtitles-sync',
      label: 'Subtitles are out of sync',
      description: 'The words appear before or after the dialogue.',
      checks: [
        check('offset-tried', 'Have you tried the subtitle delay or offset control?', 'Move the track forward or backward during playback.', { no: 'subtitle-sync', unsure: 'subtitle-sync' }),
        check('other-stream-sync', 'Is another stream for the title in sync?', 'Different releases can use different subtitle timing.', { yes: 'stream-file', no: 'subtitle-sync', unsure: 'subtitle-sync' }),
        check('audio-delay-default', 'Is the player’s audio delay at its default?', 'An audio offset can make every subtitle track appear wrong.', { no: 'subtitle-sync', unsure: 'subtitle-sync' })
      ]
    },
    {
      id: 'subtitles-startup',
      label: 'Subtitles delay playback',
      description: 'Playback stutters or waits while subtitle sources load.',
      checks: [
        check('startup-only', 'Does the slowdown happen mainly at startup?', 'That points to the automatic external subtitle fetch.', { yes: 'subtitle-startup', unsure: 'subtitle-startup' }),
        check('fast-startup-tried', 'Have you tried Fast startup?', 'Fast startup skips the automatic fetch but keeps manual selection available.', { no: 'subtitle-startup', unsure: 'subtitle-startup' }),
        check('manual-subs-work', 'Can you select subtitles after playback begins?', 'If yes, the subtitle source works and only startup needs tuning.', { yes: 'subtitle-startup' })
      ]
    },
    {
      id: 'wrong-audio',
      label: 'Wrong audio language',
      description: 'Playback starts with the wrong language or track.',
      checks: [
        check('track-available', 'Can you choose the correct track during playback?', 'Use the Audio Track control in the player menu.', { yes: 'audio-language', no: 'stream-file', unsure: 'audio-language' }),
        check('preferred-set', 'Is a preferred audio language configured?', 'You can also set a secondary fallback language.', { no: 'audio-language', unsure: 'audio-language' }),
        check('other-stream-works', 'Does another stream contain the right language?', 'Not every source includes the same audio tracks.', { yes: 'stream-file', no: 'audio-language', unsure: 'audio-language' })
      ]
    },
    {
      id: 'poor-quality',
      label: 'Video quality is too low',
      description: 'Only low-resolution or low-bitrate results appear.',
      checks: [
        check('high-options', 'Does the stream picker show 1080p or 4K?', 'The provider may not have a higher-quality cached source.', { no: 'content-availability', unsure: 'content-availability' }),
        check('quality-cap', 'Could the addon have a quality cap?', 'Quality filters are set when some addons are configured.', { yes: 'quality-filter', unsure: 'quality-filter' }),
        check('speed-good', 'Can this device sustain the higher bitrate?', 'A stable 25+ Mbps connection is recommended for 4K.', { no: 'local-network', unsure: 'local-network' })
      ]
    }
  ],
  sync: [
    {
      id: 'trakt-sync',
      label: 'Trakt is not syncing',
      description: 'History, ratings, or other Trakt data stopped moving.',
      checks: [
        check('reauth-tried', 'Have you logged out of Trakt and authorized again?', 'This refreshes an expired access token.', { no: 'trakt-auth', unsure: 'trakt-auth' }),
        check('trakt-online', 'Does Trakt appear to be online?', 'An upstream outage affects every connected app.', { no: 'trakt-outage', unsure: 'trakt-outage' }),
        check('correct-account', 'Is Nuvio connected to the expected Trakt account?', 'Compare the username shown on each device.', { no: 'account-mismatch', unsure: 'account-mismatch' })
      ]
    },
    {
      id: 'progress',
      label: 'Watch progress is not saving',
      description: 'Continue watching does not remember your position.',
      checks: [
        check('watched-long-enough', 'Did you watch for more than a few seconds?', 'Very short playback may not trigger a scrobble.', { no: 'progress-threshold', unsure: 'progress-threshold' }),
        check('external-player', 'Did you use an external player?', 'Some external players do not report progress back to Nuvio.', { yes: 'external-scrobble', unsure: 'external-scrobble' }),
        check('trakt-connected', 'Is Trakt currently connected?', 'An expired token stops progress from syncing.', { no: 'trakt-auth', unsure: 'trakt-auth' })
      ]
    },
    {
      id: 'lists',
      label: 'Library or watchlist is stale',
      description: 'Items added elsewhere do not appear on this device.',
      checks: [
        check('same-account', 'Are both devices using the same Trakt account?', 'Profiles connected to different accounts will not share lists.', { no: 'account-mismatch', unsure: 'account-mismatch' }),
        check('cache-cleared', 'Have you cleared Nuvio’s cache?', 'Cached list data can become stale.', { no: 'stale-app-data', unsure: 'stale-app-data' }),
        check('reauth-tried', 'Have you reconnected Trakt?', 'This refreshes the account token and sync state.', { no: 'trakt-auth', unsure: 'trakt-auth' })
      ]
    }
  ],
  connection: [
    {
      id: 'nothing-loads',
      label: 'Nothing loads',
      description: 'Nuvio cannot reach content or services at all.',
      checks: [
        check('other-apps-work', 'Can this device open a normal website?', 'If not, the device or local network is the problem.', { no: 'local-network', unsure: 'local-network' }),
        check('alternate-network', 'Does Nuvio work on another connection?', 'Try mobile data, a hotspot, or another Wi-Fi network.', { yes: 'local-network', unsure: 'local-network' }),
        check('filter-active', 'Is a VPN, firewall, or DNS filter active?', 'Filtering can affect only Nuvio or one of its services.', { yes: 'vpn-filter' })
      ]
    },
    {
      id: 'slow-streams',
      label: 'Streams are consistently slow',
      description: 'Sources load, but speed is poor across different titles.',
      checks: [
        check('speed-good', 'Is the speed test on this device close to your plan?', 'A large gap points to the ISP, Wi-Fi, or local network.', { no: 'local-network', unsure: 'local-network' }),
        check('wired-or-5g', 'Are you using Ethernet or strong 5 GHz Wi-Fi?', 'Wired networking is the most reliable option for TV devices.', { no: 'wifi-quality', unsure: 'wifi-quality' }),
        check('vpn-comparison', 'What happens when you change the VPN state?', 'Testing both ways can expose VPN throttling or ISP interference.', { 'faster-off': 'vpn-filter', 'faster-on': 'isp-routing' }, [
          { value: 'faster-off', label: 'Faster with VPN off' },
          { value: 'faster-on', label: 'Faster with VPN on' },
          { value: 'same', label: 'No difference' },
          { value: 'not-tried', label: 'Not tried' }
        ])
      ]
    },
    {
      id: 'sluggish-app',
      label: 'The app feels sluggish',
      description: 'Menus, search, or navigation respond slowly.',
      checks: [
        check('cache-cleared', 'Have you cleared Nuvio’s cache?', 'Old cached data can slow navigation.', { no: 'stale-app-data', unsure: 'stale-app-data' }),
        check('free-storage', 'Does the device have at least 500 MB free?', 'Very low storage can degrade app performance.', { no: 'low-storage', unsure: 'low-storage' }),
        check('background-apps', 'Are many other apps running?', 'Closing them frees memory for Nuvio.', { yes: 'device-resources', unsure: 'device-resources' })
      ]
    }
  ]
}
