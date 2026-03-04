# Rior Systems — Workflow Optimization Document

**Analyst:** atlas-3 (Workflow Analysis Sub-Agent)  
**Date:** March 3, 2026  
**Version:** 1.0  
**Scope:** Lead-to-client workflow, agent delegation, automation opportunities  

---

## Executive Summary

This document maps the complete client acquisition and delivery workflow for Rior Systems' Profit Intelligence service. Analysis reveals **15-20 hours of manual work per client** that can be reduced to **3-5 hours through strategic automation**, with **critical blockers** currently preventing revenue generation.

| Metric | Current State | Optimized State | Impact |
|--------|---------------|-----------------|--------|
| Time to First Client | BLOCKED | 3-5 days | Revenue unlock |
| Setup Time per Client | 15-20 hrs | 3-5 hrs | 75% reduction |
| Ongoing Hours/Month | 8-10 hrs | 1-2 hrs | 85% reduction |
| Cost per Client (labor) | ~$1,500 | ~$400 | 73% reduction |

---

## 1. CURRENT WORKFLOW MAPPING

### 1.1 Complete Lead → Client Journey

```
PHASE 1: ACQUISITION (Days 1-7)
├── PROSPECT (Lead Gen)
├── COLD EMAIL (5-touch sequence)
├── DISCOVERY CALL (Requirements gathering)
├── PROPOSAL & DEMO (Custom demo + SOW)
└── NEGOTIATE & CLOSE (Contract signed)

PHASE 2: ONBOARDING (Days 8-14)
├── CONTRACT (SOW finalized)
├── CREDENTIAL COLLECTION (API keys)
├── DATA SCHEMA DESIGN (BigQuery tables)
├── ETL SETUP (Data pipelines)
├── DASHBOARD BUILD (Looker Studio)
└── GO-LIVE (Training)

PHASE 3: OPERATIONS (Ongoing)
├── DAILY DATA SYNC (ETL runs)
├── ALERT MONITORING (Anomaly detection)
├── WEEKLY REPORT (Client updates)
└── MONTHLY REVIEW (Strategy call)
```

### 1.2 Detailed Step Breakdown

#### Phase 1: Acquisition

| Step | Owner | Current Method | Time Required | Output |
|------|-------|----------------|---------------|--------|
| **1.1 Lead Research** | atlas | Manual LinkedIn/search | 15-30 min/lead | Lead list with firmographics |
| **1.2 Email Personalization** | jackson | Template + manual edit | 5-10 min/email | Customized 5-touch sequence |
| **1.3 Send Sequence** | johnbot | Instantly.ai (automated) | 5 min setup | 5 emails over 14 days |
| **1.4 Discovery Call** | johnbot/rior | Manual (Calendly booked) | 30 min | Call notes, requirements doc |
| **1.5 Demo Generation** | samantha | Manual config + generate | 2-3 hours | Custom demo dashboard |
| **1.6 Proposal Writing** | jackson | Manual from template | 1-2 hours | PDF proposal + SOW |
| **1.7 Follow-up** | jackson | Manual email | 15 min | Follow-up message |

#### Phase 2: Onboarding

| Step | Owner | Current Method | Time Required | Output |
|------|-------|----------------|---------------|--------|
| **2.1 Contract/SOW** | johnbot | Template fill | 30 min | Signed agreement |
| **2.2 Credential Collection** | johnbot | Manual form/email | 1-2 hours | Shopify/Meta API keys |
| **2.3 Schema Design** | samantha | Manual SQL write | 2-3 hours | BigQuery table definitions |
| **2.4 ETL Development** | samantha | Custom Python | 4-6 hours | Data pipeline scripts |
| **2.5 Dashboard Build** | samantha | Looker Studio manual | 3-4 hours | Client dashboard |
| **2.6 Testing** | harper | Manual validation | 1-2 hours | QA report |
| **2.7 Go-Live Training** | johnbot | Video call | 1 hour | Trained client user |

#### Phase 3: Operations

| Step | Owner | Current Method | Time Required | Frequency |
|------|-------|----------------|---------------|-----------|
| **3.1 Data Sync** | samantha | Manual/scripted | 15 min | Daily |
| **3.2 Alert Monitoring** | harper | Manual check | 15 min | Daily |
| **3.3 Weekly Report** | jackson | Manual compile | 30 min | Weekly |
| **3.4 Monthly Review** | johnbot | Video call | 1 hour | Monthly |

