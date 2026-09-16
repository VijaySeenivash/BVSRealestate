# BVS REAL ESTATE Web Platform

Production-ready, dynamic real-estate web application for **BVS Real Estate**, Dindigul, Tamil Nadu.

## Business Contact
- **Business Name**: BVS REAL ESTATE
- **Proprietor**: Banumathi B
- **Phone / WhatsApp**: +91 97501 76664 (`9750176664`)
- **Address**: Anjugam 2nd Street, Near Aavin Palpannai, East Govindapuram, Dindigul - 01, Tamil Nadu, India
- **Tagline**: `இடம் • வீடு • தொழில் • கோட்டில் • விவசாயம் வாங்க விற்க`

---

## Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend Architecture**: Supabase-ready PostgreSQL schema & Data Repository Pattern
- **Animations**: CSS & Framer Motion

---

## Key Features Implemented (Phase 1)
1. **Dynamic Architecture**:
   - `src/config/site.ts`: Centralized configuration for all contact info, addresses, and phone numbers.
   - `src/types/property.ts`: Database-aligned TypeScript contracts matching future Supabase tables.
   - `src/lib/properties.ts`: Async data access layer with search, filter, and stats queries. Swapping mock data to Supabase client in Phase 2 requires zero changes to frontend UI components.

2. **Public Website Pages**:
   - `/` (Home): Hero with high-resolution imagery, quick property search bar, 5 category showcases, featured property cards, and trust section.
   - `/properties`: Full catalog with multi-criteria filters (Location, Property Type, Budget, Area, Availability Status, Sort Order).
   - `/properties/[slug]`: Property details page with multi-image gallery, interactive thumbnail strip, fullscreen lightbox modal, specifications overview, Google Maps link, and dynamic WhatsApp/call actions.
   - `/about`: Honest, transparent About page with local Dindigul market focus and zero fabricated claims.
   - `/contact`: Direct contact info, Banumathi B details, Call Now & WhatsApp direct buttons, and Dindigul location.

3. **Property Contact Actions**:
   - Direct phone calling: `tel:9750176664`
   - Dynamic property-specific WhatsApp enquiries:
     `"Hi, I'm interested in [Property Name] in [Location]. I would like to know more about this property."`

4. **Admin Foundations**:
   - `/admin`: Protected admin login UI.
   - `/admin/dashboard`: Real-time stats cards (Total, Available, Reserved, Sold) dynamically calculated from the property dataset, with property management table.
   - `/admin/properties/new`: Add property form with auto-generating slug, validations, and photo input fields.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```
The application runs on `http://localhost:3000`.
