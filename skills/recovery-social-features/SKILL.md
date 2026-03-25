---
license: Apache-2.0
name: recovery-social-features
description: Privacy-first social features for recovery apps - sponsors, groups, messaging, friend connections. Use for sponsor/sponsee systems, meeting-based groups, peer support, safe messaging. Activate on "sponsor", "sponsee", "recovery group", "accountability partner", "sober network", "meeting group", "peer support". NOT for general social media patterns (use standard social), dating features, or public profiles.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
category: Recovery & Wellness
tags:
  - social-features
  - recovery
  - community
  - engagement
  - app
---

# Recovery-Focused Social Features

Build privacy-first social features for addiction recovery apps. These patterns prioritize anonymity, safety, and the unique relationship structures in recovery communities.

## Decision Points

### 1. Privacy Level Selection
```
User requests social feature →
├─ Anonymous user (no account)?
│  └─ Redirect to guest resources only
├─ First-time user setup?
│  ├─ Default to maximum privacy settings
│  └─ Show optional visibility tutorial
├─ Existing user changing settings?
│  ├─ Increasing visibility? → Show impact warning
│  └─ Decreasing visibility? → Apply immediately
└─ Crisis keywords detected?
   ├─ Show resources overlay (non-blocking)
   └─ Log for safety pattern analysis
```

### 2. Relationship Type Determination
```
User wants to connect →
├─ Are they seeking accountability?
│  ├─ Has sponsor role? → Generate sponsor invite code
│  └─ No sponsor role? → Guide to sponsee invite flow
├─ Equal peer connection?
│  ├─ Send friend request
│  └─ Wait for mutual consent
├─ Group-based connection?
│  ├─ Meeting group? → Join via meeting ID
│  └─ General group? → Check privacy settings
└─ Crisis intervention needed?
   └─ Route to crisis resources first
```

### 3. Group Creation Strategy
```
User creates group →
├─ Is this tied to a meeting?
│  ├─ Yes? → Default to meeting privacy level
│  └─ No? → Start with private/invite-only
├─ How many expected members?
│  ├─ <10? → No size limit needed
│  ├─ 10-50? → Set maxMembers = 50
│  └─ >50? → Warn about intimacy loss, suggest 25
├─ Is this temporary?
│  ├─ Yes? → Enable 24h auto-delete
│  └─ No? → Create permanent with admin tools
└─ Anonymous or identified members?
   ├─ Anonymous? → Hide real names in group
   └─ Identified? → Show display names only
```

### 4. Messaging Safety Triage
```
Message content analysis →
├─ Contains crisis keywords?
│  ├─ Suicidal ideation? → Show crisis resources overlay
│  ├─ Relapse indicators? → Suggest sponsor contact
│  └─ Self-harm mentions? → Offer helpline resources
├─ Contains sourcing language?
│  ├─ Drug seeking? → Block + flag for review
│  └─ Dealing references? → Block + immediate escalation
├─ Standard conversation?
│  ├─ Between friends? → Deliver immediately
│  ├─ To blocked user? → Reject silently
│  └─ To stranger? → Check message settings
└─ Group message?
   └─ Apply group visibility rules
```

### 5. Accountability Sharing Decision
```
User shares progress →
├─ Who should see this?
│  ├─ Private struggles? → Sponsors only
│  ├─ Major milestones? → Ask about community sharing
│  └─ Daily check-ins? → Configurable sharing list
├─ What data to include?
│  ├─ HALT status concerning? → Include context note
│  ├─ Mood trending down? → Suggest additional support
│  └─ Positive progress? → Celebrate appropriately
└─ Timing considerations?
   ├─ Crisis situation? → Immediate sharing + resources
   ├─ Milestone approaching? → Prepare celebration options
   └─ Regular check-in? → Batch with daily summary
```

## Failure Modes

### 1. Privacy Overshare
**Symptom:** User accidentally exposes sensitive recovery data publicly  
**Detection:** Profile visibility = 'community' + sobrietyDate shown + first week of use  
**Fix:** Reset to default privacy, show impact explanation, require confirmation for any public settings

### 2. Group Overrun  
**Symptom:** Groups grow too large, lose intimacy, become unmanageable  
**Detection:** Group has >25 active members + declining message engagement  
**Fix:** Add maxMembers limit, suggest splitting into smaller focused groups, enable sub-group creation

### 3. Crisis Keyword Blocking
**Symptom:** Users afraid to share struggles due to over-aggressive content filtering  
**Detection:** Crisis keywords detected + user deletes message + no help resources accessed  
**Fix:** Make crisis prompts helpful not blocking, show "this is private" messaging, offer skip option

### 4. Sponsor Relationship Abuse
**Symptom:** Sponsors collecting too many sponsees or inappropriate boundaries  
**Detection:** Single user has >10 sponsees OR sponsor-sponsee message frequency >50/day  
**Fix:** Add sponsee limits, flag high-frequency relationships for review, provide boundary resources

### 5. Anonymous Identity Leak
**Symptom:** Real identity accidentally exposed through profile or messaging  
**Detection:** Display name matches real name pattern + email domain visible  
**Fix:** Force display name change, audit all previous posts, add identity separation warnings

## Worked Examples

### Example 1: First-Time User Wants Sponsor Connection

