# Add-ons-gids

Add-ons vormen het hart van de Nuvio-ervaring. Ze leveren de inhoud en functionaliteit die de app nuttig maken.

>[!WARNING]
> Deze Wiki keurt het gebruik van niet-gelicentieerd auteursrechtelijk beschermd materiaal niet goed.

>[!NOTE]
>Herinnering: Dit project is niet officieel. Neem geen contact op met Nuvio-ontwikkelaars over problemen met deze wiki.

## Type add-ons

Er zijn 3 hoofdtypen add-ons voor Nuvio:
  - **Content Providers:** Deze halen streams op voor films, series of anime.
  - **Metadata Providers:** Verbeteren de gebruikersinterface met posters, beoordelingen en samenvattingen.
  - **Utility Addons:** Bieden extra functies zoals ondertiteling of afspeelsynchronisatie.

[Terug naar boven](#add-ons-gids)

## Hoe voeg je een add-on toe

Om een add-on toe te voegen, heb je meestal een manifest-URL nodig die je van de add-on krijgt:
- Deze wordt gegenereerd bij het configureren van de add-on.
- Het gegenereerde manifest plak je in het tabblad add-ons van Nuvio.

[Terug naar boven](#add-ons-gids)

---

## Een add-on configureren voor gebruik met Nuvio Debrid-integratie

---

### AIOStreams & P2P-add-ons configureren
Om ervoor te zorgen dat Nuvio links kan oplossen, is er eerst een bron nodig om magnet-links te scrapen. Je moet je scraper-add-ons configureren **zonder** een Debrid-API-sleutel en strikt in **P2P-modus**. Als een scraper-add-on zelf links oplost (omdat er een Debrid-sleutel is ingevoerd), ziet Nuvio nooit een hash om te verwerken, waardoor je TorBox/Premiumize-koppeling uit stap 1 en 2 effectief wordt omzeild.

#### Directe P2P-installatiegenerator

<P2PGenerator />

> [!TIP]
> De bovenstaande generator lost het volledige **Tam-Taro Complete SEL (TAMS)**-sjabloon op voor de P2P-modus, zonder debrid-diensten, met P2P ingesteld op Required (Vereist), uitgesloten debrid-streamtypen en een gecureerde set P2P-scrapers. Het kan een configuratie-JSON downloaden om te importeren, of rechtstreeks naar je instantie pushen om een manifest-URL te genereren die je in Nuvio plakt. Gebruik de **Simple (eenvoudige) modus** voor aanbevolen standaarden, of schakel over naar de **Advanced (geavanceerde) modus** voor volledige controle.

#### AIOStreams configureren voor P2P (Handmatig)
1. **Kies een instantie.** Open de configuratiepagina van de AIOStreams-instantie die je wilt gebruiken (een zelfgehoste instantie of een openbare instantie die P2P expliciet toestaat). De officiële openbare ElfHosted-instantie schakelt P2P- en HTTP-streams standaard uit om juridische redenen, dus deze werkt niet voor deze installatie — je hebt een eigen/zelfgehoste instantie of een alternatieve openbare instantie nodig die P2P toestaat.
2. **Sla het Services-menu over.** Navigeer naar het **Services**-menu en laat dit leeg — voeg hier geen inloggegevens of sleutels toe voor TorBox, Premiumize, Real-Debrid of andere debrid-diensten en schakel ze niet in. Als je een sleutel invoert in AIOStreams zelf, zal het reeds opgeloste/gecachte debrid-links retourneren in plaats van ruwe P2P-hashes. Dit omzeilt de eigen resolutie-logica van Nuvio en kan de limieten (rate limits) van je provider verbruiken buiten de controle van Nuvio om.
3. **Schakel P2P in bij Stream Types / Filters.** Navigeer naar het menu Stream Types (of Filters) en zorg ervoor dat **P2P** is ingeschakeld en is ingesteld op ten minste **Preferred** (Voorkeur), idealiter **Required** (Vereist). Schakel in hetzelfde menu de debrid-streamtypen **Cached** en **Uncached** uit of sluit ze uit, zodat AIOStreams alleen magnet-resultaten retourneert.
4. **Sla op en genereer je manifest.** Gebruik het menu Save & Install (of het equivalent daarvan) om je sleutelloze AIOStreams-manifest-URL te genereren.
5. **Installeer in Nuvio.** Voeg de gegenereerde manifest-URL toe als een add-on binnen Nuvio, op dezelfde manier als elke andere add-on-bron.

#### Andere add-ons (bijv. Comet, Torrentio)
Als je een Comet-instantie, Torrentio of een soortgelijke scraper native draait naast of in plaats van AIOStreams:
1. Open de configuratie-/instellingenpagina van die add-on.
2. Zorg ervoor dat er geen veld voor een Debrid-dienst, API-sleutelveld of de optie voor "gecachte" streams is ingevuld of ingeschakeld.
3. Controleer of de modus van de add-on is ingesteld op het uitvoeren van ruwe P2P-links (dit is soms gelabeld als "P2P" of is simpelweg de standaardstatus wanneer er geen debrid-inloggegevens aanwezig zijn).
4. Installeer de resulterende sleutelloze add-on-URL in Nuvio.

Zonda een werkende P2P-add-on is geïnstalleerd, zal het selecteren van een titel ervoor zorgen dat de add-on P2P-swarms zoekt, en Nuvio verwerkt deze ruwe hashes vervolgens automatisch via je gekoppelde TorBox- of Premiumize-account om veilig te streamen.

> [!NOTE]
> **Advies over beschikbaarheid van P2P:** 
> Niet all instanties of add-ons bieden toegang tot P2P. Veel openbare gehoste instanties blokkeren P2P-scraping expliciet (inclusief de officiële openbare ElfHosted-instantie van AIOStreams). Zorg ervoor dat de AIOStreams- of Comet-instantie die je gebruikt P2P-verbindingen toestaat, zodat Nuvio de benodigde hashes ontvangt.

[Terug naar boven](#add-ons-gids)