---

## 2. BOTTLENECK IDENTIFICATION

### 2.1 Critical Blockers (Revenue Preventing)

| Blocker | Status | Impact | Root Cause |
|---------|--------|--------|------------|
| **GCP Service Account** | 🔴 BLOCKED | Cannot deploy BigQuery, entire service stalled | Missing approval for credentials |
| **Vercel Production Deploy** | 🔴 BLOCKED | No live website = no lead capture | Missing approval for deployment |
| **Meta API Token** | 🟡 PENDING | Cannot offer Meta ad data integration | OAuth flow not completed |
| **Shopify Partner Account** | 🟡 PENDING | Cannot use Shopify APIs efficiently | Account creation pending |
| **Calendly Integration** | 🟡 PENDING | Discovery booking not automated | Account setup needed |

### 2.2 Workflow Bottlenecks by Step

**Step 1.1: Lead Research**
- Time: 15-30 min/lead
- Manual vs Auto: 100% manual
- Dependencies: Clearbit/Hunter API (not configured)
- Failure Points: Limited to free LinkedIn search; no bulk processing

**Step 1.5: Demo Generation**
- Time: 2-3 hours per demo
- Manual vs Auto: 80% manual (config editing)
- Dependencies: Python environment, Harbor Goods template
- Failure Points: Manual YAML editing; no self-service for prospects

**Step 2.2: Credential Collection**
- Time: 1-2 hours per client
- Manual vs Auto: 100% manual
- Dependencies: Email back-and-forth, manual key entry
- Failure Points: Security concerns; incorrect key entry; no validation

**Step 2.3: Schema Design**
- Time: 2-3 hours per client
- Manual vs Auto: 100% manual
- Dependencies: Understanding of client data model
- Failure Points: Inconsistent schemas; no template library; redundant work

**Step 2.4: ETL Development**
- Time: 4-6 hours per client
- Manual vs Auto: 90% manual (only connectors scaffolded)
- Dependencies: Shopify/Meta APIs, credentials
- Failure Points: No orchestration; no error handling; no data quality checks

### 2.3 Time Analysis Summary

| Phase | Current Time/Client | Optimized Time | Savings |
|-------|---------------------|----------------|---------|
| Acquisition | 6-8 hours | 1-2 hours | 75% |
| Onboarding | 12-16 hours | 2-4 hours | 80% |
| Monthly Ops | 8-10 hours | 1-2 hours | 85% |
| **Total First Month** | **26-34 hours** | **4-8 hours** | **80%** |
| **Monthly Recurring** | **8-10 hours** | **1-2 hours** | **85%** |

---

## 3. SUB-AGENT DELEGATION MATRIX

### 3.1 Agent Capabilities by Workflow Step

| Step | johnbot | samantha | jackson | harper | atlas |
|------|---------|----------|---------|--------|-------|
| 1.1 Lead Research | | | | | ████ |
| 1.2 Email Writing | | | ████ | | |
| 1.3 Email Sending | ████ | | | | |
| 1.4 Discovery Call | ████ | | | | |
| 1.5 Demo Generation | | ████ | | | |
| 1.6 Proposal Writing | | | ████ | | |
| 2.1 Contract/SOW | ████ | | ████ | | |
| 2.2 Credential Coll. | ████ | | | | |
| 2.3 Schema Design | | ████ | | | |
| 2.4 ETL Development | | ████ | | | |
| 2.5 Dashboard Build | | ████ | | | |
| 2.6 Testing | | | | ████ | |
| 3.1 Data Sync | | ████ | | | |
| 3.2 Alert Monitoring | | | | ████ | |
| 3.3 Weekly Reports | | | ████ | | |
| 3.4 Monthly Review | ████ | | | | |

### 3.2 Detailed Agent Responsibilities

#### **johnbot (Main) — Orchestration, Approvals, Client Comms**
- **Model:** moonshot/kimi-k2.5 (reasoning, complex decisions)
- **Tasks:** Orchestration, approvals, discovery calls, contract negotiation, go-live training
- **When to Escalate:** Custom scope requests, pricing negotiation, relationship issues

