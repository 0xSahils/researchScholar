Here's your prompt:

---

**RESEARCHSCHOLARS.ONLINE — PHASE 2 ADDITIONS**

You are working on an existing Next.js 14 + Supabase + Razorpay + Resend codebase for ResearchScholars.online. Main frontend pages already exist. Now implement everything below end to end. No placeholders, no TODOs, fully working code only.

---

## 1. FRONTEND FIXES ON EXISTING PAGES

**FAQ Component — All Pages:**
Replace any existing FAQ with a proper animated accordion. Each question is a clickable row with a Phosphor CaretDown icon that rotates 180° on open. Answer slides down with max-height CSS transition (not display:none toggle — must animate smoothly). Only one answer open at a time. Green left border appears on open question. Never show all answers open by default.

**Process/Steps Sections — All Pages:**
Remove any plain numbered list or card grid used for steps. Replace with a proper alternating timeline: odd steps have content left + icon right, even steps have icon left + content right. A vertical SVG connector line runs down the center between steps. Each step reveals sequentially on scroll using IntersectionObserver with 150ms stagger. Step number displayed in large JetBrains Mono behind the card at low opacity as decorative element. Never render steps as plain cards in a row.

**Scopus Publication Page — Add These Sections:**

Section: "Journals We Work With" — horizontal scrolling logo strip of real Scopus-indexed journal publishers: Elsevier, Springer Nature, Wiley, Taylor & Francis, Sage, IEEE, Emerald, MDPI. Each logo in a white rounded card with hover lift. [LEAVE IMAGE PLACEHOLDERS — mark clearly as: PUBLISHER_LOGO_ELSEVIER etc. — to be replaced with real logos]

Section: "Rejection Reasons Visual" — animated horizontal CSS bar chart. Each bar animates from 0% to its value when section enters viewport using IntersectionObserver. Bars in dark green, percentage label at bar end, reason label below. Data: Poor Manuscript Structure 31%, Wrong Journal Selection 24%, Formatting Non-Compliance 18%, Weak Abstract 15%, Citation Issues 12%. No chart library — pure CSS width transition.

Section: "Subject Fields We Cover" — icon chip grid. 3 rows of pill-shaped chips. Each chip: Phosphor icon + subject name. Fields: Mechanical Engineering, Computer Science & AI, Management & Business, Medical Sciences, Life Sciences & Biotech, Civil Engineering, Electrical Engineering, Social Sciences, Law & Jurisprudence, Architecture, Education & Pedagogy, Environmental Sciences. [LEAVE ICON PLACEHOLDERS — comment in code: TODO: replace with subject-specific Phosphor icon]

Section: "Timeline Comparison" — two-column table styled as a visual comparison. Left column: "Without ResearchScholars" (red X items). Right column: "With ResearchScholars" (green check items). Items: Journal selection (guesswork vs expert-matched), Submission format (generic vs exact journal template), Abstract quality (unclear vs structured for acceptance), Revision response (unknown vs guided), Time to acceptance (12+ months vs avg 45 days). Style as a premium feature comparison table not a basic HTML table.

**Research Support Page — Add These Sections:**

Section: "The Numbers That Universities Never Showed You" — 5 large typographic stats. Each stat: number in JetBrains Mono 96px dark green, 1-line description in Inter below. Displayed in a 5-column row on desktop, 2-column on mobile. Stats: 68% journal submissions rejected first round / 40% thesis submissions need major revision / 2% of Indian researchers ever publish internationally / 4500+ predatory journals falsely claim Scopus indexing / 1 in 6 PhD students has an actively publishing research mentor. Each number animates count-up on viewport entry.

Section: "Subject Fields" — same chip grid as Scopus page. Reuse the component.

Section: "Delivery Timeline Visual" — horizontal visual timeline bar. Each service shown as a labeled bar of proportional width. Service name left-aligned, time range right-aligned, colored bar between them fills on scroll. Assignment (24–48 hrs) shortest bar, Scopus Publication (15–45 days) longest bar. Dark green bars, labels in Inter.

