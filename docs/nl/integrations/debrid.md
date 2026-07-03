# Debrid-integration

Nuvio maakt gebruik van een gecentraliseerde architectuur voor Debrid-integration. In plaats van persoonlijke API-sleutels door te geven aan afzonderlijke P2P-scraping-addons, worden accounts rechtstreeks gekoppeld binnen de core Nuvio Android- en TV-applicatie. Nuvio onderschept de ruwe P2P-hashes van je geconfigureerde addons, controleert de beschikbaarheid van de cache en verwerkt de linkresolutie native door de addon te omhullen in je Debrid-dienst.

> [!IMPORTANT]
> Nuvio's Debrid-integration (TorBox of Premiumize) lost alleen links op — het kan deze niet zelf genereren. Je moet ten minste één **P2P-compatibele** scraper-addon (zoals AIOStreams, Comet, of Torrentio) hebben geïnstalleerd en correct hebben geconfigureerd, anders heeft Nuvio niets om te omhullen en op te lossen.

>[!NOTE]
>Herinnering: Dit project is niet officieel. Neem geen contact op met Nuvio-developers over problemen met deze wiki.

---

### Stap 1: Toegang tot verbonden diensten
Om te beginnen met het configureren van je Debrid-provider, open je de applicatie en navigeer je naar **Instellingen** > **Integrations** > **Connected Services** (Verbonden diensten). Dit menu beheert accounts voor links en toegang tot bibliotheken.

### Stap 2: Een account koppelen & Eerste instellingen
Standaard worden je Debrid-providers als niet-gekoppeld weergegeven en zijn de kernfuncties uitgeschakeld. 

1. Selecteer onder het gedeelte **Accounts** ofwel **Torbox** of **Premiumize**. Nuvio zal je vragen de accountautorisatie te voltooien via een browservenster.
2. Zodra de authenticatie is voltooid, verandert de status in **Connected** (Verbonden).
3. Onder het gedeelte **Connected Services** schakel je de optie **Cloud library** naar **Aan** (On) als je mediabestanden wilt bekijken en afspelen die al rechtstreeks in de cloudopslag van je provider zijn opgeslagen.
4. Schakel **Resolve playable links** naar **Aan** (On). Dit stelt Nuvio in staat om actief afspeelbare streaming-links van je provider aan te vragen bij het ophalen van resultaten.

