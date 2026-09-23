# D&W Security – website

De website draait op **Astro** en wordt gehost op **Cloudflare Workers**. Elke push naar `main` op GitHub zet de site automatisch live.

## Lokaal draaien
```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # bouwt de site naar dist/
npx astro preview  # bekijk de gebouwde site
```

## Waar staat wat
| Wat | Bestand |
|---|---|
| Telefoon, e-mail, adres, KvK, vergunning, social media | `src/config.js` |
| Diensten (naam, korte tekst, foto) | `src/config.js` → `services` |
| Logo's van opdrachtgevers | `src/config.js` → `clients` + `public/assets/img/klant-*.png` |
| Paginateksten | `src/pages/*.astro` en `src/pages/diensten/*.astro` |
| Paginatitel en omschrijving (Google) | bovenaan elke pagina: `title` en `description` |
| Menu | `src/data/nav.js` |
| Header / footer | `src/components/Header.astro`, `Footer.astro` |
| Opmaak (kleuren, lettertypes) | `public/assets/css/site.css` |
| Foto's | `public/assets/img/` (vervangen? geef het bestand een nieuwe naam) |
| Offerteformulier (server) | `worker/contact.js` |
| Doorverwijzingen oude WordPress-links | `public/_redirects` |

## Adressen
`/`, `/diensten`, `/diensten/horeca`, `/diensten/evenementen`, `/diensten/persoonsbeveiliging`, `/diensten/objectbeveiliging`, `/over-ons`, `/vacatures`, `/contact`. Oude links zoals `/#horeca` en `/index.php/horecabeveiliging/` sturen automatisch door naar de nieuwe pagina.

## Publiceren (eenmalig instellen)
1. Cloudflare dashboard → Workers & Pages → Create → **Import a repository** → kies deze repository.
2. Projectnaam: `dw-security`. Build command: **leeg laten**. Deploy command: `npx wrangler deploy`.
3. Na de eerste deploy: Settings → Domains & Routes → voeg `www.dwsecurity.nl` en `dwsecurity.nl` toe.

## Offerteformulier
Nu opent het formulier het e-mailprogramma van de bezoeker, met de aanvraag al ingevuld. Om aanvragen direct in de inbox te krijgen:
1. Maak een account op resend.com. Voeg het domein `dwsecurity.nl` toe en zet de DNS-records die Resend toont bij de DNS-beheerder.
2. Zet in Cloudflare (Worker → Settings → Variables and Secrets, type *Secret*): `RESEND_API_KEY`, `MAIL_TO` (bijv. `info@dwsecurity.nl`) en `MAIL_FROM` (bijv. `D&W Security <website@dwsecurity.nl>`).
3. Test: `curl -X POST https://www.dwsecurity.nl/api/contact -H 'Content-Type: application/json' -d '{"naam":"Test","email":"jij@voorbeeld.nl","dienst":"Horeca"}'` moet `{"ok":true}` geven.
4. Zet daarna in `src/config.js`: `endpoints: { contact: '/api/contact' }` en push.

## Checklist vóór livegang
- [ ] **DNS/domein**: de huidige WordPress-site draait op `dwsecurity.nl` (www stuurt nu door naar zonder www). Beslis of het domein naar Cloudflare verhuist. De nieuwe site gebruikt `https://www.dwsecurity.nl` als hoofdadres; stuur `dwsecurity.nl` door naar www.
- [ ] **E-mail**: `info@dwsecurity.nl` ontvangt mail via hostingenregistratie.nl. Neem de MX-records mee bij een DNS-verhuizing, anders komt er geen mail meer binnen.
- [ ] **Privacyverklaring**: die ontbreekt nog. Het formulier verwerkt persoonsgegevens, en Resend moet erin genoemd worden zodra het formulier via de server verstuurt.
- [ ] **Beloftes in de tekst**: "Wij reageren altijd binnen 24 uur op werkdagen" en "Bij spoed binnen 1–2 uur ter plaatse". Klopt dat?
- [ ] **Paginatitels en omschrijvingen**: nieuw geschreven voor Google. Laat ze nakijken.
- [ ] **Logo's van opdrachtgevers**: is er toestemming om ze te tonen?
- [ ] Oprichters en foto's: namen (Denzel, Wesley) en beeldgebruik akkoord?