**All Pages — Global Additions:**
- Add Phosphor icons to every feature point, checklist item, stat label, process step, and section eyebrow label. No section should have plain text without an accompanying icon.
- Every CTA button must have a Phosphor ArrowRight icon on the right that moves 4px right on hover using CSS transition.
- WhatsApp floating button: fixed bottom-right, green circle 56px, Phosphor WhatsappLogo icon, animated CSS pulse ring, opens wa.me link with pre-filled message: "Hi ResearchScholars, I need help with [topic]. My deadline is [date]."
- Announcement bar: infinite CSS marquee with pause-on-hover. Two content copies side by side for seamless loop.

---

## 2. BLOG SYSTEM

**Database — Supabase:**

Table: blogs — id (uuid pk), title, slug (unique), excerpt, cover_image_url, content (jsonb — array of blocks), author_name, author_avatar_url, author_designation, category, tags (text array), meta_title, meta_description, focus_keyword, og_image_url, reading_time_minutes, is_published (boolean default false), published_at (timestamptz), created_at, updated_at, view_count (int default 0)

Table: blog_categories — id, name, slug (unique), description, color (hex string for category chip)

Blog content stored as JSON block array. Block types: paragraph, heading2, heading3, bulletList, numberedList, image (url+alt+caption), quote (content+author), callout (variant: info/warning/tip + content), divider, link (text+url+isExternal), table (headers array + rows 2D array)

**Frontend — /blog (listing page):**
- Full SSR, meta title "Academic Research Insights — ResearchScholars Blog", OG tags, canonical
- Dark green hero banner: "Academic Insights — PhD Scholar Perspectives" + subtitle about PhD-written content
- Featured post: first published post shown as large hero card — full-width cover image with dark overlay, category chip, H2 title, excerpt, author avatar+name+date+reading time, "Read Article →" button
- Category filter pills below hero — All + each category. Active = filled green. On click filters posts client-side (no page reload)
- 3-column blog card grid. Each card: cover image (aspect-video, lazy loaded, placeholder shimmer while loading) + colored category chip + title (2 lines clamped, Nunito Sans Bold 20px) + excerpt (3 lines clamped) + author row (32px circle avatar + name + date) + reading time badge + "Read More →" link
- Right sidebar: Popular Posts (top 5 by view_count) + Categories with count + CTA card "Need Research Help? Place Your Order →"
- Pagination: 9 posts per page, numbered pagination
- Empty state: if no posts in category, show illustrated empty state with message

**Frontend — /blog/[slug] (article page):**
- Full SSR with dynamic SEO: meta title from blog.meta_title, meta description, og:image from og_image_url, canonical, JSON-LD Article schema with author/publisher/datePublished
- Reading progress bar: 3px green line at absolute top of viewport tracking scroll percentage
- Hero: full-width cover image with dark overlay gradient, category chip, H1 in DM Serif Display 52px, author row (avatar + name + designation + date + reading time)
- Table of contents: auto-generated from all heading2 and heading3 blocks. Sticky on desktop right sidebar. Active heading highlighted in green as user scrolls. Smooth scroll on click.
- Article content renderer — render every block type with premium styling:
  - paragraph: Inter 17px, line-height 1.85, color var(--text-mid), margin-bottom 24px
  - heading2: Nunito Sans Bold 30px, dark, 3px green left border, padding-left 16px, margin-top 48px margin-bottom 16px
  - heading3: Nunito Sans Bold 22px, dark, margin-top 32px margin-bottom 12px
  - image: next/image full width, rounded-xl, caption below in Inter italic 14px grey
  - bulletList: each item has Phosphor ArrowRight icon 14px green, Inter 17px, 8px gap between items
  - numberedList: number in JetBrains Mono in 28px green circle badge, text Inter 17px
  - quote: left border 4px var(--gold), bg #FFFDE7, padding 20px 24px, italic, author line below in small grey
  - callout info: blue-50 bg, Phosphor Info icon blue, rounded-lg, padding 16px
  - callout warning: orange-50 bg, Phosphor Warning icon orange
  - callout tip: green-50 bg, Phosphor Lightbulb icon green
  - divider: thin line with small Phosphor Diamond icon centered in green
  - table: green header row white text, alternating row bg var(--green-100) and white
  - link: green underline, Phosphor ArrowSquareOut icon if isExternal=true