#### **samantha (Coding) — Technical Setup, BigQuery, ETL**
- **Model:** openai/gpt-4o-mini (optimized for coding, cost-effective)
- **Tasks:** Schema design, ETL development, dashboard build, data sync
- **When to Escalate:** Complex SQL optimization, new API integrations, data corruption

#### **jackson (Writing) — Proposals, Emails, Documentation**
- **Model:** ollama/mistral:7b (local, fast for writing tasks)
- **Tasks:** Cold emails, proposals, documentation, weekly reports
- **When to Escalate:** Complex negotiation language, brand voice refinement

#### **harper (Heartbeats) — Monitoring, Daily Briefings, Health Checks**
- **Model:** ollama/gemma3:4b (local, efficient for monitoring)
- **Tasks:** Daily briefings, alert monitoring, health checks, sub-agent tracking
- **When to Escalate:** Critical system failure, data pipeline down, cost spike

#### **atlas (Search) — Research, Competitive Analysis, Lead Gen**
- **Model:** ollama/llama3.2:3b (local, fast for search tasks)
- **Tasks:** Lead research, competitive analysis, market research
- **When to Escalate:** Complex competitive positioning, new market entry

### 3.3 Parallel Execution Opportunities

**Current:** Sequential processing — one task at a time
**Optimized:** Parallel processing where possible

Examples:
- Research 10 leads simultaneously (atlas × 10)
- Build schema + ETL scaffold in parallel (samantha × 2)
- Dashboard build + documentation writing simultaneously (samantha + jackson)

**Time Savings:** 30-40% reduction in onboarding time

---

## 4. AUTOMATION OPPORTUNITIES

### 4.1 Specific Automation Build List

#### **AUTO-001: Auto-Generate Proposals from Discovery Call Notes**
- **Current:** 1-2 hours manual writing
- **Automated:** 15 minutes (extract requirements → match tier → fill template → generate PDF)
- **Time Savings:** 1-1.5 hours per proposal
- **Build Effort:** Medium (2-3 days)
- **ROI:** High (used for every new client)

#### **AUTO-002: Self-Service Onboarding Portal**
- **Current:** 1-2 hours email back-and-forth for credentials
- **Automated:** 15 minutes self-serve (brand profile → Shopify OAuth → Meta OAuth → preview → confirm)
- **Time Savings:** 3-4 hours per client
- **Build Effort:** High (1-2 weeks)
- **ROI:** Very High (eliminates major bottleneck)

#### **AUTO-003: Automated Demo Generation**
- **Current:** 2-3 hours manual config + generation
- **Automated:** API endpoint: POST /generate-demo → auto-create dataset → Looker link
- **Time Savings:** 2-3 hours per demo
- **Build Effort:** Medium (3-5 days)
- **ROI:** High (used for 80% of prospects)

#### **AUTO-004: Auto-Scaling Alerts**
- **Current:** Static thresholds, manual monitoring
- **Automated:** ML-based anomaly detection with seasonal adjustments
- **Time Savings:** 15 min/day monitoring
- **Build Effort:** Medium (2-3 days)
- **ROI:** Medium (ongoing operational efficiency)

#### **AUTO-005: Client Reporting Emails**
- **Current:** 30 min/week manual compile + write
- **Automated:** Weekly cron job → fetch metrics → generate charts → jackson writes narrative → send
- **Time Savings:** 30 min/week per client
- **Build Effort:** Low (1-2 days)
- **ROI:** High (scales with client count)

#### **AUTO-006: Automated Lead Scoring & Routing**
- **Current:** Manual qualification, no prioritization
- **Automated:** Score 0-100 based on firmographics + behavior + intent → route to appropriate queue
- **Time Savings:** 2 hours/week lead sorting
- **Build Effort:** Low (1 day)
- **ROI:** High (better conversion on high-value leads)

### 4.2 Automation Impact Summary