**Scenario:** Sarah downloads app, needs to connect with sponsor Mary who's been sober 5 years.

**Expert Decision Path:**
1. **Privacy Assessment:** New user → Default to maximum privacy (profile='friends', no sobriety date, anonymous in groups)
2. **Relationship Type:** This is hierarchical sponsor relationship → Use invite code system, not friend request
3. **Connection Flow:** Mary generates 24h invite code → Shares privately → Sarah enters code → Creates private sponsor/sponsee link
4. **Safety Check:** Both parties can message → Crisis detection enabled → Resources available

**What Novice Misses:** Using friend request system (wrong - creates peer relationship), making relationship visible to others (privacy violation), not setting up crisis detection (safety gap).

**Key Trade-offs Navigated:**
- **Anonymity vs Accountability:** Chose real identity for sponsor trust, display names for community
- **Privacy vs Connection:** Used private invite codes instead of searchable profiles  
- **Safety vs Autonomy:** Non-blocking crisis detection preserves agency while offering help

### Example 2: Meeting Group Creation with Mixed Privacy Needs

**Scenario:** Tom wants to create group for his Tuesday AA meeting. Some members want anonymity, others okay being identified.

**Expert Decision Path:**
1. **Group Type Decision:** Tied to meeting → Link to meeting ID, inherit meeting privacy level
2. **Size Strategy:** AA meeting ~15 people → Set maxMembers=20 to allow some growth
3. **Anonymity Handling:** Mixed comfort levels → Default anonymousInGroups=true, let individuals opt-in to display names
4. **Persistence Decision:** Ongoing meeting → Permanent group, not ephemeral
5. **Visibility Setting:** Meeting-based → 'private' visibility (only members see it exists)

**What Novice Misses:** Defaulting to public visibility (exposes meeting attendance), not considering anonymity differences (forces same comfort level on everyone), setting unlimited membership (loses intimacy).

**Key Trade-offs Navigated:**
- **Transparency vs Anonymity:** Chose anonymity default with opt-in identification
- **Growth vs Intimacy:** Set member limit to preserve meeting-like feel
- **Convenience vs Privacy:** Required meeting ID link instead of open joining

### Example 3: Crisis Message Handling

**Scenario:** User sends "I'm thinking about using again" in group chat during weekend when sponsors unavailable.

**Expert Decision Path:**
1. **Crisis Detection:** "using again" triggers relapse keyword → Show resources overlay immediately
2. **Blocking Decision:** Crisis content → NEVER block, always allow expression
3. **Resource Targeting:** Relapse-specific → Show relapse prevention resources, not general crisis
4. **Notification Strategy:** Group context → Notify group admins, suggest sponsor contact, but keep original message visible
5. **Follow-up:** Log interaction for safety patterns, don't store message content

**What Novice Misses:** Blocking the message (prevents help-seeking), showing generic crisis resources (less targeted help), notifying authorities instead of recovery network (breaks trust).

**Key Trade-offs Navigated:**
- **Safety vs Expression:** Prioritized safe expression over content filtering
- **Privacy vs Intervention:** Kept message private while offering appropriate resources
- **Automation vs Human Connection:** Suggested sponsor contact rather than automated escalation

## Quality Gates

Implementation complete when ALL conditions met:

- [ ] Privacy audit passed: Default settings are maximum privacy (friends-only profile, hidden sobriety date, anonymous groups)
- [ ] Crisis keyword test passed: All keywords trigger resource overlays without blocking messages
- [ ] Invite expiry validation: Sponsor invite codes expire after 24h and cannot be reused
- [ ] Anonymity preservation: Display names never leak real identity information
- [ ] Relationship hierarchy respected: Sponsors can message sponsees, friend requests require mutual consent
- [ ] Group size controls active: Groups with >25 members show intimacy warning and splitting suggestion
- [ ] Blocking verification: Blocked users cannot see blocker content and don't know they're blocked
- [ ] Crisis resource accessibility: All crisis resources cached for offline access
- [ ] Real-time sync functional: Friends, messages, and group updates appear immediately via Supabase subscriptions
- [ ] Content moderation policies: Sourcing/dealing content blocks immediately, harassment flags for review

## NOT-FOR Boundaries

**Do NOT use this skill for:**

- **General social media patterns** → Use standard social feature documentation for likes, follows, feeds
- **Dating or romantic features** → Inappropriate for recovery context; recovery apps should focus on platonic support only
- **Public profile systems** → Recovery requires privacy-first approach; for public profiles use general user profile patterns
- **Content recommendation algorithms** → Use `recovery-community-moderator` skill for content safety and recommendation logic
- **Professional therapy features** → Use `clinical-integration` skill for licensed therapist connections and clinical workflows
- **Event management beyond meetings** → Use standard event management patterns for conferences, social events, etc.
- **E-commerce or monetization** → Recovery communities should avoid commercial pressure; use separate commerce patterns
- **Gamification with competitive elements** → Recovery progress is personal; use `habit-tracking` skill for non-competitive motivation

**Delegation boundaries:**
- For meeting scheduling and location management → Use `meeting-management` skill
- For clinical crisis intervention → Use `crisis-intervention` skill  
- For content moderation beyond recovery-specific patterns → Use `community-moderation` skill
- For general app user management → Use `user-auth-management` skill