# PRODUCT.md — Kapper Joop Website

> Dit document is het planningsfundament voor de Kapper Joop website.
> Backend (Supabase, auth, schema) blijft ongewijzigd ten opzichte van de originele prompt.
> Dit document stuurt uitsluitend de **frontend** aan.

---

## 1. Merk & Identiteit

**Naam:** Kapper Joop  
**Tagline (logo):** Shaves & Trims – Men Only  
**Locatie:** Rijssen  
**Type zaak:** Traditionele herenkapper / barbershop  
**Karakter:** Niet al te serieus. Een grap wordt gewaardeerd. Vakmanschap met een knipoog.

### Logo
- Bestand: `JoopLogo.png` (in projectroot)
- Stijl: Vintage ovaal badge, gekruiste scharen, koper/brons kleurenschema
- Gebruik: Altijd het logo gebruiken in navbar en footer. Nooit vervangen door tekst alleen.

---

## 2. Visueel Ontwerpsysteem

### Kleurenpalet

| Naam            | Waarde (benadering) | Gebruik                              |
|-----------------|---------------------|--------------------------------------|
| Koper primair   | `#C49A6C`           | Accenten, knoppen, iconen, borders   |
| Koper donker    | `#A07848`           | Hover states, actieve elementen      |
| Koper licht     | `#D4B48C`           | Subtiele highlights, decoraties      |
| Houtskool       | `#1A1410`           | Hero achtergrond, navbar             |
| Espresso        | `#2C1F14`           | Dark sections, cards in dark context |
| Crème           | `#F5F0E8`           | Lichte sectie-achtergronden          |
| Gebroken wit    | `#FDFAF5`           | Body tekst achtergrond               |
| Donkerbruin     | `#3D2B1F`           | Tekst op lichte achtergronden        |

> De koperkleuren zijn afgeleid van het logo. Gebruik **nooit** standaard Tailwind blauw/indigo.

### Achtergrondstrategie
- **Hero / Navbar:** Donker (houtskool `#1A1410`) met koper accenten
- **Secties (alternerend):**
  - Oneven secties: Crème `#F5F0E8` met donkerbruine tekst
  - Even secties: Wit `#FDFAF5` of licht warm grijs
- **Footer:** Donker (espresso `#2C1F14`)

### Typografie
Gebruik **volledig vintage** lettertypes, consistent met het logo.

| Element        | Font-suggestie                          | Stijl                        |
|----------------|-----------------------------------------|------------------------------|
| Hoofdkoppen    | `Playfair Display` of `Libre Baskerville` | Bold, serif, expressief      |
| Subkoppen      | `Playfair Display Italic`               | Elegant, krachtig            |
| Body tekst     | `Lora` of `Merriweather`               | Leesbare serif, warm         |
| Labels/badges  | `Oswald` of `Bebas Neue` (caps)         | Strak, vintage gevoel        |
| Accenten       | `IM Fell English` of vergelijkbaar      | Decoratief voor quotes/taglines |

> Alle fonts via Google Fonts. Kies uit bovenstaande familie — mix niet met moderne sans-serif.

### Schaduwen & Diepte
- Gebruik **kleur-getinte schaduwen** (koperkleurig of donkerbruin, lage opacity)
- Geen generieke `shadow-md`. Altijd handmatig gestapeld:
  ```
  box-shadow: 0 2px 8px rgba(196,154,108,0.12), 0 8px 32px rgba(26,20,16,0.18);
  ```
- Kaarten hebben een subtiele rand in koper (`border: 1px solid rgba(196,154,108,0.25)`)

### Animaties & Interacties
- Alleen `transform` en `opacity` animeren — nooit `transition-all`
- Hover op knoppen: lichte schaalvergroting + koperglow
- Tijdslots: zachte inkomst-animatie bij laden
- Stap-indicator in boekflow: smooth progress animatie

---

## 3. Toon & Tekst (Copywriting)

**Taal:** Nederlands (volledig)

**Stem:** Zelfverzekerd, vakkundig, met een subtiele knipoog. Joop is de man die je vertrouwt met je hoofd — en dat weet hij.

**Voorbeelden van de juiste toon:**
- ✅ "Geen slechte haardag meer. Tenminste, niet als je hier geweest bent."
- ✅ "Boek een stoel. Wij zorgen voor de rest — jij voor de fooi."
- ✅ "Al jaren knippen we Rijssen knap. Eén hoofd tegelijk."
- ✅ "Kapper Joop. Shaves & Trims. Men Only."
- ❌ Geen corporate taal ("wij streven ernaar...")
- ❌ Geen overdreven grappen (het blijft een kapperswebsite)
- ❌ Geen Engelse termen waar Nederlands beter past

