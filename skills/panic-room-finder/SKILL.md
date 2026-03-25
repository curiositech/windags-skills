---
license: Apache-2.0
name: panic-room-finder
description: Expert in residential hollow space detection, hidden room discovery, and safe room planning. Helps map house dimensions, identify anomalies suggesting hidden spaces, and safely explore potential voids. Knowledge of architectural history, construction methods, and non-destructive investigation techniques. Activate on "panic room", "hidden room", "secret room", "hollow space", "house mapping", "find hidden space", "room dimensions", "hidden door", "false wall", "priest hole", "prohibition era", "safe room". NOT for illegal entry, structural modifications without permits, or bypassing security systems.
allowed-tools: Read,Write,Edit,Bash,WebFetch
category: Lifestyle & Personal
tags:
  - hidden-rooms
  - architecture
  - investigation
  - safe-room
  - mapping
pairs-with:
  - skill: interior-design-expert
    reason: Integrate hidden spaces into design
  - skill: diagramming-expert
    reason: Map discovered spaces
---

# Panic Room Finder

Discover hidden spaces through systematic investigation and safe exploration.

## Decision Points

### Anomaly Investigation Matrix
```
IF discrepancy size = >12 inches AND wall thickness = standard (4-8")
  → THEN investigate via acoustic testing first
  → IF acoustic confirms void → proceed to visual inspection
  → IF visual inspection inconclusive → use borescope

IF discrepancy size = 6-12 inches AND wall thickness = thick (>8")  
  → THEN likely mechanical void (plumbing/HVAC)
  → investigate via thermal imaging
  → IF thermal shows unusual patterns → acoustic test

IF discrepancy size = >24 inches AND house era = pre-1950
  → THEN high probability of intentional hidden space
  → start with historical research
  → proceed to comprehensive investigation

IF visual clues present (mismatched trim, hollow sound, trigger mechanisms)
  → THEN prioritize visual inspection over measurement
  → document all clues before testing mechanisms
  → IF mechanism found → document before activating

IF basement/attic access reveals suspicious areas
  → THEN map from multiple access points
  → check for false walls/floors from both sides
  → IF confirmed void → assess structural safety before entry
```

### Investigation Method Selection
```
House Age < 1920:
├── Start with historical research
├── Focus on priest holes, servant passages
├── Use acoustic testing in thick-walled areas
└── Check for speaking tubes, hidden stairs

House Age 1920-1940:
├── Focus on Prohibition-era modifications
├── Check basement and behind built-ins
├── Look for speakeasy access points
└── Test walls behind bars/entertainment areas

House Age 1940-1970:
├── Check for Cold War fallout shelters
├── Focus on basement secure rooms
├── Look for reinforced hidden doors
└── Check garage and utility area connections

House Age > 1970:
├── Focus on security-oriented safe rooms
├── Check master bedroom/walk-in closets
├── Look for electronic/mechanical triggers
└── Check for modern panic room features
```

## Failure Modes

### **Schema Bloat**
- **Detection**: If you're measuring every wall thickness to 1/16" precision and creating complex floor plans before finding obvious anomalies
- **Symptom**: Spending hours on detailed documentation while ignoring the bookcase that clearly swings open
- **Fix**: Start with visual sweep for obvious clues, then measure only suspicious areas

### **Destructive Tunnel Vision**
- **Detection**: If your first instinct is to "just drill a small hole to peek"
- **Symptom**: Skipping acoustic, thermal, and visual methods to go straight to borescope
- **Fix**: Exhaust all non-destructive methods first; drilling should be absolute last resort

### **Horror Movie Syndrome**
- **Detection**: If you're entering dark spaces alone without safety precautions
- **Symptom**: Rushing into sealed spaces, not checking air quality, exploring without backup
- **Fix**: Always have someone present, ventilate first, document everything, assess structural safety

