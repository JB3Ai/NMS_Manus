export const navigation = [
  ["overview", "Overview"],
  ["vault", "Document vault"],
  ["history", "Brand & history"],
  ["current", "Current state"],
  ["roadmap", "Implementation"],
  ["brand", "New brand"],
  ["marketing", "Marketing"],
  ["products", "Products"],
  ["videos", "Video briefings"],
  ["compliance", "Compliance"],
  ["engagement", "Engagement"],
  ["commerce", "Shopify & ordering"],
  ["risks", "Risks & controls"],
  ["costing", "Cost framework"],
  ["decisions", "Decisions"],
] as const;

export const proposalVideos = [
  {
    id: "sg7f5TGbeno",
    youtubeUrl: "https://youtu.be/sg7f5TGbeno",
    title: "The Digital Operating System",
    executiveTitle: "Digital Growth & Commerce Relaunch",
    subtitle: "Operating model for the website, social channels, CRM, customer service and gated online ordering.",
    duration: "≈ 7 min",
    thumbnail: "https://img.youtube.com/vi/sg7f5TGbeno/hqdefault.jpg",
    status: "Available",
  },
  {
    id: "RncAWK7UVHk",
    youtubeUrl: "https://youtu.be/RncAWK7UVHk",
    title: "The 90-Day Transformation Blueprint",
    executiveTitle: "90-Day Transformation Plan",
    subtitle: "Decision gates, executive ownership, early priorities and milestones for the first delivery sprint.",
    duration: "≈ 5 min",
    thumbnail: "https://img.youtube.com/vi/RncAWK7UVHk/hqdefault.jpg",
    status: "Available",
  },
  {
    id: "A1k4S4FmYG4",
    youtubeUrl: "https://youtu.be/A1k4S4FmYG4",
    title: "The Heritage Trap",
    executiveTitle: "Heritage, Proof & Brand Risk",
    subtitle: "How to preserve the 1934 heritage story while controlling evidence, claims and reputation risk.",
    duration: "≈ 5 min",
    thumbnail: "https://img.youtube.com/vi/A1k4S4FmYG4/hqdefault.jpg",
    status: "Available",
  },
] as const;

export const statusMetrics = [
  { value: "12", label: "source documents reconciled" },
  { value: "247", label: "catalogue rows held for verification" },
  { value: "3–5", label: "hero SKUs proposed for pilot" },
  { value: "4", label: "formal investment gates" },
];

export const currentIssues = [
  { title: "Corporate identity", status: "Unresolved", detail: "Conflicting legal entities, registration numbers, ownership wording, domains and signatories require official diligence." },
  { title: "Heritage", status: "Qualified only", detail: "The archive repeatedly traces roots to 1934, but uninterrupted legal continuity is not proved." },
  { title: "Product catalogue", status: "Hold", detail: "All 247 tracked rows require physical, regulatory, quality, commercial, logistics and digital verification." },
  { title: "Claims", status: "Quarantine", detail: "Legacy disease, cure, detox, blood-pressure, diabetes, infection, pregnancy and slimming copy must not be reused." },
  { title: "Brand architecture", status: "Decision", detail: "NMS, Nature’s Own, NU Organic, Lexan and distributed ranges have no approved current hierarchy." },
  { title: "Ecommerce", status: "Gated", detail: "Checkout is not launch-ready until product, fulfilment, policy, privacy and service acceptance tests pass." },
];

export const roadmap = [
  { phase: "Mobilise & preserve", timing: "Week 0–1", gate: "Mobilisation", output: "Named owners, data room, archive freeze, decision and approval workflow." },
  { phase: "Corporate, product & compliance truth", timing: "Weeks 1–6", gate: "Gate A", output: "Verified entity, legal particulars, licence map, active-product universe and claims red list." },
  { phase: "Market & commercial validation", timing: "Weeks 2–10", gate: "Gate B", output: "Research, channel economics and approved scorecards selecting three to five hero candidates." },
  { phase: "Brand, architecture & experience", timing: "Weeks 7–14", gate: "Strategy approval", output: "Name/IP work, architecture, positioning, three identity routes and service blueprint." },
  { phase: "Identity, packaging & platform", timing: "Weeks 12–26", gate: "Gate C", output: "Approved hero packs, PIM/CMS, verified catalogue, CRM, chatbot, policies, analytics and UAT." },
  { phase: "Controlled Gauteng pilot", timing: "Months 7–9", gate: "Gate D", output: "DTC where ready, one specialist partner and a proposed 15–30 independent-pharmacy test." },
  { phase: "Scale what works", timing: "Months 10–18", gate: "Board decision", output: "Selective regional and chain expansion based on safety, repeat, contribution and supply evidence." },
];

