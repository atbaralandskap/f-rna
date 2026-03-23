# Förna

Förna är en statisk Quarto-webbplats för Förnas verksamhet med information om plantskolan, tjänster, samskapardagar och ett enkelt beställningsflöde.

Live:
- `https://förna.se`
- GitHub Pages publiceras från `docs/`

## Teknik

- Quarto för innehåll och rendering
- GitHub Pages för publicering
- En liten JavaScript-butik för varukorg och checkout
- `mailto` som nuvarande beställningsflöde

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
- `produkter.qmd`: plantskolan och beställningsbara produkter
- `kontakt.qmd`: kontaktuppgifter
- `kassa.qmd`: checkout-sidan
- `site-theme.css`: sajtens övergripande tema
- `assets/css/shop.css`: styling för katalog, varukorg och checkout
- `assets/js/store.js`: varukorg, summering och mängdrabatt
- `shop/checkout-page.js`: beställningslogik och mejlutkast
- `shop/email-config.js`: mottagare och checkout-läge
- `_quarto.yml`: Quarto-konfiguration och publiceringsupplägg

## Beställningsflödet just nu

- Kunden lägger produkter i varukorgen på `produkter.qmd`.
- Checkouten finns på `kassa.qmd`.
- Beställningen öppnas som ett färdigifyllt mejl till Fabian via `mailto`.
- En dold kopia kan skickas till intern adress via `bcc`.
- Kunden använder sitt skickade mejl som orderkopia tills Fabian svarar.

Om Förna senare vill gå över till EmailJS finns stöd för det i koden, men mallarna och nycklarna behöver då konfigureras separat.

## Dokumentation

- [HANDOVER.md](HANDOVER.md): drift, publicering, ansvar och viktiga beslut
- [NEXT_STEPS.md](NEXT_STEPS.md): aktuell backlog och förbättringsidéer

## Regler för detta repo

- Ta aldrig bort `docs/CNAME`.
- Bevara värdet `xn--frna-5qa.se` om inte domänen uttryckligen ska bytas.
- Kör alltid `quarto render` innan publicering när innehåll eller frontend har ändrats.