### **Treasure Hunter Fallacy**
- **Detection**: If you expect every hidden space to contain valuable items or dramatic secrets
- **Symptom**: Disappointment when finding empty voids or mundane storage
- **Fix**: Most hidden spaces are empty or contain forgotten junk; focus on the space itself as the discovery

### **Permission Paralysis**
- **Detection**: If you're investigating rental properties or houses you don't own without clear permission
- **Symptom**: Assuming "it's just exploration" when you're potentially damaging property or violating lease terms
- **Fix**: Get explicit written permission before any investigation beyond visual inspection

## Worked Examples

### Case Study: Victorian Townhouse Servant Passage
**Setup**: 1890s rowhouse, owner noticed 3-foot discrepancy between front parlor width and adjacent dining room.

**Investigation Process**:
1. **Measurement**: Parlor = 14'6", dining room = 11'2", shared wall measured 8" thick at doorway → 3'4" unaccounted space
2. **Historical research**: Found original plans showing "service corridor" 
3. **Visual inspection**: Dining room east wall had chair rail that didn't align with parlor side
4. **Acoustic test**: Hollow sound behind dining room built-in china cabinet
5. **Discovery**: Cabinet had hidden release mechanism - lifting corner shelf triggered magnetic latch
6. **Result**: 2'8" wide servant passage running length of house, with dumbwaiter shaft

**Key Decision**: When measurement showed >3 feet discrepancy in Victorian house, prioritized historical research over continued measuring. This revealed the architectural pattern and guided investigation to the correct wall.

**Novice Miss**: Would have kept measuring other rooms instead of investigating the obvious anomaly. Expert recognized that >3 feet in Victorian = intentional service space.

### Case Study: Mid-Century False Wall Detection
**Setup**: 1955 ranch house, homeowner renovating basement noticed area behind furnace seemed larger from outside measurements.

**Investigation Process**:
1. **Outside measurement**: Basement exterior = 28' x 40'
2. **Inside measurement**: Finished basement = 24' x 40' 
3. **Discrepancy**: Missing 4' width along north wall (96 sq ft)
4. **Visual clues**: Paneling on north wall looked newer, different nail pattern
5. **Acoustic test**: Confirmed hollow space behind paneling
6. **Thermal imaging**: Showed temperature difference - hidden space was unconditioned
7. **Discovery**: Removed panel section to reveal 4' x 40' storage room with Cold War-era supplies

**Key Decision**: When thermal imaging showed temperature differential, confirmed this was unconditioned space rather than mechanical void. Guided safe opening procedure.

**Trade-off**: Owner chose to remove panel section (minimally destructive) rather than use borescope because thermal imaging strongly confirmed substantial void.

## Quality Gates

- [ ] Documented discrepancy >12" between expected and actual room dimensions
- [ ] Non-destructive testing (acoustic/thermal/visual) confirms void space existence  
- [ ] Safe access method identified or space deemed inaccessible
- [ ] Historical context researched for house era and architectural patterns
- [ ] Safety assessment completed (structural integrity, air quality, electrical hazards)
- [ ] All investigation steps documented with photos and measurements
- [ ] Legal permission confirmed for any access attempts
- [ ] Discovery mapped and integrated into house floor plan
- [ ] Structural implications assessed (load-bearing walls, utilities)
- [ ] Future access plan established (seal, convert, monitor)

## NOT-FOR Boundaries

**This skill should NOT be used for:**
- Illegal entry into properties you don't own → use **legal-research** skill for property access rights
- Structural modifications without permits → use **contractor-selection** skill for permitted renovations  
- Bypassing active security systems → use **home-security-expert** skill for legitimate security needs
- Breaking into spaces in rental properties → use **tenant-rights** skill for landlord permission processes
- Investigating spaces that may contain hazardous materials → use **environmental-safety** skill for professional assessment

**Delegate to other skills when:**
- Converting found space requires electrical/plumbing → **home-renovation-expert**
- Hidden space needs security system integration → **home-security-expert**
- Discovery has historical significance → **historical-preservation** skill
- Structural concerns about load-bearing walls → **structural-engineering** consultation