# Overzicht van de instellingen

De instellingen van Nuvio bieden diepgaande aanpassingsmogelijkheden. Hieronder vind je een gedetailleerd overzicht, inclusief de verschillen tussen de **Mobiele** en **Android TV**-versies.

> [!IMPORTANT]
> Elke feature die niet specifiek is gelabeld met [Android TV Only] of [Mobile Only], is beschikbaar op beide versies.

## 1. Algemeen & UI
| Instelling | Mobiel | Android TV |
| :--- | :--- | :--- |
| **Thema** | Selecteer aangepaste accentkleurenpaletten (White, Crimson, Ocean, Violet, Emerald, Amber, Rose). Schakel **AMOLED Black** in om pure zwarte achtergronden te gebruiken voor OLED-schermen. | Selecteer aangepaste accentkleurenpaletten (White, Crimson, Ocean, Violet, Emerald, Amber, Rose). Schakel **AMOLED Mode** en **Pure Black Surfaces** in om pure zwarte achtergronden en kaartoppervlakken te gebruiken. |
| **Lettertype & Taal** | Pas de globale taalinstellingen (App Language overrides) van de app aan. | Pas de globale lettertypekeuzes (App Font family) en taalinstellingen van de app aan. |
| **Lay-out / Startscherm-rijen** | Schakel de **Show Continue Watching**-rij (Verder kijken) in/uit op het startscherm. Selecteer het standaard type startschermkaart: **Card** (liggende kaart in TV-stijl), **Wide** (informatierijke horizontale kaart) of **Poster** (op artwork gerichte posterkaart). Schakel de pop-up **Resume prompt on launch** (Hervat-melding bij opstarten) in/uit. | Schakel het startschermdashboard tussen Modern View (met speciale 'hero'-panelen), Grid View of Classic View. Schakel Fullscreen Hero Backdrops in/uit. Configureer automatisch inklappende zijbalken. |
| **Up Next-gedrag (Volgende)** | Configureer fijnmazige trackingregels: **Prefer Episode Thumbnails** (Voorkeur voor miniatuurafbeeldingen), **Up Next From Furthest Episode** (schakel uit bij opnieuw bekijken om de meest recente te gebruiken), **Show Unaired Next Up Episodes** (Toon nog niet uitgezonden afleveringen) en **Blur Unwatched** (Vervaag onbekeken afleveringen) om spoilers te voorkomen. | Configureer de afspeelreeksen van series met behulp van **Prefer Binge Group**-regels, **Reuse Binge Groups** en variabele percentages voor **Next Episode Threshold Mode**. |
| **Stijl van posterkaarten** | Pas de kaartbreedte (**Width**: Compact, Dense, Standard, Balanced, Comfort, Large) en hoekafronding (**Corner Radius**: Sharp, Subtle, Classic, Rounded, Pill) aan met een realtime **Live Preview**. Schakel **Landscape Posters** (Liggende posters) en **Hide labels** (Labels verbergen) in/uit. | Pas de kaartbreedte (van Compact tot Large), hoekafronding (van Sharp tot Pill) en de hover-vertraging (**Backdrop Expand Delay**) aan. Schakel **Landscape Posters** in/uit. |