| Automation | Time Saved/Client | Time Saved/Month | Build Effort | Priority |
|------------|-------------------|------------------|--------------|----------|
| Proposal Generator | 1-1.5 hrs | 4-6 hrs | 2-3 days | HIGH |
| Onboarding Portal | 3-4 hrs | 12-16 hrs | 1-2 weeks | **CRITICAL** |
| Demo Generator | 2-3 hrs | 8-12 hrs | 3-5 days | HIGH |
| Auto-Scaling Alerts | N/A | 6-8 hrs | 2-3 days | MEDIUM |
| Weekly Reports | 2 hrs/mo | 6-8 hrs | 1-2 days | HIGH |
| Lead Scoring | N/A | 8 hrs | 1 day | MEDIUM |
| **TOTAL** | **~10 hrs first month** | **44-58 hrs** | **~4 weeks** | — |

---

## 5. TIME/COST SAVINGS

### 5.1 Current vs Automated Workflow Comparison

#### Phase 1: Acquisition

| Step | Current | Automated | Savings |
|------|---------|-----------|---------|
| Lead Research | 30 min/lead | 5 min/lead | 83% |
| Email Writing | 10 min/email | 1 min/email | 90% |
| Demo Generation | 3 hours | 15 min | 92% |
| Proposal Writing | 1.5 hours | 15 min | 83% |
| **Phase 1 Total** | **6-8 hours** | **1-2 hours** | **75%** |

#### Phase 2: Onboarding

| Step | Current | Automated | Savings |
|------|---------|-----------|---------|
| Credential Collection | 2 hours | 15 min | 88% |
| Schema Design | 2.5 hours | 30 min | 80% |
| ETL Development | 5 hours | 1 hour | 80% |
| Dashboard Build | 3.5 hours | 1 hour | 71% |
| Testing | 1.5 hours | 30 min | 67% |
| **Phase 2 Total** | **14.5 hours** | **3.25 hours** | **78%** |

#### Phase 3: Operations (Monthly)

| Step | Current | Automated | Savings |
|------|---------|-----------|---------|
| Daily Data Sync | 15 min/day | 0 min (scheduled) | 100% |
| Alert Monitoring | 15 min/day | 5 min/day | 67% |
| Weekly Report | 30 min/week | 5 min/week | 83% |
| Monthly Review Prep | 2 hours | 30 min | 75% |
| **Phase 3 Total** | **10 hrs/month** | **1.5 hrs/month** | **85%** |

### 5.2 Cost Analysis

#### Labor Cost Assumptions

| Agent | Hourly Rate | Rationale |
|-------|-------------|-----------|
| johnbot | $50/hr | Complex decisions, client-facing |
| samantha | $30/hr | Technical implementation |
| jackson | $20/hr | Content generation |
| harper | $15/hr | Automated checks |
| atlas | $20/hr | Research tasks |

#### Current vs Optimized Cost per Client

| Phase | Current Cost | Optimized Cost | Savings |
|-------|--------------|----------------|---------|
| Acquisition | $245 | $70 | $175 (71%) |
| Onboarding | $464 | $104 | $360 (78%) |
| First Month Ops | $250 | $38 | $212 (85%) |
| **Total First Month** | **$959** | **$212** | **$747 (78%)** |
| **Monthly Recurring** | **$250** | **$38** | **$212 (85%)** |

### 5.3 30-Day Goal Impact Analysis

**Goal:** 3 clients, $10k+ collected

**Current State (Manual):**
- Setup time: 31.5 hrs × 3 clients = 94.5 hours
- Labor cost: $959 × 3 = $2,877
- Time to deliver: 2-3 weeks per client
- **Risk:** Cannot scale beyond 3 clients in 30 days

**Optimized State (Automated):**
- Setup time: 6.25 hrs × 3 clients = 18.75 hours
- Labor cost: $212 × 3 = $636
- Time to deliver: 3-5 days per client
- **Capacity:** Can handle 10+ clients in 30 days

---

## 6. IMPLEMENTATION PRIORITIES

### 6.1 Priority Matrix

| Priority | Item | Impact | Effort | Timeline | Blockers |
|----------|------|--------|--------|----------|----------|
| **P0** | GCP Service Account | Revenue blocking | 1 hour | Immediate | Rior approval |
| **P0** | Vercel Production Deploy | Revenue blocking | 30 min | Immediate | Rior approval |
| **P1** | Onboarding Portal (AUTO-002) | 3-4 hrs/client saved | 1-2 weeks | Week 1-2 | GCP credentials |
| **P1** | Demo Generator (AUTO-003) | 2-3 hrs/prospect saved | 3-5 days | Week 1 | GCP credentials |
| **P1** | Weekly Reports (AUTO-005) | 6-8 hrs/month saved | 1-2 days | Week 2 | Client #1 onboard |
| **P2** | Proposal Generator (AUTO-001) | 1.5 hrs/proposal saved | 2-3 days | Week 3 | None |
| **P2** | Auto-Scaling Alerts (AUTO-004) | 6-8 hrs/month saved | 2-3 days | Week 3 | Client data flow |
| **P3** | Lead Scoring (AUTO-006) | 8 hrs/month saved | 1 day | Week 4 | Lead volume |

