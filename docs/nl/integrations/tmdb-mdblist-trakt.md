# Gids voor inhoudsverrijking & tracking

### TMDB-verrijking

TMDB (The Movie Database) vormt de basis voor je metadata en haalt artwork van hoge kwaliteit, afleveringsdetails en castinformatie binnen.

**Hoe krijg je een TMDB-API-sleutel:**
1. Maak een gratis account aan op [themoviedb.org](https://www.themoviedb.org/).
2. Navigeer naar je Accountinstellingen en selecteer de link **API** in de linkerzijbalk.
3. Vraag een API-sleutel aan en selecteer **Yes this is for personal use** (Ja, dit is voor persoonlijk gebruik).
4. Vul het formulier in.
5. Kopieer de verstrekte v3 API-sleutel (gebruik niet het v4 Read Access Token voor dit veld).

**Nuvio-configuratie:**
1. Navigeer naar **Integrations** > **TMDB Enrichment**.
2. Schakel **Enable TMDB Enrichment** in (Aan).
3. Plak je v3-sleutel in het veld **Personal API key** en klik op Opslaan.
4. Stel je gewenste **Language code** in (bijv. `nl` voor Nederlands).
5. Schakel de gewenste metadatamodules in. Beschikbare modules zijn onder andere:
    - **Artwork** (Logo's en achtergronden)
    - **Basic Info** (Beschrijving, genres, beoordelingen)
    - **Details** (Speelduur, status, land, taal)
    - **Credits** (Cast, regisseur, schrijver)
    - **Productions** & **Networks**
    - **Episodes** (Titels, samenvattingen, miniaturen, speelduur)
    - **Season posters** & **Collections**
    - **More Like This** (Aanbevolen achtergronden)

[Terug naar boven](#gids-voor-inhoudsverrijking-tracking)

---

### MDBList-beoordelingen

MDBList verzamelt beoordelingsscores van meerdere platforms, zodat je publieks- en criticusscores rechtstreeks op de metadatapagina's kunt zien.

**Hoe krijg je een MDBList-API-sleutel:**
1. Registreer een gratis account op [mdblist.com](https://mdblist.com/).
2. Ga naar je accountvoorkeuren om een gratis API-sleutel te genereren.
3. Zorg ervoor dat je alleen de API-sleutel zelf kopieert, niet de volledige URL.

**Nuvio-configuratie:**
1. Navigeer naar **Integrations** > **MDBList Ratings**.
2. Schakel **Enable MDBList Ratings** in (Aan).
3. Plak je sleutel in het veld **API Key** en klik op Opslaan.
4. Selecteer de externe beoordelingsplatforms die je wilt weergeven. Ondersteunde opties zijn onder andere **IMDb**, **TMDB**, **Rotten Tomatoes**, **Metacritic**, **Trakt**, **Letterboxd** en **Audience Score**.

[Terug naar boven](#gids-voor-inhoudsverrijking-tracking)

---

### Trakt-integration

Trakt synchroniseert je kijkgeschiedenis, voortgang en persoonlijke lijsten op al je apparaten. Nuvio ondersteunt zowel live synchronisatie via de app als het importeren van historische gegevens via een webtool.

#### In-App configuratie

**Hoe verbinding te maken met Trakt:**
Je hoeft niet handmatig een API-sleutel te genereren voor Trakt.
1. Navigeer naar **Integrations** > **Trakt**.
2. Klik op de knop **Connect Trakt**.
3. Dit zal je vragen in te loggen op je Trakt-account en Nuvio te machtigen om toegang te krijgen tot je profile.
4. Zodra de verbinding is gemaakt, wordt de status bijgewerkt met je Trakt-gebruikersnaam.

**Bibliotheek- en synchronisatie-opties:**
Pas na de authenticatie je trackingfuncties aan.

- **Library Source:** Kies welke bibliotheek je wilt gebruiken voor het opslaan en bekijken van je collection. Opties zijn **Trakt** of **Nuvio**.
- **Watch Progress:** Kies welke voortgangsbron wordt gebruikt voor hervatten en verder kijken. Opties zijn **Trakt** of **Nuvio Sync**.

> [!NOTE]
> Als je **Nuvio Sync** selecteert als je primaire voortgangsbron, zal Nuvio nog steeds op de achtergrond je lopende kijkvoortgang synchroniseren *naar* Trakt.

- **Continue Watching Window:** Definieer het tijdsbestek uit je Trakt-geschiedenis waarmee rekening wordt gehouden voor het verder kijken van een serie (bijv. 60 dagen).
- **Comments:** Schakel dit in om Trakt-gebruikersrecensies te tonen op metadatadetailpagina's.
- **More Like This source:** Kies waar de aanbevelingen op detailpagina's vandaan komen (bijv. Trakt).

#### Nuvio Trakt Bridge (Import-tool)

Als je overstapt naar Nuvio en je bestaande Trakt-geschiedenis wilt importeren in het native trackingsysteem van Nuvio, gebruik dan de webgebaseerde bridge-tool.

**Hoe de Trakt Bridge te gebruiken:**
1. Bezoek de [Nuvio Trakt Bridge](https://trakt-Nuvio.duckdns.org/).
2. Klik onder het gedeelte **Connect Trakt** op de knop om via Trakt OAuth de toegang goed te keuren in een pop-upvenster.
3. Klik onder het gedeelte **Connect Nuvio** op de knop om in te loggen en voer het e-mailadres en wachtwoord in die horen bij je Nuvio-account.
4. Selecteer het specifieke **Nuvio-profile** waarin je de gegevens wilt importeren uit het dropdown-menu.
5. Kies in het gedeelte **Import from Trakt** je synchronisatiebereiken:
    - **Watched history:** Importeert films en bekeken afleveringen.
    - **Continue watching:** Importeert de afspeelvoortgang.
    - **Library imports:** Vouw dit uit om specifieke bibliotheekgegevens te selecteren.
6. Klik op **Preview** om de te importeren gegevens te controleren en klik vervolgens op **Sync to Nuvio** om het proces te voltooien.

[Terug naar boven](#gids-voor-inhoudsverrijking-tracking)
