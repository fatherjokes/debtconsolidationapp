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