### 6.2 Week-by-Week Implementation Plan

#### Week 1: Unblock & Foundation
- **Day 1-2:** Get GCP service account + deploy to Vercel (P0)
- **Day 3-5:** Build automated demo generator (AUTO-003)
- **Day 6-7:** Begin onboarding portal scaffold (AUTO-002)

#### Week 2: Onboarding Automation
- **Day 8-10:** Complete onboarding portal (AUTO-002)
- **Day 11-12:** Build weekly report automation (AUTO-005)
- **Day 13-14:** Test full onboarding flow with demo client

#### Week 3: Sales Automation
- **Day 15-17:** Build proposal generator (AUTO-001)
- **Day 18-19:** Implement auto-scaling alerts (AUTO-004)
- **Day 20-21:** Document all workflows

#### Week 4: Optimization
- **Day 22:** Lead scoring system (AUTO-006)
- **Day 23-24:** Performance tuning
- **Day 25-28:** Scale to first 3 clients

### 6.3 Critical Path to First Client

```
Day 1:  ┌─────────────────────────────────────┐
        │  Get GCP credentials (Rior action)  │
        └─────────────────┬───────────────────┘
                          ▼
Day 2:  ┌─────────────────────────────────────┐
        │  Deploy to Vercel (Rior approval)   │
        └─────────────────┬───────────────────┘
                          ▼
Day 3:  ┌─────────────────────────────────────┐
        │  Test BigQuery connection           │
        │  Load Harbor Goods demo             │
        └─────────────────┬───────────────────┘
                          ▼
Day 4:  ┌─────────────────────────────────────┐
        │  Begin outreach (cold email seq)    │
        │  Start onboarding portal build      │
        └─────────────────┬───────────────────┘
                          ▼
Day 5-7:┌─────────────────────────────────────┐
        │  First discovery call scheduled     │
        │  Generate custom demo               │
        └─────────────────────────────────────┘
```

### 6.4 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to onboard client | < 5 days | From signed SOW to go-live |
| Manual hours per client | < 8 hours | First month total |
| Monthly recurring hours | < 2 hours | Per client ongoing |
| Demo generation time | < 15 minutes | From request to link |
| Proposal generation time | < 30 minutes | From call notes to PDF |
| Lead response time | < 2 hours | Hot leads to outreach |

---

## 7. APPENDIX

### 7.1 Current vs Optimized Workflow Diagrams

**Current State (Manual):**
- Heavy johnbot involvement at every step
- Sequential processing
- Multiple approval gates
- 26-34 hours per client first month

**Optimized State (Automated):**
- johnbot only at key decision points
- Parallel processing where possible
- Self-service for credential collection
- 4-8 hours per client first month

### 7.2 Automation Dependencies

| Automation | Depends On | Blocks |
|------------|-----------|--------|
| Demo Generator | GCP credentials | Sales demos |
| Onboarding Portal | GCP + Shopify OAuth | Client #1 |
| Weekly Reports | Client data in BigQuery | Client reporting |
| Auto-Scaling Alerts | Historical data (2+ weeks) | Proactive monitoring |
| Proposal Generator | None | Sales velocity |
| Lead Scoring | Lead volume >20/week | Efficiency |

### 7.3 Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| GCP credentials delayed | Medium | High | Use local demo for sales; migrate when ready |
| Shopify OAuth rejected | Low | High | Build API key fallback method |
| Meta API unavailable | Medium | Medium | Launch without Meta; add later |
| Automation bugs | Medium | Medium | Keep manual fallback procedures |
| Client requests custom work | High | Medium | Clear SOW boundaries; charge for custom |

---

*Document generated by atlas-3 for Rior Systems*  
*Next review: After first 3 clients onboarded*