[Terug naar boven](#debrid-integration)

---

### Stap 3: AIOStreams & P2P-addons configureren
Nuvio heeft eerst een bron nodig om de magnet-links te scrapen. Je moet je scraper-addons configureren **zonder** een Debrid-API-sleutel en strikt in **P2P-modus**. 

* [Gedetailleerde instructies over het configureren van een P2P-addon vind je hier](./addons.md)

[Terug naar boven](#debrid-integration)

---

### Stap 4: Linkvoorbereiding & prestaties optimaliseren
Wanneer een provider actief is, komt het gedeelte **Link Preparation** (Linkvoorbereiding) beschikbaar. 

* **Prepare links**: Schakel dit **Aan** (On) om afspeelbare streams onmiddellijk op te lossen voordat je op afspelen drukt, waardoor buffervertragingen tot een minimum worden beperkt.
* **Links to prepare**: Als je hierop klikt, wordt er een configuratiemenu geopend. Je kunt kiezen uit **1, 2, 3 of 5 links** om gelijktijdig op te lossen. 

> [!WARNING]
> **Belangrijke rate-limit waarschuwing:** 
> Het wordt ten zeerste aanbevolen om een laag aantal links te gebruiken (zoals 2 links). Debrid-providers hanteren strikte limieten (rate-limits) voor het aantal resolutieverzoeken dat in een bepaald tijdsbestek kan worden verwerkt. Alleen al het openen van een film- of afleveringsdetailpagina haalt headers op en telt mee voor die limieten — zelfs als je niet op "Watch" (Kijken) drukt — omdat de links actief van tevoren worden voorbereid.

[Terug naar boven](#debrid-integration)

---

### Stap 5: Fijnmazig resultaatbeheer
Nuvio biedt diepgaande filter- en sorteerconfiguraties onder het gedeelte **Result Management** (Resultaatbeheer) om precies te bepalen hoe gescrapete streams worden geïndexeerd en gepresenteerd:

#### Scraping- & capaciteitslimieten
* **Max results**: Beperkt het totale aantal weergegeven items (bijv. *All results*).
* **Sort results**: Bepaalt de primaire rangschikkingsvolgorde (bijv. *Original order*).
* **Per resolution / quality limit**: Beperkt herhalende varianten (bijv. dubbele 2160p- of REMUX-resultaten) om lange resultatenlijsten op te schonen.
* **Size range**: Filtert bestanden die buiten specifieke bestandsgroottegrenzen vallen.

#### De drielaagse filterarchitectuur
Voor vrijwel elke media-eigenschap maakt Nuvio gebruik van een strikt prioriteitssysteem dat is onderverdeeld in **Preferred** (Voorkeur - bovenaan gesorteerd), **Required** (Vereist - verplicht om te tonen) en **Excluded** (Uitgesloten - volledig verborgen). Deze instellingen zijn direct onder de capaciteitslimieten te vinden in het gedeelte **Result Management**:

| Media-eigenschap | Configuratiebereik |
| :--- | :--- |
| **Resoluties** | 4K (2160p), 1080p, 720p, etc. |
| **Kwaliteiten** | BluRay, WEB-DL, REMUX, HDTV, etc. |
| **Visuele tags** | Dolby Vision (DV), HDR, 10bit, IMAX, SDR, 3D. |
| **Audiotags** | Atmos, TrueHD, DTS, AAC, etc. |
| **Kanaallay-outs** | 7.1, 5.1, Stereo, etc. |
| **Encoderingen** | AV1, HEVC (H.265), AVC (H.264). |
| **Talen & Groepen** | Audiotaalsporen en specifieke release-groepstags. |

[Terug naar boven](#debrid-integration)

---

### Stap 6: Metadata & UI-opmaak
Onderaan het Connected Services-menu kun je in het gedeelte **Formatting** (Opmaak) de lay-out van de scraper-resultaten aanpassen met behulp van variabelen:

* **Name template**: Past aan hoe de titel en hoofdtekst van de stream-resultaten verschijnen. Als je dit leeg laat, wordt standaard de ruwe naam gebruikt die door de scraper wordt geleverd.
* **Description template**: Bepaalt de weergave en structuur van de metadata (bitrate, grootte, codectags) die onder elk resultaat wordt getoond.

[Terug naar boven](#debrid-integration)

---

## Gids voor Debrid-diensten

Debrid-diensten zijn snelle downloaders die bestanden ophalen van hosters en torrents, en deze vervolgens naar jou streamen via een veilige verbinding met hoge bandbreedte.

#### 1. TorBox (TB)
Een snelgroeiende dienst die uitblinkt in Usenet-ondersteuning (alleen pro-abonnement) naast traditionele torrent-debrid.
* **Voordelen:** Geen limiet op IP-gebruik, native Usenet-ondersteuning (pro-niveau), snelle caching, moderne API.
* **Nadelen:** Nieuwere dienst, kan stabiliteitsproblemen hebben.
* **Abonnementen & Prijzen:** 
  * **Essential:** ~$3.00/maand of ~$33.00/jaar: Aanbevolen voor de meeste gebruikers
  * **Standard:** ~$5.00/maand of ~$55.00/jaar
  * **Pro:** ~$10.00/maand of ~$110.00/jaar: Biedt toegang tot Usenet
* **Aanbiedingen & Kortingen:** Gebruikers kunnen een verwijzingsbonus (referral) ontvangen bij hun eerste aankoop, wat 7 dagen extra gratis tijd oplevert per gekochte maand. Jaarabonnementen in combinatie met kortingscodes en cryptobetalingen kunnen de maandelijkse kosten aanzienlijk verlagen. TorBox biedt doorgaans 30% korting tijdens Black Friday. 
* **Installatie:** [torbox.app/settings](https://torbox.app/subscription?referral=41d1ac85-ee5e-4699-9f0a-92e67cbc2fb2)

#### 2. Premiumize (PM)
Een premium alles-in-één dienst die een persoonlijke cloud en een ingebouwde VPN bevat.
* **Voordelen:** Persoonlijke cloudopslag, limiet van 1 TB, ingebouwde VPN, staat meerdere IP-adressen toe.
* **Nadelen:** Duurder dan RD/AD. Maakt gebruik van een puntensysteem dat neerkomt op ongeveer 1 TB per maand.
* **Abonnementen & Prijzen:**
  * **1 Maand:** 9.99 EUR (ong. $11.99 USD)
  * **3 Maanden:** 24.99 EUR (ong. $29.99 USD)
  * **1 Jaar:** 69.99 EUR (ong. $79.99 USD)
* **Aanbiedingen & Kortingen:** Premiumize heeft meestal grote aanbiedingen rond Black Friday en Cyber Monday. Ze bieden vaak 2-jarige of 3-jarige pakketten aan met hoge kortingen, zoals $109 of $139 USD.
* **Installatie:** [premiumize.me/device](https://premiumize.me)

#### 3. OffCloud
Maakt gebruik van de PM-cache, maar zonder de extra Premiumize-diensten.
* **Voordelen:** Gebruikt de cache van Premiumize, betaalbaarder dan Premiumize, geen IP-limiet.
* **Nadelen:** Heeft een maandelijkse limiet van 1 TB.
* **Abonnementen & Prijzen:** 
  * **Early Access Maandelijks:** $4.99/maand
  * **Early Access Jaarlijks:** $39.99/jaar
  * **Standaard Maandelijks:** $9.99/maand
  * **Standaard Jaarlijks:** $79.99/jaar
* **Aanbiedingen & Kortingen:** In het verleden verkocht OffCloud regelmatig een "Lifetime Subscription" (levenslang abonnement) voor ongeveer $39,99 via platforms van derden zoals StackSocial. Na een overname worden er geen levenslange abonnementen meer aangeboden en zijn bestaande levenslange accounts beperkt tot een maximale duur van één jaar.
* **Installatie:** [offcloud.com](https://offcloud.com/#pricing)

#### 4. Real-Debrid (RD)

> [!WARNING]
> Real-Debrid heeft onlangs te maken gehad met juridische problemen, waardoor een groot aantal bestanden nu wordt geblokkeerd. Je ervaringen kunnen variëren op basis van het gebruik van deze dienst.

* **Voordelen:** Betaalbare, snelle servers.
* **Nadelen:** Strikte 1 IP-regel (kan niet op twee verschillende internetverbindingen tegelijk worden gebruikt), wisselende blokkades van inhoud.
* **Abonnementen & Prijzen:** 
  * **15 Dagen:** 3.00 EUR
  * **30 Dagen:** 4.00 EUR
  * **90 Dagen:** 9.00 EUR
  * **180 Dagen:** 16.00 EUR
* **Aanbiedingen & Kortingen:** Real-Debrid biedt geen gratis proefversies, promoties, seizoensgebonden aanbiedingen of kortingen aan.
* **Installatie:** [real-debrid.com/device](https://real-debrid.com/)

#### 5. AllDebrid (AD)
Een zeer betrouwbaar alternatief voor Real-Debrid met uitstekende klantenservice en browserextensies.
* **Voordelen:** Hoge betrouwbaarheid, hoge snelheden, ondersteunt veel hosters.
* **Nadelen:** Kleinere cache dan andere diensten. Maximaal 1 IP-adres tegelijk.
* **Abonnementen & Prijzen:** 
  * **Gratis proefversie:** 7 dagen (telefoonverificatie vereist)
  * **30 Dagen (Terugkerend):** 2.99 EUR/maand
  * **30 Dagen (Eenmalig):** 3.99 EUR
  * **90 Dagen:** 8.99 EUR
  * **180 Dagen:** 15.99 EUR
  * **300 Dagen:** 24.99 EUR
* **Aanbiedingen & Kortingen:** Ze bieden af en toe seizoensgebonden aanbiedingen aan, zoals tijdens Black Friday en Kerst. Betalen met Bitcoin levert een permanente korting van 10% op.
* **Installatie:** [alldebrid.com/pin](https://alldebrid.com)

[Terug naar boven](#debrid-integration)

### Waarom Debrid gebruiken?
1. **Geen buffering:** Streams worden geleverd vanuit snelle datacenters, niet via peer-to-peer.
2. **Kwaliteit:** Toegang tot enorme 4K/Remux-bestanden (60 GB+) die onmogelijk te streamen zijn via standaard openbare links.
3. **Veiligheid:** De Debrid-dienst downloadt de torrent op hun servers; jij downloadt/streamt alleen een beveiligd, versleuteld bestand van hen.

> [!IMPORTANT]
> Het wordt ten zeerste aanbevolen om een Debrid-dienst te gebruiken voor de veiligheid en de beste ervaring.

[Terug naar boven](#debrid-integration)

### Installatiestappen
1. **Neem een account:** Registreer je op de respectievelijke website.
2. **Haal de API-sleutel op / Autoriseer:** Volg de autorisatiestappen van de individuele provider.
3. **Configureer addons:** De meeste Nuvio-addons zullen je Debrid-dienst automatisch detecteren zodra deze gekoppeld is.

[Terug naar boven](#debrid-integration)

### Troubleshooting
* **"No Streams Found":** Controleer of je abonnement is verlopen of dat de addon jouw specifieke dienst ondersteunt.
* **"Authorization Failed":** Zorg ervoor dat je bent ingelogd op de website in je browser voordat je de apparaatcode invoert.

[Terug naar boven](#debrid-integration)
