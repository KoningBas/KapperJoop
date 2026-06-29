# Kapper Joop — Volledige Website Prompt

You are a world-class full-stack product builder, creative director, and UI/UX designer.

Build a premium traditional barbershop website for **Kapper Joop** in **Rijssen** with a real booking system and a secure admin dashboard.

The final result should feel like it was designed by a top-tier design agency and built as a real production-ready product.

Do not create a generic template.
Do not create a basic admin panel.
Do not make small visual improvements.
Create a complete, polished, premium experience from the first version.

**Tech stack:**
- React
- TypeScript
- Vite
- Supabase for database, backend, and auth

================================================
SUPABASE CONNECTION
================================================

Use these Supabase credentials:

```
VITE_SUPABASE_URL=PASTE_YOUR_SUPABASE_URL_HERE
VITE_SUPABASE_ANON_KEY=PASTE_YOUR_PUBLISHABLE_KEY_HERE
```

Rules:
- Use these values as environment variables
- Do not hardcode them inside components
- Create the Supabase client in `src/lib/supabase.ts`
- Use `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`

================================================
DATABASE SCHEMA
================================================

Use this exact schema. Do not rename fields or invent new ones.

**services:**
- id
- name
- description
- duration_minutes
- price
- is_active
- created_at

**appointments:**
- id
- full_name
- email
- phone
- service_id
- appointment_date
- start_time
- end_time
- status
- notes
- created_at

**business_hours:**
- id
- weekday
- is_open
- start_time
- end_time

**blocked_dates:**
- id
- blocked_date
- reason
- created_at

**barbershop_settings:**
- id
- barbershop_name
- barbershop_email
- barbershop_phone
- barbershop_address
- slot_interval_minutes
- booking_notice_hours
- created_at

**admin_users:**
- id
- user_id
- created_at

Important:
- Use `barbershop_settings`, not `salon_settings` or `clinic_settings`
- Use `admin_users.user_id` to check admin access
- Do not check admin access by email
- Do not use fake local authentication
- Do not use fake local data

================================================
SEED DATA
================================================

Seed the following data on first run if the tables are empty.

**business_hours seed:**
| weekday | is_open | start_time | end_time |
|---------|---------|------------|----------|
| 1 (maandag)   | true  | 16:30 | 20:30 |
| 2 (dinsdag)   | true  | 08:00 | 17:30 |
| 3 (woensdag)  | true  | 08:00 | 17:30 |
| 4 (donderdag) | true  | 08:00 | 20:00 |
| 5 (vrijdag)   | true  | 08:00 | 17:30 |
| 6 (zaterdag)  | false | —     | —     |
| 0 (zondag)    | false | —     | —     |

**services seed:**
| name                  | description                                      | duration_minutes | price | is_active |
|-----------------------|--------------------------------------------------|-----------------|-------|-----------|
| Knippen               | Een strakke knipbeurt zoals het hoort.           | 30              | 15.00 | true      |
| Baard trimmen         | Jouw baard in model — kort of lang.              | 20              | 10.00 | true      |
| Knippen + Baard       | Compleet verzorgd van boven tot onder.           | 45              | 22.00 | true      |
| Scheren met warm doek | Het klassieke scheermes-ritueel.                 | 30              | 18.00 | true      |
| Kinderknipbeurt       | Voor de kleintjes. Joop is geduldig. Meestal.    | 25              | 12.00 | true      |

**barbershop_settings seed:**
| field                 | value                  |
|-----------------------|------------------------|
| barbershop_name       | Kapper Joop            |
| barbershop_email      | info@kapperjoop.nl     |
| barbershop_phone      | 0548 - 000 000         |
| barbershop_address    | Rijssen                |
| slot_interval_minutes | 15                     |
| booking_notice_hours  | 2                      |

================================================
BRAND IDENTITY
================================================

**Naam:** Kapper Joop
**Locatie:** Rijssen
**Tagline:** Shaves & Trims – Men Only
**Type:** Traditionele herenkapper / barbershop
**Karakter:** Vakkundig, zelfverzekerd, niet te serieus. Een grap wordt gewaardeerd.

**Logo:**
- Bestand: `public/JoopLogo.png` (kopieer het logo naar de public map)
- Stijl: Vintage ovaal badge, gekruiste scharen, koper/brons kleurenschema
- Gebruik: Altijd het echte logo in navbar en footer. Nooit vervangen door tekst alleen.
- Op donkere achtergronden: het logo is al koper/transparant, gebruik het direct
- Op lichte achtergronden: voeg een lichte drop-shadow toe voor leesbaarheid

================================================
TAAL
================================================

