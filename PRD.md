# Planning Guide

The single portal that connects Paraty residents and tourists with all local events, eliminating the need to search across multiple WhatsApp groups, Instagram posts, physical posters, and outdated websites.

**Experience Qualities**:
1. **Effortless** - Information is immediately accessible with minimal clicks; no hunting required
2. **Trustworthy** - Real-time updates and clear status indicators ensure users can rely on the information
3. **Delightful** - Beautiful gradient blues with sophisticated details make discovering events feel premium

**Complexity Level**: Light Application (multiple features with basic state)
  - This is an event discovery and management platform with filtering, search, admin panel, and future API integration. It requires persistent state management, routing, and form handling but doesn't yet involve complex user accounts or payment processing.

## Essential Features

### Public Event Discovery
- **Functionality**: Browse and filter events by date, category, location, and search keywords
- **Purpose**: Help users quickly find relevant events without information overload
- **Trigger**: User visits homepage or navigates via header menu
- **Progression**: Landing → View gradient hero with search → Apply filters (category chips) → Browse event cards → Click for details
- **Success criteria**: Users can find today's events in under 10 seconds; mobile-first layout adapts seamlessly

### Event Detail Page
- **Functionality**: Display comprehensive event information with map, tickets, and social sharing
- **Purpose**: Provide all necessary details for users to decide and take action
- **Trigger**: Click event card from any list view
- **Progression**: Click card → Navigate to `/evento/:slug` → View large image + details → See location map → Click ticket CTA
- **Success criteria**: 100% of required info visible above fold on mobile; ticket URLs open in new tab correctly

### Time-Based Event Sections
- **Functionality**: Auto-organize events into "Today", "This Weekend", and "Upcoming" sections
- **Trigger**: System automatically categorizes based on Brazil/São Paulo timezone
- **Progression**: User scrolls homepage → Sees "Hoje em Paraty" section → Scrolls to "Fim de semana" → Views upcoming weeks
- **Success criteria**: Events correctly categorized by date/time; timezone handling prevents midnight bugs

### Admin Authentication
- **Functionality**: Secure login for event organizers to access management panel
- **Purpose**: Protect event creation/editing from unauthorized users
- **Trigger**: Click "Sou organizador" button in public header
- **Progression**: Public site → Click organizer button → Login form → Enter credentials → Validate → Access admin panel
- **Success criteria**: Protected routes redirect to login; mock auth persists in session; form validates email format

### Event Management Dashboard
- **Functionality**: List, filter, search, and manage all events with status indicators
- **Purpose**: Give organizers quick overview and control of their event portfolio
- **Trigger**: Login success redirects to `/admin/eventos`
- **Progression**: Login → View events table → Filter by status → Search by title → Click edit/duplicate/status actions
- **Success criteria**: Table displays all mock events; filters work instantly; actions update state correctly

### Event Creation & Editing
- **Functionality**: Comprehensive form with validation, preview, and multiple save options
- **Purpose**: Enable organizers to create rich, accurate event listings without developer help
- **Trigger**: Click "Novo evento" or "Editar" on existing event
- **Progression**: Dashboard → New/Edit → Fill form fields → See live preview → Validate → Choose save type (draft/schedule/publish) → Submit → Return to list
- **Success criteria**: All required fields validated; preview updates in real-time; invalid forms prevent submission; confirmation on discard

## Edge Case Handling

- **Canceled Events** - Display prominent warning badge; show "Evento cancelado" message on detail page; optionally hide from public lists
- **Events Not Found** - Friendly 404 page with "Evento não encontrado" and button back to homepage
- **Empty States** - Show encouraging messages like "Nenhum evento encontrado" with clear illustrations when filters return no results
- **Network Errors** - Display "Não foi possível carregar os eventos" with retry button (even for mocks, simulate delay)
- **Invalid Date Ranges** - Form validation prevents end time before start time; clear error messages
- **Missing Ticket URLs** - Hide ticket button when `ticketUrl` is null/undefined; show "Entrada gratuita" or similar
- **Mobile Navigation** - Collapse menu to hamburger below 768px; ensure touch targets are minimum 44×44px
- **Keyboard Navigation** - All interactive elements accessible via Tab; visible focus indicators on all controls
- **Loading States** - Skeleton cards during initial load; disabled buttons with spinner during save operations

## Design Direction

The design should evoke a sense of calm sophistication meets coastal vitality - like a premium concierge service for a beach town, where discovering events feels as refreshing as ocean breeze yet as reliable as a well-run boutique hotel. A minimal interface with generous breathing room lets event photography and content shine.

## Color Selection

Analogous blue scheme with cool tones creating a coastal, trustworthy atmosphere that feels both modern and timeless.