- After content: author bio card — avatar 80px circle, name bold, designation in green, short bio, "View all posts" link
- Related posts: 3 cards from same category, same card design as listing
- CTA banner: dark green, "Need Help With Your Research? PhD Scholars Available Today" + "Place Your Order →"
- Increment view_count on each page visit via server action
- generateStaticParams for all published slugs, revalidate: 3600

**SEO for Blog:**
- /sitemap.xml: Next.js sitemap.ts — include all static pages + all published blog slugs with lastmod = updated_at
- /robots.txt: allow all crawlers, include sitemap URL
- Every blog post generates full OpenGraph tags and Twitter card tags
- JSON-LD Article schema on every post
- Internal linking: at end of every article, CTA links back to relevant service page (based on category — thesis category links to /services, scopus category links to /scopus-publication)

**Target keywords per category (use in meta titles and descriptions):**
- Thesis Writing: "how to write a thesis India", "thesis writing guide PhD"
- Scopus Publication: "how to publish in Scopus journal", "Scopus paper acceptance India"
- Research Methodology: "PhD research methodology guide", "IMRaD format explained"
- Assignment Help: "academic assignment writing tips India"

---

## 3. ADMIN DASHBOARD

Route prefix: /admin — protected by Supabase middleware. Only users with role='admin' in profiles table can access. Redirect others to /admin/login.

Admin login page: /admin/login — email+password form, Supabase auth signInWithPassword, redirect to /admin on success.

**Layout:** Left sidebar 240px with Phosphor icons, collapses to icon-only on mobile. Logo top, nav links middle, logout bottom. Active link: green bg pill. Top bar: page title + breadcrumb + notification bell (badge = count of orders with deadline within 48 hours).

**Nav links with Phosphor icons:**
- ChartBar → Dashboard
- Package → Orders  
- Plus → Add Order
- CurrencyDollar → Pricing & GST
- Article → Blog Posts
- Tag → Blog Categories
- Gear → Site Settings
- SignOut → Logout

**Dashboard Home /admin:**
- 4 KPI cards in a row: Total Orders This Month (Phosphor Package icon) / Orders Pending Work (Phosphor Clock icon, orange) / Unpaid/Partial Payments (Phosphor Money icon, red) / Revenue This Month in ₹ (Phosphor TrendUp icon, green)
- 2 charts side by side using Recharts: Orders by Work Status (donut chart) + Revenue last 30 days (area chart, green fill)
- Deadline alerts: orange banner if any order has deadline within 48 hours, listing order numbers with "View" link
- Recent orders table: last 10, columns: Order # / Customer / Service / Deadline / Work Status chip / Payment Status chip / Actions

**Orders List /admin/orders:**
- Search bar + filter dropdowns: Work Status / Payment Status / Service Type / Date range
- Table columns: Order # | Customer Name + email | Service | Deadline (red if overdue) | Work Status chip | Payment Status chip | Amount ₹ | Actions (View + Send Doc)
- Work status chip colors: pending=slate, assigned=blue, in_progress=amber, under_review=purple, completed=teal, delivered=green, revision_requested=orange
- Payment status chip colors: unpaid=red, advance_paid=yellow, fully_paid=green, refunded=slate
- Export CSV button
- Pagination 20 per page

**Order Detail /admin/orders/[id]:**
Two-panel layout. Clearly separated with labels.