De volledige public website is in het **Nederlands**. Alle koppen, knopteksten, labels, formuliervelden, foutmeldingen, en bevestigingsteksten zijn Nederlandstalig.

Het admin dashboard mag in het Engels blijven (standaard voor dashboards).

================================================
VISUEEL ONTWERPSYSTEEM
================================================

**Kleurenpalet — afgeleid van het Kapper Joop logo:**

```
--color-koper:        #C49A6C   /* Primair accent — knoppen, borders, iconen */
--color-koper-donker: #A07848   /* Hover states, actieve elementen */
--color-koper-licht:  #D4B48C   /* Subtiele highlights, decoraties */
--color-houtskool:    #1A1410   /* Hero achtergrond, navbar, dark sections */
--color-espresso:     #2C1F14   /* Footer, cards in dark context */
--color-creme:        #F5F0E8   /* Lichte secties achtergrond */
--color-wit-warm:     #FDFAF5   /* Body tekst achtergrond */
--color-bruin-donker: #3D2B1F   /* Tekst op lichte achtergronden */
```

**Verboden kleuren:**
- Geen standaard Tailwind blauw (`blue-*`, `indigo-*`)
- Geen standaard Tailwind groen, rood, paars
- Geen koude grijzen — altijd warme tinten

**Typografie — volledig vintage:**

Alle fonts via Google Fonts. Gebruik uitsluitend deze familie:

| Element         | Font                     | Gebruik                              |
|-----------------|--------------------------|--------------------------------------|
| Hoofdkoppen (H1)| Playfair Display Bold    | Hero, sectiekoppen                   |
| Subkoppen (H2)  | Playfair Display Italic  | Subtitels, dienstvermeldingen        |
| Body tekst      | Lora Regular             | Paragrafen, beschrijvingen           |
| Labels & badges | Oswald SemiBold (caps)   | Badges, tijdslots, status-chips      |
| Accenten        | Playfair Display SC      | Decoratieve tekstelementen           |

Nooit een modern sans-serif gebruiken (geen Inter, Roboto, Poppins, etc.).

**Achtergrondstrategie — afwisselend donker/licht:**

| Sectie                    | Achtergrond              |
|---------------------------|--------------------------|
| Navbar                    | Houtskool `#1A1410`      |
| Hero                      | Houtskool `#1A1410`      |
| Diensten                  | Crème `#F5F0E8`          |
| Galerij / Barbiers        | Houtskool `#1A1410`      |
| Over Joop                 | Warm wit `#FDFAF5`       |
| Google Reviews            | Crème `#F5F0E8`          |
| Reserveren                | Warm wit `#FDFAF5`       |
| Footer                    | Espresso `#2C1F14`       |

**Schaduwen:**
Altijd kleur-getint, nooit generiek. Gebruik dit patroon:
```css
box-shadow: 0 2px 8px rgba(196,154,108,0.12), 0 8px 32px rgba(26,20,16,0.18);
```

Kaartborders: `1px solid rgba(196,154,108,0.25)`

**Animaties:**
- Alleen `transform` en `opacity` animeren
- Nooit `transition-all`
- Hover knoppen: schaalvergroting `scale(1.02)` + koper glow
- Tijdslots: fade-in bij laden (`opacity 0 → 1`, `translateY 8px → 0`)

================================================
FOTOCONFIGURATIE
================================================

Sla alle foto-URLs op in een centraal configuratiebestand `src/config/images.ts`:

```typescript
export const IMAGES = {
  hero: 'https://images.unsplash.com/...',
  about: 'https://images.unsplash.com/...',
  gallery: [
    'https://images.unsplash.com/...',
    'https://images.unsplash.com/...',
    'https://images.unsplash.com/...',
    'https://images.unsplash.com/...',
  ],
  services: {
    knippen: 'https://images.unsplash.com/...',
    baard: 'https://images.unsplash.com/...',
    scheren: 'https://images.unsplash.com/...',
  },
};
```

Dit maakt het later eenvoudig om eigen foto's in te zetten.

**Stijlrichtlijn voor alle stockfoto's:**
- Warme, filmische belichting
- Donkere koper/houtskool/crème tonen
- Mannelijk, professioneel — geen vrouwelijke salon-sfeer
- Onderwerpen: barbershop interieur, kapper aan het werk, fade detail, scheermes, koperkleurige tools, warm doek
- Niet gebruiken: vrouwensalon, nagelstudio, tandartspraktijk, kantooromgeving

