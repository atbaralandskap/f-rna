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

## 7. förbättringar
- lägga till en kalender Förna samskapardagar

## 8. Byt från `mailto` till EmailJS senare

När ni vill gå från att öppna ett mejl i användarens mejlprogram till att skicka beställningar direkt från kassan:

1. Skapa eller logga in på ett EmailJS-konto.
2. Lägg till en tjänst under `Email Services`.
3. Skapa två mallar under `Email Templates`.
4. Hämta dessa fyra värden:
   - `publicKey`
   - `serviceId`
   - `sellerTemplateId`
   - `buyerTemplateId`
5. Öppna `shop/email-config.js`.
6. Byt:
   - `sellerName` till `Fabian`
   - `sellerEmail` till Fabians riktiga adress
   - `mode: "mailto"` till `mode: "emailjs"`
7. Fyll i EmailJS-värdena i `shop/email-config.js`.
8. Kör `quarto render`.

Exempel:

```js
window.FORNA_EMAIL_CONFIG = {
  sellerName: "Fabian",
  sellerEmail: "fabian@example.com",
  pickupLocation: "Bästekille i växthuset",
  pickupNote:
    "Fabian hör av sig och återkommer med datum då varorna kan hämtas upp i Bästekille i växthuset.",
  mode: "emailjs",
  emailjs: {
    publicKey: "DIN_PUBLIC_KEY",
    serviceId: "DIN_SERVICE_ID",
    sellerTemplateId: "DIN_SELLER_TEMPLATE_ID",
    buyerTemplateId: "DIN_BUYER_TEMPLATE_ID",
  },
};
```

Variabler som mallarna kan använda i EmailJS:

- `{{order_id}}`
- `{{order_created_at}}`
- `{{customer_name}}`
- `{{customer_email}}`
- `{{customer_phone}}`
- `{{customer_note}}`
- `{{order_lines}}`
- `{{order_total}}`
- `{{pickup_location}}`
- `{{pickup_note}}`
- `{{seller_name}}`
- `{{to_email}}`


