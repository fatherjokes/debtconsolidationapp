# Debt Consolidation App — TODO

## Foundation
- [x] Database schema: assessments, results, shared_links tables
- [x] Global CSS: Swiss/International Typographic Style (white, red, black, grid)
- [x] Google Fonts: Inter or similar crisp sans-serif
- [x] App routing structure (Home, Assessment, Results, Share, 404)

## Landing Page
- [x] Hero section with bold CTA to start assessment
- [x] How-it-works explainer (3-step process)
- [x] Trust signals (disclaimer notice, privacy note)
- [x] Navigation header

## Multi-Step Questionnaire
- [x] Step 1: Total debt amount
- [x] Step 2: Monthly income
- [x] Step 3: Monthly budget / expenses
- [x] Step 4: Credit score range
- [x] Step 5: Number of creditors
- [x] Step 6: Home purchase timeline (1, 2, 3, 5+ years or not planning)
- [x] Step 7: Priority (speed, credit preservation, lowest payment)
- [x] Step 8: Risk tolerance (conservative, moderate, aggressive)
- [x] Progress bar and step indicator
- [x] Input validation and error states
- [x] Animated step transitions

## LLM Recommendation Engine
- [x] tRPC procedure: analyzeDebt (takes full assessment, returns ranked options)
- [x] Structured JSON schema for 5 options: consolidation loan, balance transfer, DMP, settlement, bankruptcy
- [x] Each option: suitability score, pros, cons, credit impact, timeline, plain-language explanation
- [x] Rank by suitability based on user profile
- [x] Save assessment + results to database

## Results Page
- [x] Ranked option cards with suitability score badges
- [x] Credit score impact indicator per option
- [x] Estimated timeline per option
- [x] Pros/cons list per option
- [x] Disclaimer and educational content for settlement/bankruptcy
- [x] Expandable detail sections

## PDF Export
- [x] Server-side PDF generation (html-pdf or puppeteer-free approach)
- [x] tRPC procedure: generatePDF
- [x] Full personalized results in PDF (not generic)
- [x] Download button on results page

## Shareable Link
- [x] Generate unique share token on results save
- [x] Public share page at /share/:token
- [x] Copy-to-clipboard share button on results page

## Conversational AI Chat
- [x] Post-results chat panel (slide-in or inline)
- [x] Context-aware: pre-loaded with user's assessment + results
- [x] Streaming responses
- [x] Suggested follow-up questions
- [x] Chat toggle button on results page

## SEO & Discoverability
- [x] Meta title, description, keywords per page
- [x] Open Graph tags (og:title, og:description, og:image, og:url)
- [x] Twitter Card tags
- [x] JSON-LD structured data (WebApplication, FAQPage)
- [x] robots.txt optimized for AI tool directories
- [x] sitemap.xml

## Tests
- [x] Vitest: analyzeDebt procedure input validation
- [x] Vitest: share token generation
- [x] Vitest: PDF generation procedure

## SEO Expansion
- [x] Expand JSON-LD FAQ schema from 5 to 20 questions
- [x] Create 20 SEO scenario pages under /scenarios/
- [x] Register all 20 scenario routes in App.tsx
- [x] Add footer with scenario links to Home page
- [x] Update sitemap.xml with all 20 scenario URLs
- [x] Push to GitHub

## Accuracy Improvements
- [x] Update LLM system prompt with DTI qualification gates for consolidation loan recommendations
- [x] Add DMP success rate caveats and dropout risk warnings to LLM prompt
- [x] Audit all 20 scenarios for DTI/income accuracy
- [x] Fix scenarios where consolidation loan is recommended but DTI would disqualify
- [x] Fix scenarios where DMP is recommended without adequate dropout risk context
- [x] Add debt settlement as top pick for paycheck-to-paycheck high-DTI profiles
- [x] Push updated scenarios and prompt to GitHub

## Settlement-Focused Scenario Expansion (10 new scenarios)
- [x] Add 10 new paycheck-to-paycheck / high-debt settlement candidate scenarios to scenarios.ts
- [x] Generate 10 new scenario page files under /scenarios/
- [x] Register 10 new routes in App.tsx
- [x] Add new scenarios to footer category links
- [x] Update sitemap.xml with 10 new URLs
- [x] Push to GitHub and save checkpoint

## Calculator & Comparison Table
- [x] Build DebtSavingsCalculator component (minimum payments vs settlement visual comparison)
- [x] Build OptionsComparisonTable component (all 5 methods, pros/cons, success rates, credit impact)
- [x] Integrate both into shared ScenarioPage template (applies to all 30 pages)
- [x] TypeScript check, checkpoint, push to GitHub

## Sortable Options View
- [x] Build SortableOptionsView component with 3 tab views: Sort by Savings, Sort by Speed, Sort by Success Rate
- [x] Replace Home page risk-ordered options section with SortableOptionsView
- [x] Update OptionsComparisonTable default ordering to neutral (not risk-first)
- [x] TypeScript check, checkpoint, push to GitHub

## Scenario Reorganization & CTA
- [x] Merge all 30 scenarios into integrated SCENARIO_CATEGORIES (no separate settlement section)
- [x] Update Home page scenario count from 20 to 30
- [x] Add "Talk to a Debt Specialist" CTA button to Home page
- [x] Footer reflects new merged categories

## Admin Blog Drafting Tool, IndexNow & LLMs.txt
- [x] Add blog_posts table to drizzle/schema.ts (id, title, slug, excerpt, content longtext, category, categoryColor, sourceLabel, author, publishedAt, status draft/published, readingTime, createdAt, updatedAt)
- [x] Run pnpm drizzle-kit generate and apply migration SQL via webdev_execute_sql
- [x] Add DB helpers for blog posts in server/db.ts
- [x] Add tRPC blog router with adminProcedure for create/update/delete and publicProcedure for list/getBySlug
- [x] Add AI draft procedure: admin-only, takes topic+keywords, calls invokeLLM to generate full article in Adam's voice
- [x] Add IndexNow submit procedure: admin-only, submits URL to api.indexnow.org on publish
- [x] Generate IndexNow API key, host {key}.txt in client/public/, add INDEXNOW_KEY to secrets
- [x] Build /admin/blog page with DashboardLayout: article list, New Article button, draft/published status
- [x] Build /admin/blog/new and /admin/blog/edit/:id with topic input, Generate Draft button, editor, publish button
- [ ] Update Blog.tsx to read from DB (tRPC) with fallback to static blogPosts.ts [pending]
- [ ] Update BlogPost.tsx to read from DB by slug with fallback to static data [pending]
- [x] Add /admin/blog and /admin/blog/new and /admin/blog/edit/:id routes to App.tsx
- [x] Create llms.txt in client/public/ with site overview, pages, blog post links
- [x] Create llms-full.txt in client/public/ with full article summaries
- [x] Add llms.txt and llms-full.txt links to robots.txt