**Alle foto's:**
- `object-fit: cover` met intentionele uitsnede
- Gradient overlay op donkere secties: `linear-gradient(to bottom, rgba(26,20,16,0.6), rgba(26,20,16,0.3))`
- Grain/texture SVG filter op de hero voor filmisch effect
- Alt-tekst in het Nederlands

================================================
TOON & COPYWRITING
================================================

De stem van Kapper Joop: zelfverzekerd, vakkundig, met een subtiele knipoog. Niet overdreven grappig — maar het is duidelijk geen corporate website.

**Voorbeelden van de juiste toon:**
- "Geen slechte haardag meer. Tenminste, niet als je hier geweest bent."
- "Boek een stoel. Wij zorgen voor de rest."
- "Al jaren knippen we Rijssen knap. Eén hoofd tegelijk."
- "Kapper Joop. Shaves & Trims. Men Only."
- "Joop verwacht je. Kom op tijd."

**Verkeerd:**
- Geen corporate taal ("wij streven ernaar...")
- Geen overdreven grappen
- Geen Engelse termen waar Nederlands beter past

**Barbershop-specifieke Nederlandse termen:**
- Knipbeurt / Knippen (niet: haircut)
- Baard trimmen / Baardstyling (niet: beard trim)
- Scheren (niet: shave)
- Afspraak / Reservering (niet: appointment/booking)
- Klant (niet: client/patient)

================================================
PUBLIC WEBSITE — SECTIES
================================================

**Volgorde van secties:**
1. Navbar
2. Hero
3. Diensten & Prijzen
4. Galerij — Barbiers aan het werk
5. Over Joop
6. Klantreviews
7. Reserveren
8. Footer

---

### 1. Navbar

- Logo links: `public/JoopLogo.png` (max hoogte 56px)
- Links: Diensten | Over Joop | Galerij | Reserveren
- CTA knop rechts: **"Boek een afspraak"**
  - Achtergrond: koper `#C49A6C`
  - Tekst: houtskool `#1A1410`
  - Font: Oswald SemiBold, uppercase
  - Hover: `#A07848` + scale(1.02)
- Sticky bij scrollen, lichte blur-achtergrond bij scroll
- Mobiel: hamburger met slide-in overlay

---

### 2. Hero

- Achtergrond: filmische stockfoto van premium barbershop interieur of kapper aan het werk
- Donkere overlay: `rgba(26,20,16,0.72)`
- Grain/texture filter over de volledige hero
- Links uitgelijnde content (niet gecentreerd)

**Tekst (NL):**
- Eyebrow label: `RIJSSEN — HERENKAPPER` (Oswald, uppercase, koper)
- H1: `Kapper Joop` (Playfair Display Bold, groot, crème/wit)
- Subkop: `Shaves & Trims. Men Only.` (Playfair Display Italic, kleiner)
- Body: `Geen fratsen, geen föhnkapper. Gewoon een man die weet wat hij doet.`
- CTA primair: `Boek je knipbeurt` (koper knop)
- CTA secundair: `Bekijk diensten` (transparant, koper outline)

---

### 3. Diensten & Prijzen

- Achtergrond: crème `#F5F0E8`
- Sectietitel: `Wat Joop doet` of `Diensten & Prijzen`
- Laden vanuit Supabase `services` tabel — alleen `is_active = true`

**Per dienstkaart:**
- Naam (Playfair Display Bold)
- Beschrijving (Lora Regular)
- Duur in minuten (Oswald, koper badge)
- Prijs (groot, koper, Playfair Display)
- Knop: `Boek direct` → springt naar boekflow met voorgeselecteerde dienst

**Kaartontwerp:**
- Warm wit achtergrond `#FDFAF5`
- Koper border `1px solid rgba(196,154,108,0.3)`
- Vintage badge of decoratief icoon per dienst (schaar, scheermes, kam, etc.)
- Kleur-getinte schaduw
- Hover: lichte opwaartse beweging `translateY(-4px)`

---

### 4. Galerij — Barbiers aan het werk

- Achtergrond: houtskool `#1A1410`
- Sectietitel: `Het Ambacht` (koper, Playfair Display)
- Grid van 4–6 stockfoto's (masonry of gelijke grid)
- Elk foto: gradient overlay, subtiele hover-zoom `scale(1.04)`
- Onderwerpen: fade detail, scheren, tools, interieur, warm doek
- Geen carousel — statische grid

---

### 5. Over Joop

- Achtergrond: warm wit `#FDFAF5`
- Twee-koloms layout: tekst links, foto rechts
- Foto: barbershop portret of close-up vakwerk

