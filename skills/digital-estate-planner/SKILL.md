---
license: Apache-2.0
name: digital-estate-planner
description: Organizing digital life for legacy, emergency access, and death preparedness. Specializes in password management, account documentation, digital asset preservation, and ensuring loved ones can access what they need.
allowed-tools: Read, Edit, Write, Bash, Glob, Grep, WebFetch, WebSearch, Task
category: Lifestyle & Personal
tags:
  - legacy
  - passwords
  - estate
  - death-preparedness
  - digital-assets
pairs-with:
  - skill: grief-companion
    reason: Support for end-of-life planning
  - skill: security-auditor
    reason: Ensure secure estate documentation
---

# Digital Estate Planner

Organizing digital life so loved ones can access what they need without guessing passwords, hunting accounts, or losing irreplaceable data when you die or become incapacitated.

## DECISION POINTS

**What is the user's primary need?**
```
├─ COMPLETE ESTATE PLANNING (first-time setup)
│  ├─ Has trusted person identified? 
│  │  ├─ YES → Start with Tier 1 documentation
│  │  └─ NO → Help identify digital executor first
│  └─ Security comfort level?
│     ├─ HIGH → Password manager inheritance + encrypted backup
│     ├─ MEDIUM → Password manager + physical backup location
│     └─ LOW → Written documentation in secure physical location

├─ EMERGENCY ACCESS SETUP (quick minimum viable)
│  ├─ Time available?
│  │  ├─ <1 hour → Focus on email + phone + password manager only
│  │  └─ >1 hour → Add banking + crypto if present
│  └─ Trusted person tech level?
│     ├─ HIGH → Can use password manager emergency access
│     └─ LOW → Need written instructions + stored passwords

├─ CRYPTO/HIGH-VALUE ASSETS
│  ├─ Amount > $10,000?
│  │  ├─ YES → Requires multi-location seed phrase storage
│  │  └─ NO → Can store with other sensitive documents
│  └─ Beneficiary crypto knowledge?
│     ├─ EXPERT → Can handle seed phrases directly
│     └─ NOVICE → Need intermediary crypto advisor contact

├─ SOCIAL MEDIA LEGACY
│  ├─ Platform has legacy features?
│  │  ├─ YES (Facebook, Google) → Use platform tools first
│  │  └─ NO (Twitter, TikTok) → Document deletion preferences
│  └─ Content preservation desired?
│     ├─ YES → Download archives before setting up memorialization
│     └─ NO → Direct deletion instructions

└─ PHOTO/DATA PRESERVATION
   ├─ Data scattered across platforms?
   │  ├─ YES → Consolidation phase first, then preservation
   │  └─ NO → Direct to backup strategy
   └─ Family tech comfort?
      ├─ HIGH → Can handle cloud access transfers
      └─ LOW → Need physical drive + simple instructions
```

## FAILURE MODES

**Pattern: Password Manager Lockout**
- *Detection*: If digital executor can't access password manager despite having master password
- *Root Cause*: 2FA device unavailable, emergency access not configured, backup codes missing
- *Fix*: Store 2FA backup codes with master password; configure emergency access features; test access annually
- *Prevention*: Always have 2FA backup plan stored separately from primary device

**Pattern: Seed Phrase Disaster**
- *Detection*: If crypto assets become permanently inaccessible despite documentation
- *Root Cause*: Seed phrase stored digitally and compromised, single point of failure, or stored in vulnerable location
- *Fix*: Multi-location storage (bank safe + home safe); metal backup for fire protection; never store digitally unencrypted
- *Prevention*: Treat seed phrases like cash - assume digital storage will be compromised

**Pattern: The Digital Hoarding Trap**
- *Detection*: If digital executor gets overwhelmed by too much information and abandons the process
- *Root Cause*: No prioritization, everything marked as "important", analysis paralysis
- *Fix*: Strict tier system - Tier 1 (critical access) first, ignore Tier 3+ until Tier 1 complete
- *Prevention*: Maximum 5 items in Tier 1, force prioritization decisions

**Pattern: Ghost Account Syndrome**
- *Detection*: If unexpected bills, renewals, or account activity continues after death
- *Root Cause*: Accounts not documented, subscriptions forgotten, old email addresses still active
- *Fix*: Email audit for subscription confirmations; credit card statement review; password manager audit for saved logins
- *Prevention*: Annual review process with email search for "subscription", "billing", "renewal"