**Barbershop-specifieke termen (NL):**
- Knippen / Knipbeurt
- Baard trimmen / Baardstyling
- Scheren
- Afspraak / Reservering
- Klant
- Stoel

---

## 4. Secties & Pagina-indeling

### 4.1 Navbar
- Logo links (`JoopLogo.png`)
- Links: Diensten | Over Joop | Galerij | Reserveren
- CTA knop rechts: **"Boek een afspraak"** (koperkleurig, vintage styling)
- Op donkere achtergrond, sticky bij scrollen
- Mobiel: hamburger menu met slide-in drawer

### 4.2 Hero
- **Achtergrond:** Donker, filmisch barbershop beeld (stock) met overlay
- **Overlay:** Lineair verloop van `rgba(26,20,16,0.7)` naar `rgba(44,31,20,0.5)`
- **Kop:** "Kapper Joop" of sterke tagline
- **Sub:** "Shaves & Trims – Rijssen"
- **CTA:** "Boek je knipbeurt" + "Bekijk diensten" (secundaire knop)
- Grain/texture filter over de hero voor filmisch effect

**Aanbevolen stockfoto-onderwerpen voor hero:**
- Premium barbershop interieur
- Kapper aan het werk (zijkant/achterkant, niet gezicht)
- Close-up: schaar, scheermes, koperkleurige tools

### 4.3 Diensten & Prijzen
- **Achtergrond:** Crème (`#F5F0E8`)
- Laden vanuit Supabase `services` tabel (alleen `is_active = true`)
- Indeling: Premium kaarten of elegante lijststijl
- Per dienst: naam, beschrijving, duur (minuten), prijs, boekknop
- Vintage badge of icoon per dienst

**Standaard diensten (placeholder, via admin aanpasbaar):**
| Dienst              | Prijs  | Duur    |
|---------------------|--------|---------|
| Knippen             | €15    | 30 min  |
| Baard trimmen       | €10    | 20 min  |
| Knippen + Baard     | €22    | 45 min  |
| Scheren warm doek   | €18    | 30 min  |
| Kinderknipbeurt     | €12    | 25 min  |

### 4.4 Galerij / Barbiers aan het werk
- **Achtergrond:** Donker (`#1A1410`) of espresso
- Masonry of gelijke grid met 4–6 stockfoto's
- Onderwerpen: fade detail, scheren, interieur, tools
- Gradient overlay op elke foto (donker → transparant)
- Sectietitel: "Het Ambacht" of "Joop aan het werk"
- Geen carousel — statische grid werkt beter voor vertrouwen

### 4.5 Over Joop
- **Achtergrond:** Licht (crème of wit)
- Twee-koloms layout: tekst links, foto rechts (of andersom)
- Foto: barbershop portret of close-up vakwerk (stock)
- Tekst: placeholder in stijl van Joop (humor, vakmanschap, Rijssen)
- Decoratief koper scheidingselement

**Placeholder Over Joop tekst:**
> "Joop knipt al langer dan hij zich kan herinneren — en dat zegt wat. In het hart van Rijssen staat zijn zaak: geen fratsen, geen föhnkapper, gewoon een man die weet wat hij doet. Met een schaar, een goed verhaal en soms een advies dat je niet gevraagd hebt. Men Only. Altijd al geweest."

### 4.6 Google Reviews
- **Achtergrond:** Crème of licht warm grijs
- Toon: 3–4 kaarten met sterren, naam klant, recensietekst
- Statisch placeholder tot Google Reviews API is aangesloten
- Sectietitel: "Wat Rijssen zegt"
- Stijl: vintage kaarten met subtiele koperrand

**Placeholder reviews:**
- "Beste kapper van Rijssen, en dat zonder discussie." — Henk V. ⭐⭐⭐⭐⭐
- "Joop knipt precies zoals je wil, ook al leg je het slecht uit." — Mark de B. ⭐⭐⭐⭐⭐
- "Snel, scherp en een goed gesprek erbij. Meer heb je niet nodig." — Thomas R. ⭐⭐⭐⭐⭐

### 4.7 Reserveren (Boekflow)
- **Achtergrond:** Licht, clean, goed leesbaar
- 4 stappen:
  1. Kies een dienst
  2. Kies datum & tijd
  3. Vul je gegevens in (naam, email, telefoon, opmerking)
  4. Bevestigingsscherm
- Stap-indicator bovenaan (vintage badge-stijl)
- Beschikbare tijdslots: laden vanuit Supabase logica
- Succesboodschap: warm, in stijl van Joop

