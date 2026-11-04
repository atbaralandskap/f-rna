# Förna

Förna är en statisk Quarto-webbplats för Förnas verksamhet med information om plantskolan, tjänster och samskapardagar. Plantskolan är stängd och beställningar hänvisas till Fabian via telefon. Prislistor och bilder finns kvar.

Live:
- `https://förna.se`
- GitHub Pages publiceras från `docs/`

## Teknik

- Quarto för innehåll och rendering
- GitHub Pages för publicering
- Statiska prislistor med inaktiverade köpknappar och telefonlänkar
- Tidigare JavaScript-butik finns kvar i källkoden men laddas inte på plantskole- eller kassasidan

## Kom igång lokalt

```powershell
cd c:\atbara_landskap\f-rna
quarto preview
```

Quarto startar då en lokal server och visar en `localhost`-adress i terminalen.

## Vanligt arbetsflöde

1. Uppdatera innehåll i `.qmd`-filerna.
2. Justera stil i `site-theme.css` eller butikens CSS i `assets/css/shop.css`.
3. Testa lokalt med `quarto preview`.
4. Kör `quarto render`.
5. Kontrollera att `docs/CNAME` fortfarande finns kvar och innehåller `xn--frna-5qa.se`.
6. Commit och push till `main`.

## Viktiga filer

- `index.qmd`: startsidan
- `produkter.qmd`: stängt-besked, prislista och telefonbeställning
- `kontakt.qmd`: kontaktuppgifter
- `kassa.qmd`: stängt-besked och telefonnummer för gamla kassalänkar
- `site-theme.css`: sajtens övergripande tema
- `assets/css/shop.css`: styling för katalog, varukorg och checkout
- `assets/js/store.js`: varukorg, summering och mängdrabatt
- `shop/checkout-page.js`: beställningslogik och mejlutkast
- `shop/email-config.js`: mottagare och checkout-läge
- `_quarto.yml`: Quarto-konfiguration och publiceringsupplägg

## Beställningsflödet just nu

- Plantskolan är tydligt markerad som stängd på plantskolesidan, startsidan och kontaktsidan.
- Alla köpknappar är inaktiverade direkt i HTML.
- Beställningar görs via telefon till Fabian på `0766-148318` (`tel:+46766148318`).
- Prislistor, mängdrabatter och bilder finns kvar som information. Fabian bekräftar aktuella priser och tillgänglighet i samtalet.
- `kassa.qmd` innehåller inget beställningsformulär och laddar inga butiksskript, även om besökaren har en gammal sparad varukorg.

Tidigare kod för varukorg, `mailto` och EmailJS finns kvar för eventuell framtida återanvändning, men är inte aktiv på sidorna.

## Dokumentation

- [HANDOVER.md](HANDOVER.md): drift, publicering, ansvar och viktiga beslut
- [NEXT_STEPS.md](NEXT_STEPS.md): aktuell backlog och förbättringsidéer

## Regler för detta repo

- Ta aldrig bort `docs/CNAME`.
- Bevara värdet `xn--frna-5qa.se` om inte domänen uttryckligen ska bytas.
- Kör alltid `quarto render` innan publicering när innehåll eller frontend har ändrats.
