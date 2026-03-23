# Handover

## Syfte

Det här dokumentet är till för nästa person som ska förvalta Förnas webbplats. Målet är att det ska vara lätt att förstå hur sajten fungerar, vad som är publicerat och vilka filer som är viktiga att känna till.

## Kort om sajten

- Sajten är statisk och byggs med Quarto.
- Publicerad webb ligger i `docs/` och hostas via GitHub Pages.
- Innehållet skrivs främst i `.qmd`-filer i repots rot.
- Beställningar går just nu via `mailto`, inte via en extern backend.

## Viktiga beslut

- GitHub Pages publiceras från `docs/`.
- Custom domain styrs via `docs/CNAME` och ska behållas.
- Interna repoanteckningar ska inte renderas ut på den publika sajten.
- Beställningsflödet ska vara enkelt, läsbart och möjligt att driva vidare utan extern driftmiljö.

## Så jobbar du med sajten

### Förhandsgranska lokalt

```powershell
cd c:\atbara_landskap\f-rna
quarto preview
```

### Bygg för publicering

```powershell
quarto render
```

Kontrollera direkt efter render:

```powershell
Get-Content docs\CNAME
```

Det ska fortfarande stå:

```text
xn--frna-5qa.se
```

## Var du ändrar vad

### Innehåll

- `index.qmd`: startsida
- `about.qmd`: om Förna
- `uppdrag.qmd`: uppdrag och riktning
- `produkter.qmd`: plantskola och prislista
- `tjanster.qmd`: tjänster
- `samskapardagar.qmd`: samskapardagar
- `partners.qmd`: partners
- `kontakt.qmd`: kontaktuppgifter
- `kassa.qmd`: beställningssida

### Stil

- `site-theme.css`: sajtens huvudtema
- `assets/css/shop.css`: katalog, varukorg och checkout
- `shop/checkout.css`: extra layout för checkout

### Checkout och butik

- `assets/js/store.js`: varukorg, summering och mängdrabatt
- `assets/js/catalog.js`: kopplar produktlistan till varukorgen
- `shop/cart-page.js`: renderar varukorgen
- `shop/checkout-page.js`: bygger beställningen och öppnar mejlutkast
- `shop/email-config.js`: mottagare, pickup-text och checkout-läge

## Beställningsflöde just nu

- Fabian är primär mottagare för plantskolans beställningar.
- Beställningar går till `fabian.ryft@gmail.com`.
- Intern kopia kan skickas dolt till `henrik@gislab.se`.
- Kunden skickar sitt eget mejl och använder sedan det som kvitto/orderkopia tills Fabian återkopplar.
- Mängdrabatt räknas automatiskt i varukorg och checkout.

## Om ni vill gå över till EmailJS senare

Koden är förberedd för det, men kräver:

1. EmailJS-konto och tjänst
2. två mallar, en till säljare och en till kund
3. nycklar och template-id i `shop/email-config.js`
4. genomgång av den mänskliga tonen i båda mallarna

Tips:
- Återanvänd gärna samma ton som nu används i `mailto`-utkastet.
- Håll kundkopian varm, tydlig och lätt att spara.

## Publiceringschecklista

1. Kör `quarto preview` om du gjort större ändringar.
2. Kör `quarto render`.
3. Verifiera `docs/CNAME`.
4. Kontrollera att relevanta filer i `docs/` har uppdaterats.
5. Commit med tydligt meddelande.
6. Push till `main`.

## Vad som har städats bort

- Äldre interna planfiler publiceras inte längre på den publika sajten.
- Gammal oanvänd CSS och äldre checkout-prototyper är borttagna.
- README och handover-dokumentationen är uppdaterade för att repot ska vara lättare att ta över.