export const logoOptions = [
  { name: "The Verified Root", tag: "Recommended concept route", detail: "A compact provenance symbol using geometric roots and upward growth in negative space, paired with a clear NMS wordmark.", strength: "Traceability and living heritage", risk: "Must avoid a generic leaf badge" },
  { name: "The NMS Standard", tag: "Challenger route", detail: "A wordmark or boxed N–M–S monogram suggesting controlled records, label panels or accountable containers.", strength: "Institutional confidence and production versatility", risk: "Can feel over-clinical" },
  { name: "Botanical Ledger", tag: "Non-botanical challenger", detail: "A disciplined typographic system that makes ingredients, evidence and information hierarchy the primary brand signature.", strength: "Distinctive without herbal clichés", risk: "Needs warmth and consumer testing" },
];

export const colourOptions = [
  { name: "Heritage Apothecary", swatches: ["#1E4D3B", "#7FA98C", "#F6F1E7", "#D9A036", "#B04A3A"], note: "Warmest heritage expression; red reserved for internal risk states." },
  { name: "Modern Botanical", swatches: ["#173F35", "#2E6F69", "#F3F0E8", "#252B29", "#B86B43"], note: "Recommended starting point balancing natural origin, pharmacy credibility and mobile clarity." },
  { name: "Clinical Nature / NMS Standard", swatches: ["#0F382B", "#427A70", "#F5F2EB", "#1C1C1C", "#C26E4B"], note: "Most systematised challenger tokens; square geometry and information-first typography." },
];

export const marketingChannels = [
  { name: "Website & SEO", role: "Verified catalogue, ingredient literacy, stockist discovery, trade access and compliant search content." },
  { name: "CRM & email", role: "Transactional service first, then consented education, replenishment and lifecycle communication." },
  { name: "WhatsApp & calls", role: "Accessible care, order support and full-context escalation to trained humans or professionals." },
  { name: "Instagram & Facebook", role: "Education, community, retargeting and service—governed by approved claims and moderation." },
  { name: "TikTok & YouTube", role: "Short and long-form label literacy, quality processes and safe-use education; no miracle demonstrations." },
  { name: "LinkedIn & trade", role: "Manufacturing credibility, quality systems, retailer support and B2B/professional engagement." },
  { name: "Pharmacy pilot", role: "Physical trial, buyer feedback, sell-through, reorder, training and shelf-comprehension evidence." },
  { name: "Paid media", role: "Controlled experiments with contribution-based stop and reallocation rules—not fixed legacy splits." },
];

export const productCriteria = [
  { name: "Regulatory & claims readiness", weight: 25, detail: "Classification, licence fit, formula identity, permitted claims, warnings and label feasibility." },
  { name: "Existing demand / repeat potential", weight: 15, detail: "Verified sales, enquiries, retailer interest, repeat interval and current pilot evidence." },
  { name: "Gross contribution", weight: 15, detail: "Net revenue after product cost, channel costs, VAT, discounts, fulfilment, returns and promotions." },
  { name: "Supply & quality resilience", weight: 15, detail: "Supplier continuity, botanical identity, specifications, lead time, batch consistency and stability." },
  { name: "Brand differentiation", weight: 10, detail: "Distinctive, credible value without prohibited claims, tested for comprehension and trust." },
  { name: "Retail operability", weight: 10, detail: "Shelf clarity, pack size, codes, case packs, margin, shelf life, OTIF and training burden." },
  { name: "Digital discoverability", weight: 5, detail: "Search intent, compliant naming, structured data, metadata and mobile comprehension." },
  { name: "Cross-sell / regimen fit", weight: 5, detail: "Safe complementary use, replenishment and bundle logic reviewed for confusion and interaction risk." },
];

