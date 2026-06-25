# Cross-platform UI- en aanpassingsgids

Of je nu door catalogi swipet op een telefoon of met een afstandsbediening vanaf de bank navigeert, Nuvio biedt diepgaande aanpassingsmogelijkheden om je streamingomgeving op maat in te richten. Deze gids legt uit hoe je visuele elementen configureert, je media organiseert en de afspeelnavigatie aanpast op zowel de Mobiele als de TV-applicatie.

---

## 1. Thema's & Uiterlijk

### Gedeelde features
- **Accentkleuren:** Kies uit White (Wit), Crimson (Karmozijnrood), Ocean (Oceaanblauw), Violet (Paars), Emerald (Smaragdgroen), Amber (Barnsteengeel) of Rose (Roze) om actieve menu's, knoppen en afspeelvoortgangsbalken te accentueren.

### Mobiele App
- **OLED/AMOLED-instellingen:** Een eenvoudige **AMOLED Black**-schakelaar maakt pure zwarte achtergronden mogelijk om batterij te besparen en vermoeide ogen te verminderen.

### TV-App
- **OLED/AMOLED-instellingen:** Fijnmazige controle is beschikbaar — schakel **AMOLED Mode** in voor de achtergrondlaag, en activeer afzonderlijk **Pure Black Surfaces** voor interactieve elementen zoals kaarten, panelen en containers.
- **Typografie:** Pas het lettertype (**App Font**, bijv. Inter) aan om de leesbaarheid op grote schermen te optimaliseren.