**Placeholder tekst (NL):**
> Joop knipt al langer dan hij zich kan herinneren — en dat zegt wat.
> In het hart van Rijssen staat zijn zaak: geen fratsen, geen föhnkapper,
> gewoon een man die weet wat hij doet. Met een schaar, een goed verhaal
> en soms een advies dat je niet gevraagd hebt. Men Only. Altijd al geweest.

- Decoratief koper scheidingselement (lijn of ornament) boven de tekst
- Kleine badge/label: `VAKMANSCHAP SINDS [JAAR]`

---

### 6. Klantreviews

- Achtergrond: crème `#F5F0E8`
- Sectietitel: `Wat Rijssen zegt`
- 3 placeholder review-kaarten (statisch — later vervangbaar door Google Reviews API)

**Placeholder reviews:**
1. "Beste kapper van Rijssen, en dat zonder discussie." — Henk V. ★★★★★
2. "Joop knipt precies zoals je wil, ook al leg je het slecht uit." — Mark de B. ★★★★★
3. "Snel, scherp en een goed gesprek erbij. Meer heb je niet nodig." — Thomas R. ★★★★★

**Kaartontwerp:** vintage stijl, koper ster-iconen, subtiele border

---

### 7. Reserveren (Boekflow)

- Achtergrond: warm wit `#FDFAF5`
- Sectietitel: `Reserveer je stoel`
- Stap-indicator bovenaan (vintage badge-stijl, 4 stappen)

**Stap 1 — Kies een dienst:**
- Toon actieve diensten vanuit Supabase
- Geselecteerde staat: koper border + lichte koperachtergrond

**Stap 2 — Kies datum & tijd:**
- Datum-picker: geen geblokkeerde data (`blocked_dates`), geen gesloten dagen (`business_hours`)
- Tijdslots: gegenereerd op basis van `business_hours`, `slot_interval_minutes`, `duration_minutes`, bestaande afspraken
- Tijdslot-stijl: kleine kaarten, Oswald font, koper bij selectie

**Stap 3 — Jouw gegevens:**
Formuliervelden (NL labels):
- Volledige naam
- E-mailadres
- Telefoonnummer
- Opmerking (optioneel)

**Stap 4 — Bevestiging:**

Succesboodschap:
> **Geregeld!**
> Joop verwacht je op [datum] om [tijd].
> Een bevestiging is onderweg naar [email].
> Kom op tijd — hij ook.

- Toon afspraakoverzicht: dienst, datum, tijd, naam
- Knop: `Nog een afspraak maken`

---

### 8. Footer

- Achtergrond: espresso `#2C1F14`
- Logo bovenaan (koper/transparant versie)
- Drie kolommen:

**Kolom 1 — Kapper Joop:**
- Naam + tagline: `Shaves & Trims – Men Only`
- Adres (uit `barbershop_settings`)
- Telefoon (uit `barbershop_settings`)

**Kolom 2 — Openingstijden:**
| Dag       | Tijden          |
|-----------|-----------------|
| Maandag   | 16:30 – 20:30   |
| Dinsdag   | 08:00 – 17:30   |
| Woensdag  | 08:00 – 17:30   |
| Donderdag | 08:00 – 20:00   |
| Vrijdag   | 08:00 – 17:30   |
| Zaterdag  | Gesloten        |
| Zondag    | Gesloten        |

**Kolom 3 — Volg ons:**
- Instagram icoon + link (placeholder `#`)
- Facebook icoon + link (placeholder `#`)
- Google Maps icoon + link (placeholder `#`)
- Knop: `Boek een afspraak`

**Onderkant:**
`© 2025 Kapper Joop – Rijssen` | `Shaves & Trims – Men Only`

================================================
BESCHIKBAARHEIDSLOGICA
================================================

Beschikbare tijdslots worden gegenereerd op basis van:
- `business_hours`
- `services.duration_minutes`
- `barbershop_settings.slot_interval_minutes`
- `barbershop_settings.booking_notice_hours`
- `blocked_dates`
- Bestaande afspraken

Regels:
- Toon alleen slots binnen werktijden
- Sla geblokkeerde data over
- Sla overlappende afspraken over
- Negeer geannuleerde afspraken
- Respecteer booking notice tijd
- Gebruik de geselecteerde service-duur om `end_time` te berekenen
- Nieuwe actieve diensten via het dashboard werken direct in de boekflow

Overlap-regel:
```
new_start < existing_end AND new_end > existing_start
```

Alle slots genormaliseerd als:
```typescript
{
  start: Date,
  end: Date,
  label: string
}
```

Tijdsveiligheid:
- Formatteer alleen echte Date-objecten
- Geef nooit ongeldige strings mee aan `format()`
- Combineer altijd de geselecteerde datum en tijd correct
- Sla `appointment_date` op als Supabase-compatibele datum
- Sla `start_time` en `end_time` op als Supabase-compatibele tijdwaarden