**Placeholder succesboodschap:**
> "Geregeld! Joop verwacht je. Kom op tijd — hij ook."

### 4.8 Footer
- **Achtergrond:** Donker espresso (`#2C1F14`)
- Logo links boven
- Kolommen: Openingstijden | Diensten | Contact & Socials
- Social icons: Facebook, Instagram, Google Maps
- Onderaan: "© 2025 Kapper Joop – Rijssen" + "Shaves & Trims – Men Only"

---

## 5. Openingstijden

| Dag       | Status   | Tijden          |
|-----------|----------|-----------------|
| Maandag   | Open     | 16:30 – 20:30   |
| Dinsdag   | Open     | 08:00 – 17:30   |
| Woensdag  | Open     | 08:00 – 17:30   |
| Donderdag | Open     | 08:00 – 20:00   |
| Vrijdag   | Open     | 08:00 – 17:30   |
| Zaterdag  | Gesloten | —               |
| Zondag    | Gesloten | —               |

> Deze tijden zijn de **standaard seed-data** voor de `business_hours` tabel.
> Via het admin dashboard zijn ze aanpasbaar.

---

## 6. Fotomateriaal

**Nu:** Hoogwaardige stock barbershop fotografie  
**Later:** Eigen foto's van Joop en de zaak (eenvoudig te vervangen)

**Stockfoto-bronnen:** Unsplash (zoektermen: barbershop, barber, haircut, fade, shave, razor)

**Stijlrichtlijn voor alle foto's:**
- Warme, filmische belichting
- Donkere koper/houtskool/crème tonen
- Mannelijk, professioneel, geen vrouwelijke salon-sfeer
- Goede compositie, geen onhandige stockfoto's

**Fotoconfiguratie:** Sla alle foto-URLs op in een centrale `images.ts` configuratiefile zodat eigen foto's later in één stap kunnen worden verwisseld.

---

## 7. Social Media & Contactgegevens

| Platform    | Status                  |
|-------------|-------------------------|
| Instagram   | Link in footer (placeholder `#`) |
| Facebook    | Link in footer (placeholder `#`) |
| Google Maps | Link in footer (placeholder `#`) |

> Echte URLs worden ingevuld zodra de social media-pagina's beschikbaar zijn.

**Contactgegevens:** Laden vanuit `barbershop_settings` in Supabase via admin dashboard.

---

## 8. Wat blijft ongewijzigd (Backend)

De volgende onderdelen uit de originele prompt blijven **exact hetzelfde:**

- Supabase verbinding & credentials (via `.env`)
- Database schema (alle tabellen en velden)
- Admin authenticatie flow (via `admin_users.user_id`)
- Admin dashboard (alle 6 pagina's)
- Beschikbaarheidslogica (business_hours, blocked_dates, slot_interval)
- Boekflow database-koppeling (INSERT in `appointments`)
- Beveiligde routes

---

## 9. Frontend Aanpassingen op de Originele Prompt

De volgende onderdelen van de originele prompt worden **vervangen** door dit document:

| Origineel                             | Vervangen door                              |
|---------------------------------------|---------------------------------------------|
| Generiek kleurenpalet                 | Koper/espresso/crème palet (zie §2)         |
| Engelse copy & termen                 | Volledig Nederlandstalig (zie §3)           |
| Generieke typografie-richting         | Volledig vintage serif-familie (zie §2)     |
| Naamloos barbershop merk              | Kapper Joop – Rijssen                       |
| Afbeeldingen zonder richtlijn         | Centrale `images.ts` + stijlrichtlijn (§6)  |
| Sectie-indeling niet gespecificeerd   | Exacte secties met volgorde (zie §4)        |
| Geen openingstijden                   | Concrete seed-data voor business_hours (§5) |
| Geen social media                     | Instagram, Facebook, Google Maps (§7)       |
| Engelse CTA's                         | Nederlandstalige kopie (§3 & §4)            |

---

## 10. Kwaliteitscheck voor Oplevering

Voordat de prompt wordt ingediend bij de AI-builder:

- [ ] Logo `JoopLogo.png` wordt gebruikt in navbar en footer
- [ ] Alle koperkleuren zijn afgeleid van het logo (geen standaard blauw/indigo)
- [ ] Alle tekst op de public website is in het Nederlands
- [ ] Openingstijden kloppen met §5
- [ ] Stockfoto's zijn geconfigureerd in een centrale `images.ts`
- [ ] Humor is subtiel aanwezig in hero, diensten en footer copy
- [ ] Admin dashboard is ongewijzigd (backend scope)
- [ ] Boekflow is volledig gekoppeld aan Supabase
- [ ] Geen hardcoded Supabase credentials (altijd via `.env`)