[Terug naar boven](#overzicht-van-de-instellingen)

## 2. Afspelen: [Bekijk afspeelhandleiding](player.md)
- **Interne player:** Ten zeerste aanbevolen voor de meeste gebruikers. Ondersteunt hardware-decodering.
  - *Internal Engine:* Kies handmatig tussen ExoPlayer of libmpv als de primaire media-engine op de achtergrond.
  - *Auto-switch engine on startup error* [Android TV Only]: Schakelt automatisch terug van ExoPlayer naar libmpv bij gedetecteerde anime of wanneer er een initialisatiefout optreedt.
- **Externe player:** Handig als je codec-problemen ervaart. Nuvio kan de stream doorsturen naar VLC, MX Player of JustPlayer.
- **Hardwareversnelling:** Schakel dit in als je haperingen ervaart op oudere apparaten.
- **Automatisch volgende afspelen:** Start automatisch de volgende aflevering van een serie.
- **Intro en outro overslaan:** Geeft prioriteit aan databasefilters voor segmenten via IntroDB, AniSkip en Anime Skip. Bevat automatische tools voor het indienen van community-tijdstempels [Mobile Only] naast aangepaste inhoudswaarschuwingen (**Content Warnings**) en automatische filters voor het overslaan van segmenten [Android TV Only].
- **Streamselectie & Automatisch afspelen:** Configureer verbindingsinstellingen zoals *Reuse Last Link*, limieten voor *Last Link Cache Duration*, expliciete *Selection Modes* (automatisch afspelen van de eerste bron, handmatige lijst of aangepaste Regex-tekstmatching), time-outinstellingen voor scrapers en fijnmazige *Filtering Scopes* voor plug-ins/addons.
- **Binge-opties:** Past geautomatiseerde afspeelreeksen aan via *Prefer Binge Group*-regels, *Reuse Binge Groups*, variabele percentages voor *Next Episode Threshold Mode*, en inactiviteitsmeldingen via *Are You Still Watching?* [Android TV Only].
- **Ondertitel- en audiopreferenties:** Vergrendelt primaire en secundaire talen voor meersporen-audio/ondertitels, filtert niet-gewenste sporen uit, gebruikt een *Skip Silence*-trigger en biedt een *Enable downmix*-optie om meerkanaals surround sound om te zetten naar helder stereogeluid.
- **Aanpassingen voor ondertitel-lay-out:** Past de grootte van ondertitels aan, evenals aangepaste tekst-/achtergrondkleurprofielen, randparameters en *Vertical Offset* (verticale verschuiving). Bevat een experimentele schakelaar om de **libass rendering engine** te gebruiken voor zware dynamic typesetting-scripts (ASS/SSA).
- **Interface & bedieningsoverlays:** Bevat standaard *Loading Overlays* (laadoverlays) om netwerkvertraging te verbergen. Bevat passieve informatieve *Pause Overlays* [Android TV Only], *OSD System Clocks* (systeemklokken) [Android TV Only], touchscreen-vermenigvuldigers voor *Hold To Speed / Hold Speed*, en verticale veeggebaren (*Gesture Controls*) voor volume/helderheid [Mobile Only].

[Terug naar boven](#overzicht-van-de-instellingen)

## 3. Account-integrations: [Bekijk integratiehandleiding](/nl/integrations/)
- **Trakt.tv:** Synchroniseert je "Up Next"-lijst en kijkgeschiedenis over al je Nuvio-apparaten.
- **TorBox / Premiumize:**
  - Essentieel voor buffer-vrije 4K-streams van hoge kwaliteit.
  - Vereist een API-sleutel of apparaatcode voor autorisatie.
- **Plugins & Uitbreidingen:** Beheert externe scraper-opslagplaatsen wereldwijd, wat integrations via directe URL-invoer of mobiele QR-codes mogelijk maakt.
- **TMDB Enrichment Sourcing:** Haalt artwork, tekstloze achtergronden, gesynchroniseerde countdowns voor releases, cast- en crew-lijsten, productienetwerken en specifieke afleveringsduur binnen.
- **MDBList Ratings API:** Koppelt een persoonlijke sleutel om beoordelingsscores van platforms (Trakt, IMDb, TMDB, Letterboxd, Rotten Tomatoes, Audience en Metacritic) op te halen en over titels in het dashboard te tonen.
- **Anime Skip-integration:** Autoriseert accountvalidatielinks via een externe Client ID om nauwkeurige, crowd-sourced tijdstempels te activeren voor het overslaan van segmenten.

[Terug naar boven](#overzicht-van-de-instellingen)

## 4. Geavanceerd [Android TV Only]: [Bekijk afspeelhandleiding](player.md)
- **Decoder-prioriteit:** Bepaalt de verwerkingsprioriteit via *Device decoders only* (strikte hardware-verwerking), *Prefer device decoders* (prioriteit voor hardware met software-terugval) of *Prefer app decoders (FFmpeg)* (software-verwerking voor oudere formaten).
- **Geavanceerde schermopmaak:** Maakt gebruik van standaard *DV7 - HEVC Fallback*-lagen om vervormde paars/groene kleurweergaven te corrigeren. Voegt opties toe voor *Preserve DV mapping (DV7 to DV8.1)* en *Convert DV5 to DV8.1*-matrices.
- **Schakelen van verversingssnelheid (AFR):** Past automatisch de verversingssnelheid van je TV aan op de inhoud (bijv. 24 fps) om schokken in het beeld te voorkomen. Te configureren als *Off*, *On start* of *On start/stop*.
- **Tunnelled Playback:** Verbetert de synchronisatie en vermindert overhead op ondersteunde Android TV-hardware. Het stuurt ruwe videostreams rechtstreeks naar de beeldschermchips om zware 4K HDR-weergave te optimaliseren.
- **Force AC-3 Transcoding (Optisch/SPDIF):** Zet meerkanaals audioformaten (TrueHD, DTS, AAC) live om naar traditioneel gecomprimeerde Dolby Digital 5.1-sporen om audio via bandbreedte-beperkte digitale optische verbindingen te behouden.

[Terug naar boven](#overzicht-van-de-instellingen)

## 5. Buffer en Netwerk: [Bekijk afspeelhandleiding](player.md)
Deze instellingen bepalen de toewijzing van het interne geheugen, lokale caches en regels voor netwerkverkeer.

- **Aangepaste afspeelbuffers:** Overschrijft de standaard Media3-parameters volledig met gespecificeerde verwerkingslimieten:
  - *Min / Max Buffer Duration:* Stelt de veilige minimale en maximale tijdsduur van de inhoud in om vooruit te cachen ten opzichte van de huidige afspeelpositie.
  - *Initial Buffer & Buffer After Rebuffer:* Stelt de exacte bufferduur in die nodig is voordat een videostream start, of bij het opnieuw laden na een hapering.
  - *Back Buffer Duration:* Houdt reeds bekeken streamgegevens vast in het lokale geheugen om direct terugspoelen mogelijk te maken zonder de inhoud opnieuw te downloaden.
  - *Target Buffer Allocations:* Beheert het RAM-gebruik van het apparaat veilig via een automatisch *Managed Memory Budget*-filter, of omzeilt beperkingen om handmatige caching-schuifregelaars tot 2 GB te ontgrendelen via de *Allow Larger Target Buffer*-schakelaar.
- **Schijfcache-prestaties:** Stelt vaste cachepartities in op de opslag:
  - *VOD Disk Cache:* Slaat actieve gedownloade bestanden rechtstreeks op in de interne opslag om het afspelen te beschermen tegen tijdelijke netwerkonderbrekingen.
  - *Auto Size:* Automatiseert de cachegrootte op basis van ongeveer 10% van de beschikbare vrije ruimte, met opties voor handmatige aanpassingen.
- **Netwerk- & P2P-streamfilters:** Gebruikt een *Custom Network*-filter om parallelle downloadverbindingen te openen voor progressieve links. Bevat een schakelaar om *P2P Streaming*-reeksen leeg te maken voor torrent-configuraties en opties om overlay-statistieken van torrents (*Hide torrent stats*) te verbergen tijdens het afspelen.

[Terug naar boven](#overzicht-van-de-instellingen)

## 6. Aanpassing & Beheer
- **Profiles:** Beheer meerdere gebruikers, kijkgeschiedenissen en aanbevelingen afzonderlijk. [Bekijk profielenhandleiding](profiles.md)
- **Collections:** Maak uitgebreide aangepaste collections door media te groeperen op genre, studio of aangepaste lijsten. [Bekijk collectieshandleiding](collections.md).
- **Back-up & Synchronisatie:** Exporteert of importeert gecompileerde applicatieconfiguraties om lay-outs, trackingscripts en engine-limieten direct te kopiëren naar back-upapparaten.

[Terug naar boven](#overzicht-van-de-instellingen)