[Terug naar boven](#cross-platform-ui-en-aanpassingsgids)

---

## 2. Startscherm & Lay-outstructuren

### Gedeelde features
- **Catalogusbeheer:** Verberg nog niet uitgebrachte inhoud om je bibliotheek overzichtelijk te houden. Diepgaande organisatorische controle stelt je in staat om specifieke collections te vergrendelen, te verbergen of vast te pinnen (zoals *Ontdekken*, *Franchises* of *Streamingdiensten*) om precies te bepalen wat er op je startscherm verschijnt.
- **Poster Card Style:** Pas de afmetingen van je mediakaarten aan. Kies een breedte-preset (**Width**: Compact, Dense, Standard, Balanced, Comfort of Large) en een hoekafrondings-preset (**Corner Radius**: Sharp, Subtle, Classic, Rounded of Pill). Een optie *Reset to Default* herstelt alle wijzigingen naar de standaardwaarden.
- **Landscape Posters:** Schakel tussen traditionele verticale posters en horizontale liggende kaarten.

### Mobiele App
- **Hero-secties:** Gebruik de **Show Hero Section**-schakelaar om een interactieve carrousel bovenaan het startscherm te tonen, die rechtstreeks wordt gevuld door je geselecteerde Hero-catalogi.
- **Labels verbergen:** Maak de gebruikersinterface strakker door tekstlabels onder posters te verbergen (let op: dit geldt alleen voor mediaposters, niet voor collectietegels).

### TV-App
- **Modern View Lay-out:** De bovenste helft van het scherm fungeert als een dynamische hero-sectie. Terwijl je door catalogi navigeert, klapt de poster die momenteel de focus heeft uit in dit bovenste gedeelte, waarbij de volledige achtergrond, metadata en samenvatting worden getoond. De rest van de catalogus blijft in een horizontale rij eronder staan.
- **Classic View Lay-out:** Bevat een traditionele, roterende Hero-carrousel helemaal bovenaan het startscherm. Als je omlaag scrolt naar de standaard horizontale rijen, geeft de UI prioriteit aan de catalogi — posters met focus klappen niet dynamisch uit en vervangen de achtergrond niet.
- **Grid View Lay-out:** Werkt vergelijkbaar met de Classic-weergave, met dezelfde roterende Hero-carrousel bovenaan het scherm. In plaats van horizontale rijen organiseert deze lay-out de catalogus echter in een doorlopend, verticaal scrollend raster onder de hero.
- **Fullscreen Hero Backdrop:** Schakel dit in om de hero-afbeelding of de gefocuste poster de volledige achtergrond van het scherm te laten vullen.
- **Navigatie & Zijbalk:** Schakel een zwevende **Modern Sidebar** in en kies ervoor om de zijbalk standaard in te klappen (**Collapse Sidebar**) om de schermruimte voor posters te maximaliseren.
- **Gedrag van gefocuste poster:** Pas de schuifregelaar voor **Backdrop Expand Delay** (bijv. 3s) aan om te regelen hoe lang de app wacht voordat een gefocuste kaart wordt uitgeklapt in de achtergrond (voornamelijk gebruikt in Modern View).
- **Trailers op startscherm:** Schakel **Autoplay Trailer** in om automatisch previews af te spelen voor gefocuste inhoud wanneer deze direct op het startscherm beschikbaar zijn.
- **Catalogusdetails:** De optie **Show Catalog Type** toont aanduidingen voor Film/Serie (Movie/Series) naast titels.

[Terug naar boven](#cross-platform-ui-en-aanpassingsgids)

---

## 3. Detailpagina & Metadata-opmaak

### Gedeelde features
*(De presentatie van de detailpagina is sterk geoptimaliseerd voor het specifieke apparaatformaat; zie de platformspecifieke opties hieronder).*

Zie de [TMDb, MDBList, Trakt integratiegids](../integrations/tmdb-mdblist-trakt.md) voor metadata-verrijking en beoordelingen.

### Mobiele App
- **Achtergronden & Artwork:** Schakel **Cinematic Background** in voor een wazige achtergrond op het scherm.
- **Afleveringen lay-out:** Kies tussen **Horizontal** (liggende kaarten in een rij) of **List** (gestapelde kaarten met details) bij het bekijken van seizoenen.
- **Trailers:** Schakel **Hero Trailer Playback** in om previews rechtstreeks in de bovenste metadata-hero te bekijken.
- **Zichtbaarheid van secties:** Verberg of herorden afzonderlijke onderdelen van de detailpagina, waaronder Actions (Acties), Overview (Overzicht), Production (Productie), Cast, Comments (Reacties), Trailers en Episodes (Afleveringen).

### TV-App
- **Achtergronden & Artwork:** Schakel **Prefer meta from external addon** in/uit om te bepalen waar je metadata vandaan komt.
- **Trailers:** Beheer **Auto-play Trailers** om previews te starten na een periode van inactiviteit op de detailpagina, of schakel een specifieke **Show Trailer Button** in als je de voorkeur geeft aan handmatige bediening.
- **Gegevensopmaak:** Schakel de optie **Show full release date** in om de exacte premièredatum te zien in plaats van alleen het releasejaar.

[Terug naar boven](#cross-platform-ui-en-aanpassingsgids)

---

## 4. "Verder kijken" & Up Next-gedrag (Volgende)

### Gedeelde features
- **Afleveringen bijhouden:** Schakel **Up Next From Furthest Episode** in om ervoor te zorgen dat de app de nieuwste onbekeken aflevering toont.
- **Toon niet-uitgezonden Up Next-afleveringen:** Neem toekomstige, nog niet uitgezonden afleveringen op in de "Verder kijken"-wachtrij voordat ze worden uitgezonden.
- **Spoilerpreventie:** Gebruik **Blur Unwatched Episodes** (Detailpagina) en **Blur Unwatched in Continue Watching** zodat miniaturen geen belangrijke plotwendingen onthullen.
- **Miniatuurvoorkeuren:** Schakel **Prefer/Use Episode Thumbnails** in/uit om prioriteit te geven aan specifieke stilstaande beelden van afleveringen boven de algemene achtergrond van de serie.
- **Sorteervolgorde:** Sorteer je "Verder kijken"-wachtrij op **Default** (op basis van recentheid) of **Streaming Style** (uitgebrachte afleveringen krijgen prioriteit, waarbij toekomstige, nog niet uitgezonden afleveringen naar het einde worden verplaatst).
- **Resume Prompt on Launch:** Toont een pop-up om verder te gaan waar je bent gebleven wanneer je de app opnieuw opent nadat je de player hebt afgesloten.

### Mobiele App
- **Poster Card Style:** Pas de "Verder kijken"-rij aan door te schakelen tussen de stijlen **Card** (TV-stijl), **Wide** (informatierijk) of **Poster** (gericht op artwork).

### TV-App
*(De "Verder kijken"-kaarten op TV passen zich automatisch aan de gekozen weergave van het startscherm aan).*

[Terug naar boven](#cross-platform-ui-en-aanpassingsgids)

---

### Snelnaslag: Platformvergelijking

| Feature | Mobiele App | TV-App |
| :--- | :--- | :--- |
| **Pure Black Surfaces** | AMOLED Black (Globale schakelaar) | Fijnmazig (Achtergronden vs. Panelen) |
| **Catalogusbeheer** | Collections verbergen, vergrendelen of vastpinnen | Collections verbergen, vergrendelen of vastpinnen |
| **Startschermlay-out** | Verticaal scrollende rijen | Selecteerbare Modern-, Grid- of Classic-weergaven |
| **Hero-secties** | Interactieve carrousel bovenaan | Dynamisch (Modern) of Roterende carrousel (Classic/Grid) |
| **Poster-aanpassingen** | Grootte-presets + Liggend + Labels verbergen | Grootte-presets + Liggend + Uitklappen naar achtergrond |
| **Zijbalknavigatie** | Menu onderaan / Hamburger-menu | Zwevende Modern Sidebar (Inklapbaar) |
| **Lay-out detailpagina** | UI-secties en tabbladen herordenen | Externe metadata-schakelaars & trailers automatisch afspelen |
| **Verder kijken** | Selecteerbare stijlen (Card, Wide of Poster) | Past zich automatisch aan de gekozen startschermlay-out aan |

[Terug naar boven](#cross-platform-ui-en-aanpassingsgids)