export const complianceLayers = [
  { title: "Product classification", text: "Each SKU requires a product-specific regulatory position based on composition, dose, intended use, claim, schedule, licence scope and label." },
  { title: "Claims matrix", text: "Control exact permitted wording, prohibited language, required qualifiers, warnings, evidence, approver, channels and review date." },
  { title: "Quality dossier", text: "Control formulations, botanical identity, suppliers, specifications, analytical methods, stability, batch evidence, packaging and release responsibility." },
  { title: "Safety operations", text: "Separate enquiries, complaints, product-quality issues and adverse events with trained escalation, records, reporting and recall readiness." },
  { title: "Privacy & direct marketing", text: "Apply POPIA consent, minimisation, suppression and opt-out rules across calls, email, messaging, social DMs, cookies and CRM." },
  { title: "Consumer & ecommerce", text: "Use accurate disclosure, fair marketing, clear terms, delivery/returns, secure transactions and accessible error recovery." },
];

export const engagementFlows = [
  { channel: "Calls", steps: "Approved script → consent → CRM case → professional escalation → documented close-out" },
  { channel: "Chatbot", steps: "Approved knowledge base → safe refusal → confidence/risk trigger → full-context human handoff" },
  { channel: "Email", steps: "Transactional service → consented education → segmentation → compliant replenishment" },
  { channel: "WhatsApp", steps: "Verified business identity → care and order support → consent → case continuity" },
  { channel: "Social", steps: "Moderation → private support for personal data → adverse-event escalation → source retention" },
];

export const risks = [
  ["Wrong legal identity", "Invalid contracts and disclosure", "CIPC, ownership and signatory diligence before Gate A"],
  ["Unsupported heritage or claims", "Misleading marketing and safety exposure", "Detachable heritage module, claims red list and product approvals"],
  ["Fragmented product data", "Wrong labels, warnings, prices or orders", "One governed PIM; no direct PDF-to-site migration"],
  ["Unsafe chatbot or social advice", "Harm, privacy exposure and lost trust", "Approved sources, hard guardrails, moderation, UAT and human handoff"],
  ["Premature ecommerce", "Failed orders, complaints and privacy breaches", "Catalogue-first release and operational acceptance before checkout"],
  ["Weak unit economics", "Cash strain and negative return", "Actual NMS inputs, staged media and contribution-based stop rules"],
  ["Supply or quality failure", "Stockouts, inconsistency or recall", "Qualified suppliers, specifications, stability and lot traceability"],
  ["Over-expansion", "Working-capital pressure and returns", "Few SKUs, few stores, measured pilot and evidence-led scale"],
];

export const costBlocks = [
  "Programme mobilisation and governance",
  "Legal, corporate, ownership, heritage and IP diligence",
  "Regulatory, licence, claims and pharmacovigilance work",
  "Product master, quality, laboratory and supplier remediation",
  "Market, customer, retailer and commercial validation",
  "Brand architecture, naming, identity and testing",
  "Hero-SKU packaging, prototypes and production proof",
  "PIM, CMS, website, integrations and optional commerce",
  "CRM, chatbot, service design and UAT",
  "Content, photography, metadata and compliance review",
  "Gauteng pilot, trade activation and controlled media",
  "Ongoing operations, maintenance, monitoring and contingency",
];

export const decisionAreas = [
  { area: "programme_ownership", label: "Programme ownership", options: ["Approve sponsor and transformation lead", "Needs discussion"] },
  { area: "heritage", label: "Heritage wording", options: ["Verify ‘Established 1934’", "Use ‘Roots traced to 1934’", "No date claim yet"] },
  { area: "architecture", label: "Brand architecture", options: ["NMS endorsed masterbrand", "Alternative architecture required", "Needs testing"] },
  { area: "theme", label: "Design direction", options: ["Heritage Apothecary", "Modern Botanical", "Clinical Nature / NMS Standard"] },
  { area: "logo", label: "Logo route", options: ["The Verified Root", "The NMS Standard", "Botanical Ledger"] },
  { area: "commerce", label: "Commerce approach", options: ["Catalogue first; gate checkout", "Build checkout in parallel", "Platform study first"] },
  { area: "pilot", label: "Pilot direction", options: ["Approve Gauteng pilot design", "Revise pilot channels", "Needs thresholds first"] },
  { area: "commercial_model", label: "Commercial model", options: ["Stage-gated project", "Recurring programme", "Hybrid model"] },
];
