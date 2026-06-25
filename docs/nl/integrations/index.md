# Nuvio Integraties Overzicht

Nuvio ondersteunt een modulair integratiesysteem dat is ontworpen om linkresolutie, metadata-verrijking en synchronisatie van de kijkstatus native binnen de applicatie te verwerken door deze verbindingen te centraliseren.

Deze map bevat de documentatie voor het configureren en optimaliseren van alle externe diensten die door Nuvio worden ondersteund.

>[!NOTE]
>Herinnering: Dit project is niet officieel. Neem geen contact op met Nuvio-ontwikkelaars over problemen met deze wiki.

---

## Integratiecategorieën

### 1. Debrid-diensten (Linkresolutie)
Nuvio onderschept ruwe P2P-hashes van je geconfigureerde sleutelloze add-ons en gebruikt je verbonden debrid-provider om bestanden met een hoge bandbreedte veilig op te lossen, te cachen en te streamen.
- **Ondersteunde providers:** TorBox, Premiumize.
- **Belangrijkste functies:** Native cache-controle, gelijktijdige linkvoorbereiding en fijnmazige filtering op resolutie, kwaliteit en audio-/videotags.
- **[Lees de Debrid-integratiegids](./debrid.md)**

### 2. Metadata-verrijking
Verbeter de standaard scraping-resultaten met hoogwaardige visuele assets en samengevoegde beoordelingsscores.
- **TMDB:** Voorziet Nuvio van artwork met hoge resolutie, afleveringstitels, castdetails, trailers en gelokaliseerde beschrijvingen.
- **MDBList:** Verzamelt scores van critici en publiek van externe platforms (IMDb, Rotten Tomatoes, Metacritic, Letterboxd) rechtstreeks op de detailpagina's van Nuvio.
- **[Lees de Metadata- & Trackinggids](./tmdb-mdblist-trakt.md)**

### 3. Kijkgedrag bijhouden & synchroniseren
Houd je kijkgeschiedenis en aangepaste lijsten gesynchroniseerd op al je apparaten.
- **Trakt (In-App):** Synchroniseert native je kijkvoortgang, scrobbles en aangepaste lijsten. Kan worden geconfigureerd om naast of onafhankelijk van Nuvio's interne synchronisatie-engine te draaien. *Biedt ook "Vergelijkbaar met dit"-aanbevelingen*.
- **[Lees de Metadata- & Trackinggids](./tmdb-mdblist-trakt.md)**
