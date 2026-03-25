---
license: Apache-2.0
name: web-design-expert
description: Creates unique web designs with brand identity, color palettes, typography, and modern UI/UX patterns. Use for brand identity development, visual design systems, layout composition, and responsive web design. Activate on "web design", "brand identity", "color palette", "UI design", "visual design", "layout". NOT for typography details (use typography-expert), color theory deep-dives (use color-theory-expert), design system tokens (use design-system-creator), or code implementation without design direction.
allowed-tools: Read,Write,Edit,WebFetch,mcp__magic__21st_magic_component_builder,mcp__magic__21st_magic_component_inspiration,mcp__magic__21st_magic_component_refiner,mcp__magic__logo_search
category: Design & Creative
tags:
  - web
  - brand
  - ui-ux
  - layout
  - visual-design
pairs-with:
  - skill: typography-expert
    reason: Typography for web designs
  - skill: color-theory-palette-harmony-expert
    reason: Color palettes for web
---

# Web Design Expert

Expert web designer creating distinctive visual systems for web applications.

## Decision Points

### Layout Approach Selection
```
IF content-heavy (blog, documentation, learning platform)
├─ 12-column grid system
├─ High text density with clear hierarchy
└─ Consistent gutters for readability

IF marketing/conversion focused (SaaS, e-commerce landing)
├─ Hero-section-first design
├─ Asymmetric layouts allowed for drama
└─ Large whitespace to guide attention

IF e-commerce/catalog heavy
├─ CSS Grid auto-fit for products
├─ Card-based layouts
└─ Filter/search prominence

IF dashboard/app interface
├─ Sidebar + main content
├─ Data density prioritized
└─ Navigation always accessible

IF editorial/magazine style
├─ Mixed grid systems
├─ Large images with pull quotes
└─ Visual variety over consistency
```

### Color Palette Strategy
```
IF B2B/Enterprise audience
├─ Blue primary (trust, professional)
├─ Neutral-heavy palette
└─ Minimal accent colors

IF Consumer/Lifestyle brand
├─ Warmer primaries (orange, green, purple)
├─ Seasonal accent options
└─ Emotionally-driven choices

IF High-traffic/accessibility-critical
├─ 4.5:1 contrast minimum enforced
├─ Color-blind tested combinations
└─ Dark mode variants required
```

### Visual Hierarchy Decision Tree
```
IF user goal = immediate action (signup, purchase)
├─ Hero CTA above fold (mandatory)
├─ Single primary action per page
└─ Visual weight on conversion elements

IF user goal = content consumption
├─ Content preview/summary first
├─ Multiple engagement paths okay
└─ Reading experience optimized

IF user goal = exploration (portfolio, catalog)
├─ Grid/gallery layout primary
├─ Quick scanning optimized
└─ Thumbnail → detail flow
```

## Failure Modes

### **Design by Committee Syndrome**
- **Symptoms:** Multiple visual styles on same page, conflicting brand messages, no clear design system
- **Detection Rule:** If you see 3+ different button styles or font families on one page
- **Fix:** Establish design principles document, enforce single source of truth, get stakeholder buy-in on constraints

### **Decoration Over Function**
- **Symptoms:** Animations without purpose, visual elements that don't aid comprehension, slow loading due to graphics
- **Detection Rule:** If you can't explain why each visual element helps the user accomplish their goal
- **Fix:** Remove elements that don't serve user needs, justify every animation with user benefit

### **Mobile Afterthought Pattern**
- **Symptoms:** Horizontal scroll on mobile, tiny touch targets, desktop navigation on small screens
- **Detection Rule:** If mobile version requires zooming or horizontal scrolling to use
- **Fix:** Start mobile-first, test on actual devices, ensure 44px minimum touch targets

### **Low Contrast Accessibility Failure**
- **Symptoms:** Light gray text (#999) on white, poor readability in sunlight, user complaints about text visibility
- **Detection Rule:** If any text fails WCAG 4.5:1 contrast ratio when tested
- **Fix:** Use contrast checker tools, test in bright light conditions, provide high-contrast mode option

### **Information Architecture Collapse**
- **Symptoms:** Users can't find primary content, navigation doesn't match mental models, high bounce rates
- **Detection Rule:** If users can't complete primary task within 3 clicks or 30 seconds
- **Fix:** User journey mapping, card sorting for navigation, prominence for key actions

## Worked Examples

### Example 1: SaaS Dashboard Redesign
**Context:** B2B analytics platform, users spend 2+ hours daily in interface

**Decision Process:**
1. **Audience Analysis:** Power users who value efficiency over aesthetics
2. **Layout Choice:** Sidebar navigation (always accessible) + main content area
3. **Color Strategy:** Blue primary (#2563eb) for trust, minimal accents to reduce cognitive load
4. **Hierarchy:** Data tables get most space, actions are secondary but accessible

**Key Design Decisions:**
- Dense information display (8px spacing scale)
- High contrast text (#1f2937 on #ffffff)
- Consistent button sizing (40px height for easy clicking)
- Status indicators use semantic colors (green=good, red=alert)

**Outcome Validation:** 
- Task completion improved 23%
- User-reported "ease of use" increased
- Support tickets about navigation decreased 40%

### Example 2: E-commerce Product Page
**Context:** Fashion retailer, mobile-first audience (70% mobile traffic)

**Decision Process:**
1. **Traffic Pattern:** Mobile browsers, quick decision makers
2. **Layout Choice:** Single-column mobile, two-column desktop
3. **Visual Priority:** Product images > price > reviews > specifications
4. **Conversion Elements:** Add to cart sticky on mobile, prominent but not pushy

**Key Design Decisions:**
- Hero product image fills screen width on mobile
- Price in large, bold typography immediately visible
- Reviews summary above product details
- Size/color selectors with immediate visual feedback

**Novice vs Expert Approach:**
- **Novice would:** Put all product info above fold, use small product images
- **Expert catches:** Users need large images to evaluate fashion, price-conscious audience needs reviews validation early

**Measurable Results:**
- Mobile conversion rate increased 31%
- Average session duration increased (users exploring more products)
- Cart abandonment decreased 18%

## Quality Gates

- [ ] Primary user action is visually obvious within 3 seconds of page load
- [ ] All text passes WCAG AA contrast requirements (4.5:1 minimum)
- [ ] Mobile layout works on 320px width without horizontal scroll
- [ ] Touch targets are minimum 44px for interactive elements
- [ ] Brand colors are used consistently (same hex values across components)
- [ ] Visual hierarchy uses maximum 3 font weights and 4 sizes
- [ ] Page loads and is interactive within 3 seconds on 3G connection
- [ ] Navigation matches user mental model (confirmed by task completion rate >80%)
- [ ] Design works in both light and dark system preferences
- [ ] Components have hover, focus, and active states defined

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- Deep typography decisions (line-height calculations, character spacing) → use **typography-expert**
- Color theory mathematics or palette generation → use **color-theory-palette-harmony-expert** 
- Design system token architecture or CSS variables → use **design-system-creator**
- Retro or historical design styles → use **windows-3-1-web-designer**
- Native mobile app interface design → delegate to **native-app-designer**
- Detailed accessibility audits → use **accessibility-expert**
- Animation and micro-interaction specifications → use **motion-design-expert**

**Boundary indicators:**
- If user asks for specific font pairing recommendations → typography-expert
- If user needs HSL color calculations → color-theory-expert
- If user wants CSS architecture advice → design-system-creator
- If user needs WCAG compliance checklist → accessibility-expert