LEFT PANEL — header: "Work Status" with green accent bar top:
- Customer info: name, email, phone, WhatsApp, university — all copyable (click to copy with Phosphor Copy icon)
- Service details: service type, subject, topic, word count, deadline (red if past), referencing style, instructions
- Customer files: list with Phosphor File icon, filename, upload date, Download button each
- Assigned Expert: inline editable text field with Phosphor PencilSimple icon. Save on blur.
- Work Status: large styled select with colored options. On change: updates DB, logs timestamp, sends automated email to customer if status changes to 'delivered' or 'revision_done'
- Internal Notes: textarea for admin only. Auto-saves on blur.
- Delivery Documents panel:
  - List of sent documents: filename + version label + sent date + Phosphor Download button
  - Upload zone: drag-drop or click, accepts PDF and DOCX only, max 50MB
  - Version label input (e.g. "v1", "v1 revised", "Final")
  - "Send Document to Customer" button: uploads to Supabase Storage → sends Resend email with download link → logs in delivery_files jsonb → updates work_status to 'delivered' → shows success toast. This must be ONE CLICK after file is selected and version labeled.
  - Email template for document delivery: branded ResearchScholars header, customer name, order number, service type, message "Your document is ready", download button, "For any revisions contact us on WhatsApp" link

RIGHT PANEL — header: "Payment Status" with gold accent bar top:
- Pricing calculator (all fields editable):
  - Base price (from service_pricing, editable)
  - Word count × price per word (auto-calculated, shown in grey)
  - Subtotal
  - GST % (from site_settings, editable override per order)
  - GST Amount (auto-calculated)
  - Total Amount (bold, large)
  - Advance Required (default 50% of total, editable %)
  - Advance Paid (from transactions, auto-summed, read-only)
  - Balance Due (auto-calculated, red if > 0)
- Save Pricing button: saves total_amount, gst_amount, advance_amount, balance_amount to order
- Payment Status: large styled select
- Transaction History: table — Date / Amount / Type (advance/balance/full) / Method / Razorpay ID / Status chip
- "Add Manual Payment" button: opens modal — Amount field + Method dropdown (UPI/Cash/Bank Transfer/Card) + Reference number + Type (advance/balance/full) + Notes → saves to payment_transactions → recalculates amounts → updates payment_status automatically based on logic:
  - If advance_paid >= advance_amount AND balance > 0 → advance_paid
  - If total paid >= total_amount → fully_paid
- "Generate Payment Link" button: creates Razorpay Payment Link via API for specified amount → shows link in modal with copy button + "Send to Customer Email" button (sends via Resend)
- Razorpay IDs: shown as copyable read-only fields if exist

**Add Order Manually /admin/orders/new:**
All fields from customer order form PLUS:
- Source: WhatsApp / Phone Call / Email / Referral / Walk-in / Other
- Quoted Total Price (override auto-calc)
- Advance Amount
- Initial Payment Status
- Initial Work Status  
- Assigned Expert
- Internal Notes
- Checkbox: "Send confirmation email to customer"
Auto-generate order_number: RS-[YEAR]-[3-digit-padded-sequence]
On save: create order record + create payment_transaction if advance marked as paid + optionally send customer email

**Pricing & GST /admin/pricing:**
- Table of 6 services: Service Name / Base Price / Price Per Page / Price Per Word / Urgent Multiplier / Min Price / Last Updated / Edit
- Edit: inline row editing — click Edit turns row into input fields — Save / Cancel buttons. On save: update service_pricing, log updated_at and updated_by.
- GST Settings card: current GST rate % input + Update button. Shows last updated timestamp.
- Advance % setting card: same pattern
- WhatsApp number setting card: same pattern
- Live Price Calculator: Service selector + word count input + page count input + urgent toggle → shows real-time price breakdown: base + word calc + subtotal + GST + total. Updates on every keystroke.

**Blog Admin /admin/blog:**
- Table: Cover image thumbnail / Title / Category chip / Status (Published/Draft) / Published Date / Views / Actions (Edit / Preview / Toggle Publish / Delete with confirm modal)
- "New Blog Post" primary button

**Blog Editor /admin/blog/new and /admin/blog/[id]/edit:**
Custom block editor. NOT a textarea. NOT markdown. Visual block-based editor.

