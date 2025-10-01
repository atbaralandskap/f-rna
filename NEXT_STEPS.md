# ✅ Förna-webben – Kom igång nästa gång
*(Senast uppdaterad: 2025-10-01)*

## 1. Starta projektet
```bash
cd /c/atbara_landskap/f-rna
git status
```

## 2. Synka med GitHub
```bash
git pull --rebase origin main
```

## 3. Jobba med webben
- Öppna **RStudio**
- Välj **File → Open Project → mappen `f-rna/`**
- Klicka på **Build Website** (renderar Quarto-webben)

## 4. Publicera på GitHub Pages
```bash
git add .
git commit -m "Beskriv vad du ändrat"
git push origin main
```

## 5. Custom domain
- Domänen `förna.se` pekar via CNAME till GitHub Pages
- DNS kan ta 24–48 timmar att slå igenom
- När det funkar → kryssa i **Enforce HTTPS** i GitHub

## 6. Nästa steg
- Lägg text/bilder i `index.qmd`, `produkter.qmd`, `kontakt.qmd`
- Testa nytt tema i `_quarto.yml` (`minty`, `flatly`…)
- Fundera på att även registrera domän utan å/ö (t.ex. `forna.se` eller `f-orna.com`)