================================================
ADMIN AUTH
================================================

Maak een echte admin-login met Supabase Auth.

Admin login flow:
1. Admin voert e-mail en wachtwoord in
2. Inloggen via `supabase.auth.signInWithPassword()`
3. Haal de geauthenticeerde gebruiker op
4. Controleer of `user.id` bestaat in `admin_users.user_id`
5. Bij ja: toegang tot dashboard
6. Bij nee: toon "Je bent ingelogd, maar je hebt geen admin-toegang."
7. Laadstatus tonen tijdens sessie- en admin-controle
8. Niet doorsturen naar login voordat de admin-check klaar is

Regels:
- Beveilig alle admin-routes
- De public website blijft toegankelijk zonder login
- Controleer admin-toegang niet op e-mailadres
- Geen nep-authenticatie
- Geen verborgen knoppen als enige beveiliging

================================================
ADMIN DASHBOARD
================================================

Maak een compleet dashboard met deze pagina's:

1. Overzicht
2. Afspraken
3. Diensten
4. Openingstijden
5. Geblokkeerde data
6. Instellingen

Het dashboard voelt als een gepolijst premium productdashboard, niet als een basis admin-template.

**Visuele eisen dashboard:**
- Verfijnde sidebar
- Gepolijste paginakoppen
- Mooie kaarten
- Schone tabellen
- Premium formulieren
- Elegante knoppen
- Verfijnde badges
- Goede lege staten
- Sterke hiërarchie

**1. Overzicht:**
- Komende afspraken
- In behandeling
- Afgerond
- Actieve diensten
- Gepolijste metric-kaarten

**2. Afspraken:**
- Alle afspraken vanuit Supabase
- Toon: naam, dienst, datum, tijd, telefoon, email, status, opmerking
- Filteren op status
- Status wijzigen: pending / confirmed / cancelled / completed

**3. Diensten:**
Volledig beheersbaar:
- Diensten toevoegen
- Diensten bewerken (vooringevuld formulier / modal)
- Diensten activeren/deactiveren
- Velden: naam, beschrijving, duration_minutes, prijs, is_active
- Inactieve diensten: zichtbaar in dashboard, niet op de publieke website
- Geen hard-delete (afspraken kunnen naar diensten verwijzen)

**4. Openingstijden:**
- Elke weekdag bewerkbaar
- Open/gesloten instellen
- Start- en eindtijd bewerken
- Wijzigingen beïnvloeden direct de beschikbare boekslots

**5. Geblokkeerde data:**
- Geblokkeerde data toevoegen met reden
- Geblokkeerde data verwijderen
- Blokkades voorkomen reserveringen

**6. Instellingen:**
Bewerkbaar:
- barbershop_name
- barbershop_email
- barbershop_phone
- barbershop_address
- slot_interval_minutes
- booking_notice_hours

================================================
KWALITEITSEISEN
================================================

- Volledige werkende app
- Schone codestructuur
- Supabase volledig gekoppeld
- Boekflow werkt end-to-end
- Admin-login werkt
- Beveiligd dashboard werkt
- Dienstenbeheer volledig werkend
- Afsprakenbeheer werkend
- Openingstijden bewerken werkt
- Geblokkeerde data werkt
- Instellingen bewerkbaar
- Public website volledig in het Nederlands
- Logo `JoopLogo.png` gebruikt in navbar en footer
- Kleurenpalet volledig gebaseerd op het Kapper Joop logo
- Vintage serif typografie door de hele public website
- Alle foto-URLs in centrale `src/config/images.ts`
- Stockfoto's zijn barbershop-specifiek en van hoge kwaliteit
- Hero bevat een krachtige, filmische barbershop visual
- Geen hardcoded Supabase credentials
- Geen nep-data of losgekoppelde dashboardpagina's
- Geen read-only adminpagina's waar bewerken verwacht wordt
- Geen standaard Tailwind blauw/indigo als primaire kleur
- Geen `transition-all`
- Geen salon-, medische of generieke SaaS-uitstraling

================================================
EINDRESULTAAT
================================================

Maak een complete, werkende premium barbershop website voor Kapper Joop in Rijssen:
- Een hoogwaardige Nederlandstalige public website met vintage karakter, filmische stockfotografie, en de subtiele humor van Joop
- Een gepolijst admin dashboard voor volledig beheer van afspraken, diensten, openingstijden en instellingen
- Alles gekoppeld aan Supabase — geen nep-data, geen losse eindjes