Editor canvas (left, ~65%): white card, max-width 760px
- Title input at top: large, placeholder "Post Title...", Nunito Sans Bold 32px
- Below title: block list rendered in order
- Each block on hover: shows left drag handle (Phosphor DotsSixVertical), block type label, delete button (Phosphor Trash, red on hover)
- Click any block to edit it inline
- Press Enter at end of paragraph to add new paragraph block
- Type "/" at start of empty block to open block picker modal: shows all block types with icons and names, keyboard navigable, Enter to insert
- Drag-and-drop reordering using @dnd-kit/sortable

Block type inputs:
- paragraph: contenteditable div, styled as article paragraph
- heading2: contenteditable, styled as H2
- heading3: contenteditable, styled as H3
- bulletList: add/remove list items, each item editable
- numberedList: same as bullet
- image: shows upload zone → on upload stores in Supabase Storage → shows preview with alt text input and caption input
- quote: textarea for quote + input for author attribution
- callout: variant selector (info/warning/tip) + textarea for content
- divider: just a visual divider block, no editing needed
- link: text input + URL input + external toggle
- table: rows × columns grid of inputs, add/remove rows and columns buttons

Right sidebar (~35%): SEO & Publish Panel
- Post Title (synced with canvas title)
- Slug: auto-generated from title (kebab-case, max 60 chars) + manual override input
- Excerpt: textarea, 150 char limit with counter
- Category: select from blog_categories
- Tags: text input, press comma or Enter to add tag as chip, click chip × to remove
- Cover Image: drag-drop upload zone → Supabase Storage → preview with remove button
- OG Image: separate upload (defaults to cover image if not set)
- Author Name: text input
- Author Designation: text input
- Author Avatar: upload
- Meta Title: text input, 60 char limit with counter, green/orange/red indicator
- Meta Description: textarea, 160 char limit with counter
- Focus Keyword: text input
- Reading time: auto-calculated from content word count (200 words/min)
- Publish toggle: Draft / Published. When toggled to Published: sets published_at to now() if not already set.
- Save button: always visible, saves current state. Shows "Saved" with timestamp.
- Preview button: opens /blog/[slug] in new tab

**Blog Categories /admin/blog/categories:**
- Table: Name / Slug / Color chip / Post Count / Edit / Delete
- Add category: inline form — name (auto-generates slug) + color picker (6 preset colors + custom hex)

**Site Settings /admin/settings:**
- Cards for each setting group:
  - Payment Settings: GST Rate / Advance % / Razorpay Key ID (masked) / Razorpay Key Secret (masked, show/hide toggle)
  - Contact Settings: WhatsApp Number / Support Email / Working Hours text
  - SEO Settings: Site Title / Meta Description / OG Image upload / Google Analytics ID
  - All values from site_settings table, editable inline, save per card

---

## 4. PAYMENT SYSTEM — RAZORPAY + RESEND OTP VERIFICATION

**Flow:**
1. Customer fills order form on /order page
2. Before payment: verify both email AND phone
3. Email verification: send 6-digit OTP via Resend to entered email. Input field appears. Verify OTP. Show green checkmark.
4. Phone verification: send 6-digit OTP via SMS (use Fast2SMS free tier or MSG91) to entered phone. Input field appears. Verify OTP. Show green checkmark.
5. Both must be verified before payment button activates
6. Customer selects payment type: Full Payment OR 50% Advance (default)
7. Razorpay order created server-side via API route with correct amount (including GST at current rate from site_settings)
8. Razorpay checkout opens with prefilled name, email, phone
9. On payment success: webhook hits /api/webhooks/razorpay — verify signature — update order payment_status — send confirmation email via Resend
10. On payment failure: show retry option, order stays in unpaid state

**Price calculation on order form:**
- Service selected → fetch base price from service_pricing table
- Word count entered → calculate: base_price + (word_count × price_per_word)
- Deadline within 48 hours → multiply by urgent_multiplier from pricing table
- Add GST at current rate from site_settings
- Show full breakdown to customer before payment: Subtotal + GST amount + Total

