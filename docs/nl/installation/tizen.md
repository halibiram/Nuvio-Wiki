# Tizen Installatie [Tizen Only]

Tizen vereist het sideloaden van de applicatie via de Ontwikkelaarsmodus. Deze gids begeleidt je bij het installeren van Nuvio met behulp van de geautomatiseerde Nuvio Installer of de handmatige methode (TizenBrew Installer).

>[!NOTE]
> Tizen-ondersteuning wordt continu verbeterd, maar kan kleine beperkingen hebben in vergelijking met Android TV.

## Optie 1: Nuvio Installer (Geautomatiseerd)
De officiële installer automatiseert het downloaden van pakketten en het genereren van certificaten, wat een gestroomlijnd proces biedt.

### 1. Schakel de Ontwikkelaarsmodus in op je TV
  - Navigeer op je Samsung TV naar het **Apps** gedeelte.
  - Druk op `1`, `2`, `3`, `4`, `5` op je afstandsbediening om de Ontwikkelaarsmodus-prompt te openen.
  - Zet **Developer Mode** op AAN.
  - Voer het **IP-adres** in van de PC die je gebruikt om de app te installeren.
  - Herstart de TV (houd de aan/uit-knop op de afstandsbediening ingedrukt totdat de TV uit- en weer inschakelt).

### 2. Voer de Nuvio Installer uit
  - Download en voer de nieuwste `Nuvio-WebTV-Installer` uit van de [Officiële Nuvio Releases](https://github.com/NuvioMedia/NuvioWeb/releases/latest).
    - *macOS-gebruikers: Als de app geblokkeerd is, verplaats deze naar Applications en voer `xattr -dr com.apple.quarantine "/Applications/Nuvio WebTV Installer.app"` en `codesign --force --deep --sign - "/Applications/Nuvio WebTV Installer.app"` uit in de terminal.*
    - *Windows-gebruikers: Als de app geblokkeerd is, klik op "Meer info" en vervolgens "Toch uitvoeren"*
  - Selecteer **Samsung Tizen** op het "Selecteer je TV OS" scherm.
  - Kies **Eenvoudige installatie (Aanbevolen)** om automatisch de nieuwste versie op te halen.
  - Voer op het configuratiescherm je **TV IP-adres** in.
  - Klik op **Installeren**. Je wordt gevraagd om in te loggen met je Samsung-account tijdens de installatie om automatisch de vereiste ontwikkelaarscertificaten te genereren.

---

## Optie 2: TizenBrew Installer
De TizenBrew Installer is een desktop-app die apps rechtstreeks op je Samsung TV kan installeren via een GitHub-repository — zonder Tizen Studio of handmatige certificaten.

### 1. Schakel de Ontwikkelaarsmodus in op je TV
  - Navigeer op je Samsung TV naar het **Apps** gedeelte.
  - Druk op `1`, `2`, `3`, `4`, `5` op je afstandsbediening om de Ontwikkelaarsmodus-prompt te openen.
  - Zet **Developer Mode** op AAN.
  - Voer onder **Host PC IP** het IP-adres van je PC in.
  - Klik op **OK** en herstart je TV.

### 2. Download en voer TizenBrew Installer uit
  - Download de nieuwste TizenBrew Installer voor jouw besturingssysteem van de [TizenBrewInstaller releases-pagina](https://github.com/reisxd/TizenBrewInstaller/releases/latest).
  - Voer het programma uit.
    - *macOS/Linux-gebruikers: Je moet het mogelijk eerst uitvoerbaar maken: chmod +x tizenbrew-installer-os-arch*

### 3. Installeer Nuvio
  - Wanneer er om een GitHub-repository wordt gevraagd, voer in: `NuvioMedia/NuvioWeb`
  - Klik op **Installeren**.
    - *Tizen 7 of nieuwer: Je wordt gevraagd om in te loggen met je Samsung-account om het vereiste certificaat te genereren.*
  - Nuvio verschijnt in de app-lijst van je TV zodra het proces is voltooid.

---

## Probleemoplossing
- **Installatie mislukt met certificaatfout:** Zorg ervoor dat je het certificaat hebt gegenereerd *terwijl* de TV verbonden was, aangezien het certificaat de unieke DUID van de TV nodig heeft.
- **SDB-verbinding mislukt:** Controleer nogmaals of de Ontwikkelaarsmodus is ingeschakeld op de TV en of het Host PC IP-adres dat in de TV is ingevoerd overeenkomt met het daadwerkelijke IP-adres van je PC.
