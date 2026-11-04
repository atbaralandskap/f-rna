# Handover

## Syfte

Det här dokumentet är till för nästa person som ska förvalta Förnas webbplats. Målet är att det ska vara lätt att förstå hur sajten fungerar, vad som är publicerat och vilka filer som är viktiga att känna till.

## Kort om sajten

- Sajten är statisk och byggs med Quarto.
- Publicerad webb ligger i `docs/` och hostas via GitHub Pages.
- Innehållet skrivs främst i `.qmd`-filer i repots rot.
- Plantskolan är stängd. Beställningar hänvisas till Fabian via telefon; webbplatsens köpflöde är inaktiverat.

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
- `kassa.qmd`: stängt-besked och telefonnummer för gamla kassalänkar

### Stil

- `site-theme.css`: sajtens huvudtema
- `assets/css/shop.css`: katalog, varukorg och checkout
- `shop/checkout.css`: extra layout för checkout

### Checkout och butik

Koden nedan finns kvar för eventuell framtida återanvändning. Plantskole- och kassasidan laddar inga butiksskript och kassan har inget beställningsformulär.

- `assets/js/store.js`: varukorg, summering och mängdrabatt
- `assets/js/catalog.js`: kopplar produktlistan till varukorgen
- `shop/cart-page.js`: renderar varukorgen
- `shop/checkout-page.js`: bygger beställningen och öppnar mejlutkast
- `shop/email-config.js`: mottagare, pickup-text och checkout-läge

## Beställningsflöde just nu

- Ring Fabian på `0766-148318` för ett gott snack och en beställning.
- Prislistor, mängdrabatter och bilder finns kvar; aktuella priser och tillgänglighet bekräftas i samtalet.
- Alla produktrader har grå, inaktiverade köpknappar. Telefonhänvisningen finns överst på plantskolesidan.
- Menyn visar att plantskolan är stängd och innehåller ingen varukorgslänk.
- Gamla länkar till `kassa.html` visar ett stängt-besked och Fabians telefonnummer, även för besökare med en sparad varukorg.

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