**Pattern: Family Fight Trigger**
- *Detection*: If family disputes arise over digital asset access or preservation decisions
- *Root Cause*: Unclear instructions, multiple people with access, no clear hierarchy of authority
- *Fix*: Single designated digital executor with backup; written instructions for disputed scenarios; clear asset disposition
- *Prevention*: Family meeting to discuss plan; written acknowledgment from all parties

## WORKED EXAMPLES

**Case Study 1: Crypto-Heavy Estate (High Security)**

*Scenario*: Tech entrepreneur with $500K in cryptocurrency, multiple hardware wallets, DeFi positions
*Challenge*: Beneficiary (spouse) has minimal crypto knowledge

*Decision Process*:
1. **Executor Selection**: Spouse as primary, crypto-savvy business partner as technical advisor
2. **Seed Phrase Storage**: Split between bank safe deposit box (12 words) and home fireproof safe (12 words) using Shamir's secret sharing
3. **Access Documentation**: 
   - Step-by-step video walkthrough for spouse
   - Technical advisor contact info with retainer agreement
   - Emergency liquidation instructions if market crashes during probate

*Expert vs Novice Approach*:
- *Novice*: Would store everything in password manager or single location
- *Expert*: Recognizes seed phrases need physical, distributed storage; plans for beneficiary skill gap; includes market timing considerations

*Outcome*: Spouse successfully accessed 95% of assets within 30 days using advisor guidance

**Case Study 2: Luddite Estate (Low Security)**

*Scenario*: Elderly person, no password manager, all passwords written in notebook, basic email and banking only
*Challenge*: Adult child executor lives across country, limited tech skills

*Decision Process*:
1. **Consolidation**: Move to password manager with shared family vault
2. **Physical Backup**: Printed password list in bank safe deposit box
3. **Simplification**: Close unnecessary accounts, consolidate email to single provider with recovery options

*Expert vs Novice Approach*:
- *Novice*: Would try to digitize everything immediately, overwhelming the person
- *Expert*: Respects current system while adding redundancy; focuses on access over security optimization

*Outcome*: Executor accessed all accounts within one week, no assets lost

## QUALITY GATES

**Tier 1 Documentation Complete:**
- [ ] Primary email access documented with 2FA backup method
- [ ] Password manager master password stored in secure, accessible location
- [ ] Phone carrier account access documented for SIM/number transfer
- [ ] Primary bank account access documented
- [ ] Digital executor identified and has copy of access information

**Security Requirements Met:**
- [ ] No passwords stored in plain text digital files
- [ ] 2FA backup codes stored separately from primary devices
- [ ] Cryptocurrency seed phrases stored in minimum two physical locations
- [ ] Password manager emergency access feature configured and tested
- [ ] Digital executor can successfully access test account using provided instructions

**Preservation Plan Active:**
- [ ] Photo consolidation completed to maximum two cloud services
- [ ] Important document locations documented and accessible
- [ ] Social media memorialization preferences recorded
- [ ] Subscription cancellation list current (reviewed within 6 months)
- [ ] Annual review date scheduled and documented

**Communication Complete:**
- [ ] Digital executor has written instructions document
- [ ] Family members aware of who digital executor is
- [ ] Physical storage locations (safes, deposit boxes) documented with access info
- [ ] Emergency contact has backup executor identification
- [ ] Legal integration confirmed with estate attorney if applicable

## NOT-FOR BOUNDARIES

**This skill should NOT be used for:**
- Tax planning or legal estate document creation → use estate-attorney-finder
- Grief counseling or emotional death preparation → use grief-companion
- Technical security hardening of active accounts → use security-auditor
- Identity theft recovery or active account breaches → use identity-recovery-specialist
- Business succession planning for company accounts → use business-continuity-planner

**Delegate when you encounter:**
- Requests for will writing or trust creation
- Complex tax implications of digital asset transfers
- Active security incidents requiring immediate response
- Business partnership disputes over digital assets
- International estate law questions

**Stay in scope for:**
- Access documentation and inheritance planning
- Digital executor guidance and preparation
- Asset inventory and preservation strategies
- Platform-specific legacy feature configuration
- Family communication about digital estate plans