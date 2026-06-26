# WebOS Installatie [WebOS Only]

WebOS vereist het sideloaden van de applicatie via de Ontwikkelaarsmodus. Deze gids biedt twee opties voor het installeren van Nuvio: automatisch via de Nuvio Installer, of handmatig via de WebOS Dev Manager.

>[!NOTE]
> WebOS-ondersteuning wordt continu verbeterd, maar kan kleine beperkingen hebben in vergelijking met Android TV.

## Optie 1: Nuvio Installer (Geautomatiseerd)
De officiële installer biedt een vereenvoudigde manier om Nuvio rechtstreeks op je TV te installeren zonder handmatig pakketten te hoeven downloaden of WebOS Dev Manager te gebruiken.

### 1. Schakel de Ontwikkelaarsmodus in op je TV
  - Open op je LG TV de **Content Store** (of Apps).
  - Zoek naar en installeer de **Developer Mode** app.
  - Open de Developer Mode app. Je wordt gevraagd om in te loggen met een LG Developer-account. Als je er geen hebt, maak er een aan op het LG Developer portaal.
  - Na het inloggen, zet **Dev Mode Status** op AAN. De TV zal herstarten.
  - Open na het herstarten de Developer Mode app opnieuw en zet **Key Server** op AAN.

### 2. Voer de Nuvio Installer uit
  - Download en voer de nieuwste `Nuvio-WebTV-Installer` uit van de [Officiële Nuvio Releases](https://github.com/NuvioMedia/NuvioWeb/releases/latest).
    - *(macOS-gebruikers: Als de app geblokkeerd is, verplaats deze naar Applications en voer `xattr -dr com.apple.quarantine "/Applications/Nuvio WebTV Installer.app"` en `codesign --force --deep --sign - "/Applications/Nuvio WebTV Installer.app"` uit in de terminal).*
    - *Windows-gebruikers: Als de app geblokkeerd is, klik op "Meer info" en vervolgens "Toch uitvoeren"*
  - Selecteer **LG WebOS** op het "Selecteer je TV OS" scherm.
  - Kies **Eenvoudige installatie (Aanbevolen)** om automatisch de nieuwste versie van GitHub op te halen.
  - Voer op het configuratiescherm je **TV IP-adres** in.
  - Voer je **Developer Mode Wachtwoord** in (te vinden in de Developer Mode app op je TV, vereist voor de eerste verbinding).
  - Klik op **Installeren** en wacht tot het proces is voltooid.

---

## Optie 2: Homebrew Channel

Het **webOS Homebrew Channel** fungeert als een onofficiële app store rechtstreeks op je TV. Hoewel het een PC vereist voor de initiële installatie, kun je hierna Nuvio rechtstreeks vanaf je TV installeren en updaten.

### 1. Installeer het Homebrew Channel via PC
  - Schakel de Ontwikkelaarsmodus in op je TV
  - Open de **Content Store** (of Apps) op je LG TV.
  - Zoek naar en installeer de **Developer Mode** app.
  - Open de app en log in met een LG Developer-account (maak er indien nodig een aan op het LG Developer portaal).
  - Zet **Dev Mode Status** op AAN. De TV zal herstarten.
  - Open de Developer Mode app opnieuw en zet **Key Server** op AAN.

### 2. Verbind met WebOS Dev Manager
  - Download en open op je computer [webOS Dev Manager](https://github.com/webosbrew/dev-manager-desktop/releases).
  - Klik op **Add Device**.
  - Voer het **IP-adres** en **Wachtwoord** in die worden weergegeven in de Developer Mode app op je TV.
  - Volg de aanwijzingen om het koppelen te voltooien.

### 3. Installeer het Homebrew Channel
  - Navigeer in de webOS Dev Manager op je PC naar het **Homebrew** tabblad of zoek in de catalogus.
  - Zoek het **Homebrew Channel** en installeer het op de TV.

### 4. Installeer Nuvio
  - Start het **Homebrew Channel** vanuit de app-lijst van je TV.
  - Navigeer naar het **Zoeken** of **Repository** tabblad.
  - Typ **Nuvio** in.
  - Selecteer de applicatie en klik op **Installeren**.
  - Nuvio verschijnt nu in je standaard webOS app-menu.

> [!TIP]
> LG Developer Mode sessies verlopen (meestal na 999 uur). Als de timer afloopt, kunnen het Homebrew Channel en Nuvio niet meer starten. Om dit te voorkomen, schakel de achtergrond auto-vernieuwingsfunctie in die is ingebouwd in webOS Dev Manager op je PC.

---

## Probleemoplossing
- **Sessie verlopen:** Developer Mode sessies verlopen na een bepaalde tijd (meestal 999 uur of minder). Als dit gebeurt, kunnen je apps verdwijnen of niet meer starten. Open de Developer Mode app en klik op **Extend Session** om de timer te vernieuwen.
- **Verbindingsproblemen:** Zorg ervoor dat zowel je TV als PC op hetzelfde lokale netwerk zijn verbonden.