**Resend email templates needed:**
1. Email OTP: subject "Your ResearchScholars verification code", body: branded header + "Your code is: [OTP]" in large JetBrains Mono + "Valid for 10 minutes" + "If you did not request this ignore this email"
2. Order Confirmation: subject "Order Confirmed — RS-[order_number]", body: branded header + customer name + order summary table (service, topic, deadline, amount paid) + "Your assigned PhD scholar will begin work within 24 hours" + WhatsApp link + footer
3. Document Delivery: subject "Your Document Is Ready — RS-[order_number]", body: branded header + "Dear [name], your [service] document is ready for download" + large Download Document button + "For any revisions WhatsApp us" + footer
4. Payment Link: subject "Complete Your Payment — RS-[order_number]", body: branded header + amount due + pay now button (Razorpay link) + order summary + footer
5. Revision Requested: subject "Revision Received — We Are On It", body: confirmation that revision request received + expected turnaround + WhatsApp link

**Razorpay webhook /api/webhooks/razorpay:**
- Verify signature using crypto.createHmac
- Handle events: payment.captured → update payment_status, create transaction record, send confirmation email
- Handle payment.failed → log failure, send failure notification email
- Always return 200 immediately before processing to avoid Razorpay timeout

---

## 5. FRONTEND SEO — COMPLETE IMPLEMENTATION

Apply to every page:

**Metadata (Next.js generateMetadata):**
Every page must export generateMetadata returning: title, description, keywords, openGraph (title, description, images with width/height/alt), twitter (card:summary_large_image, title, description, images), canonical URL (absolute), robots: index follow

**Structured Data (JSON-LD):**
- Home page: Organization schema — name, url, logo, contactPoint (WhatsApp number, telephone, contactType: customer service), sameAs (social profiles)
- Services pages: Service schema — name, description, provider (Organization), areaServed: India
- Blog posts: Article schema — headline, author (Person), publisher (Organization with logo), datePublished, dateModified, image
- FAQ sections: FAQPage schema — each question/answer pair. Add to Home, Services, Scopus, Contact pages.

**sitemap.xml — /app/sitemap.ts:**
Static pages with priority: / (1.0), /about (0.8), /services (0.9), /scopus-publication (0.9), /research-support (0.8), /order (0.7), /contact (0.7)
Dynamic blog pages: fetch all published slugs from Supabase, each with lastmod=updated_at, priority 0.6, changefreq weekly

**robots.txt — /app/robots.ts:**
Allow all user agents. Disallow /admin. Include sitemap URL.

**Performance (apply everywhere):**
- All images via next/image with width, height, alt, loading="lazy" (except hero which is priority=true)
- next/font for all Google Fonts — no external font requests
- Route-level code splitting is automatic with App Router — ensure no unnecessary client components
- Any component with useState/useEffect must have "use client" directive
- Server components for all data-fetching pages (blog listing, blog post, services)

**Google Search Console:**
- Add verification meta tag to root layout head (leave placeholder: GOOGLE_SITE_VERIFICATION=your_token_here in .env)
- Auto-submit sitemap URL in documentation/README

---

## 6. IMPORTANT CONSTRAINTS

- Every interactive element (FAQ accordion, tab switch, timeline step reveal) must work without JavaScript disabled (progressive enhancement) — use CSS :checked or details/summary as fallback where possible
- All forms must have proper HTML label elements for every input (accessibility + SEO)
- Color contrast: all text must meet WCAG AA (4.5:1 minimum). Never use light grey text on white background.
- Every page title must be unique. Every meta description must be unique.
- No Lorem Ipsum anywhere in production code
- Individual service sub-pages (/services/thesis etc.) are NOT in scope — do not build them. Services page cards link directly to /order
- The admin panel /admin/* routes must be completely excluded from public sitemap and robots.txt
- Razorpay keys, Supabase keys, Resend API key, SMS API key must all be in .env.local and accessed only server-side — never exposed to client
- All Supabase queries must use Row Level Security — public can read published blogs and service pricing. Only admin role can write to any table.
- Order form must save to database BEFORE payment is initiated so no order is ever lost even if payment fails

---