- **Primary Color**: Deep ocean blue `oklch(0.45 0.12 240)` - communicates trust, stability, and professionalism for the brand
- **Secondary Colors**: Sky blue `oklch(0.75 0.08 240)` for backgrounds and lighter elements; steel blue-gray `oklch(0.55 0.04 240)` for muted text
- **Accent Color**: Vibrant azure `oklch(0.65 0.15 230)` for calls-to-action, featured badges, and interactive hover states
- **Foreground/Background Pairings**:
  - Background (Very light blue `oklch(0.98 0.01 240)`): Deep charcoal text `oklch(0.20 0 0)` - Ratio 12.8:1 ✓
  - Card (Pure white `oklch(1 0 0)`): Deep charcoal text `oklch(0.20 0 0)` - Ratio 14.2:1 ✓
  - Primary (Deep ocean blue `oklch(0.45 0.12 240)`): White text `oklch(1 0 0)` - Ratio 6.8:1 ✓
  - Secondary (Sky blue `oklch(0.75 0.08 240)`): Deep charcoal text `oklch(0.20 0 0)` - Ratio 7.2:1 ✓
  - Accent (Vibrant azure `oklch(0.65 0.15 230)`): White text `oklch(1 0 0)` - Ratio 4.9:1 ✓
  - Muted (Light gray-blue `oklch(0.92 0.01 240)`): Medium charcoal `oklch(0.45 0 0)` - Ratio 6.1:1 ✓

## Font Selection

Typography should feel modern and highly legible while maintaining warmth - sans-serif with humanist qualities that work equally well for Portuguese event titles and body text.

- **Typographic Hierarchy**:
  - H1 (Hero title): Inter Bold / 48px desktop, 32px mobile / -0.02em letter spacing / line-height 1.1
  - H2 (Section headers): Inter SemiBold / 32px desktop, 24px mobile / -0.01em / line-height 1.2
  - H3 (Event titles): Inter SemiBold / 20px / normal / line-height 1.3
  - Body (Descriptions): Inter Regular / 16px / normal / line-height 1.6
  - Small (Meta info): Inter Medium / 14px / normal / line-height 1.5
  - Tiny (Labels/badges): Inter Medium / 12px / 0.01em / line-height 1.4

## Animations

Animations should feel like gentle ocean waves - present but never overwhelming, guiding attention without demanding it. Motion reinforces the feeling that this is a living, breathing event ecosystem.

- **Purposeful Meaning**: Smooth transitions between page navigations (300ms) suggest seamless exploration; hover states on cards (150ms scale+shadow) invite interaction; filter chips animate their active state to confirm selection
- **Hierarchy of Movement**: Hero gradient subtly shifts on scroll (parallax lite); event cards have the most animation on hover (lift effect); form fields get subtle focus animations; page transitions are gentle fades

## Component Selection

- **Components**: 
  - `Button` (primary CTA for tickets, secondary for filters) with hover lift effect
  - `Card` for event listings with image, gradient overlays on hover
  - `Badge` for categories and status indicators with custom color mapping
  - `Input`, `Textarea`, `Select` for admin forms with floating labels
  - `Calendar` (react-day-picker) for date selection in admin
  - `Switch` for featured toggle, `Checkbox` for multi-select
  - `Table` for admin event list with sortable headers
  - `Dialog` for confirmation modals (discard changes, delete event)
  - `Tabs` for future category navigation in admin
  - `Skeleton` for loading states matching card dimensions
  - `Toast` (sonner) for success/error feedback
  
- **Customizations**: 
  - Custom `EventCard` component with image aspect ratio 16:9, gradient overlay on hover, featured badge positioning
  - Custom `FilterChips` with icon + label, active state with filled background
  - Custom `PageHeader` with gradient background support
  - Custom `EmptyState` with illustration placeholder and encouraging copy
  - Custom `MapPlaceholder` component for event details (prepared for future Google Maps integration)
  
- **States**: 
  - Buttons: default (solid), hover (lift + shadow), active (pressed down), disabled (opacity 40%), loading (spinner + disabled)
  - Inputs: default (border-input), focus (border-accent + ring), error (border-destructive + error message), disabled (bg-muted)
  - Cards: default (white), hover (shadow-lg + scale 102%), pressed (scale 100%), featured (accent border)
  
- **Icon Selection**: 
  - `MagnifyingGlass` for search
  - `Funnel` for filters
  - `Calendar` for date indicators
  - `MapPin` for location
  - `Ticket` for ticket links
  - `MusicNotes`, `ForkKnife`, `Palette`, `Tree`, `Balloon` for categories
  - `PencilSimple` for edit
  - `Copy` for duplicate
  - `Eye` / `EyeSlash` for publish/unpublish
  - `Plus` for create new
  - `ArrowLeft` for back navigation
  
- **Spacing**: 
  - Page padding: `px-4 md:px-8 lg:px-16`
  - Section gaps: `space-y-12 md:space-y-16`
  - Card grid: `gap-6 md:gap-8`
  - Form fields: `space-y-4`
  - Inline elements: `gap-2`
  
- **Mobile**: 
  - Header collapses to hamburger menu at 768px with slide-in drawer
  - Event grid: 1 column mobile, 2 at 640px, 3 at 1024px, 4 at 1440px
  - Admin table switches to card view on mobile with key info only
  - Form preview moves below form fields on mobile (stacked layout)
  - Touch targets minimum 44px, increased padding on interactive elements
  - Bottom navigation bar for key actions on mobile admin panel
