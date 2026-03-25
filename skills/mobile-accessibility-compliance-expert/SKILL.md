---
license: Apache-2.0
name: mobile-accessibility-compliance-expert
description: "Mobile accessibility compliance expert for VoiceOver, TalkBack, Dynamic Type, and WCAG mobile guidelines. Activate on: mobile accessibility, VoiceOver, TalkBack, Dynamic Type, Accessibility Inspector, WCAG mobile, screen reader, accessibility audit, a11y mobile, inclusive design. NOT for: web accessibility (use design-accessibility-auditor), UI design (use native-app-designer), general testing (use test-automation-expert)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: Mobile Development
tags:
  - accessibility
  - voiceover
  - talkback
  - wcag
pairs-with:
  - skill: design-accessibility-auditor
    reason: Web accessibility audit patterns extend to mobile with platform-specific considerations
  - skill: react-native-architect
    reason: React Native accessibility props need platform-specific tuning
---

# Mobile Accessibility Compliance Expert

Expert in mobile accessibility compliance with VoiceOver, TalkBack, Dynamic Type, and WCAG mobile-specific guidelines.

## Activation Triggers

**Activate on:** "mobile accessibility", "VoiceOver", "TalkBack", "Dynamic Type", "Accessibility Inspector", "WCAG mobile", "screen reader mobile", "accessibility audit mobile", "a11y mobile", "inclusive mobile design"

**NOT for:** Web accessibility → `design-accessibility-auditor` | UI design → `native-app-designer` | General testing → `test-automation-expert`

## Quick Start

1. **Audit with platform tools** — Xcode Accessibility Inspector (iOS), Accessibility Scanner (Android)
2. **Test with screen readers** — VoiceOver (iOS) and TalkBack (Android) for real user experience
3. **Support Dynamic Type / font scaling** — text must scale from 85% to 310% without layout breakage
4. **Add semantic labels** — every interactive element needs a meaningful accessibility label
5. **Test navigation order** — verify logical reading order matches visual layout

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **iOS** | VoiceOver, Accessibility Inspector, UIAccessibility, Dynamic Type |
| **Android** | TalkBack, Accessibility Scanner, AccessibilityNodeInfo, sp units |
| **React Native** | accessibilityLabel, accessibilityRole, accessibilityState, importantForAccessibility |
| **Flutter** | Semantics widget, SemanticsService, Flutter Accessibility |
| **Standards** | WCAG 2.2 Level AA, EN 301 549, Section 508, ADA |

## Architecture Patterns

### React Native Accessibility Props

```tsx
// Interactive button with full accessibility
<Pressable
  onPress={handleAddToCart}
  accessibilityRole="button"
  accessibilityLabel="Add to cart"
  accessibilityHint="Adds this item to your shopping cart"
  accessibilityState={{ disabled: isOutOfStock }}
>
  <CartIcon />
  <Text>Add to Cart</Text>
</Pressable>

// Image with description
<Image
  source={{ uri: product.image }}
  accessibilityRole="image"
  accessibilityLabel={`Photo of ${product.name}`}
/>

// Decorative image (hidden from screen reader)
<Image
  source={decorativeBorder}
  accessibilityElementsHidden={true}  // iOS
  importantForAccessibility="no"       // Android
/>

// Live region for dynamic updates
<View
  accessibilityLiveRegion="polite"     // Announces changes
  accessibilityRole="alert"
>
  <Text>{`${cartCount} items in cart`}</Text>
</View>
```

### Dynamic Type / Font Scaling Support

```
iOS Dynamic Type Scale:
  ├─ xSmall    (85%)    │  Minimum supported
  ├─ Small     (90%)    │
  ├─ Medium    (95%)    │
  ├─ Large     (100%)   │  Default
  ├─ xLarge    (110%)   │
  ├─ xxLarge   (120%)   │
  ├─ xxxLarge  (135%)   │
  └─ Accessibility sizes:
      ├─ AX1   (160%)   │
      ├─ AX2   (190%)   │
      ├─ AX3   (235%)   │
      ├─ AX4   (275%)   │
      └─ AX5   (310%)   │  Maximum

Requirements:
  1. Text MUST scale with system font size setting
  2. Layout MUST NOT clip or overlap at largest sizes
  3. Horizontal scrolling MUST NOT be required
  4. Touch targets MUST remain at least 44x44pt (iOS) / 48x48dp (Android)
```

### Accessibility Testing Checklist Flow

```
Manual Testing (required):
  │
  ├─ Screen Reader Test:
  │   ├─ Enable VoiceOver / TalkBack
  │   ├─ Navigate every screen linearly (swipe right/left)
  │   ├─ Verify: every element has a meaningful label
  │   ├─ Verify: reading order matches visual layout
  │   ├─ Verify: interactive elements announce role + state
  │   └─ Verify: decorative elements are hidden
  │
  ├─ Motor Accessibility:
  │   ├─ All touch targets >= 44pt / 48dp
  │   ├─ No gesture-only interactions (always a button alternative)
  │   ├─ Switch Control (iOS) / Switch Access (Android) navigation
  │   └─ No time-limited interactions without extension option
  │
  ├─ Visual Accessibility:
  │   ├─ Contrast ratio >= 4.5:1 (text), >= 3:1 (large text, UI)
  │   ├─ Content visible in Dark Mode and High Contrast
  │   ├─ Not conveying info by color alone (add icons/patterns)
  │   └─ Dynamic Type: test at smallest and largest sizes
  │
  └─ Automated Testing:
      ├─ Xcode Accessibility Inspector audit
      ├─ Android Accessibility Scanner
      ├─ Detox/Maestro with accessibility assertions
      └─ axe-core for React Native Web
```

## Anti-Patterns

1. **Missing accessibility labels** — screen readers announce "button" instead of "Add to cart button". Every interactive element needs an explicit `accessibilityLabel`.
2. **Labels that describe appearance** — "Red button" or "Image 3" are meaningless to screen reader users. Labels should describe purpose: "Delete order" or "Product photo: Blue sneakers".
3. **Small touch targets** — buttons smaller than 44x44pt (iOS) / 48x48dp (Android) are unusable for motor-impaired users. Increase hitSlop or padding even if visual size is small.
4. **Ignoring font scaling** — fixed font sizes that do not respond to Dynamic Type settings. Use relative sizing (`sp` on Android, Dynamic Type on iOS, `rem` in React Native Web).
5. **Gesture-only navigation** — swipe-to-delete with no alternative. Always provide a visible button alternative for gesture-based interactions.

## Quality Checklist

```
[ ] Every interactive element has accessibilityLabel and accessibilityRole
[ ] Decorative elements hidden from screen readers
[ ] Reading order verified with VoiceOver and TalkBack
[ ] Touch targets meet minimum size (44pt iOS, 48dp Android)
[ ] Dynamic Type supported — layout tested at AX5 (310%)
[ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI components)
[ ] Information not conveyed by color alone
[ ] Gesture-based actions have button alternatives
[ ] Screen reader announces state changes (loading, errors, success)
[ ] Focus management: focus moves logically after navigation and modals
[ ] Time-limited interactions can be extended or disabled
[ ] Accessibility Inspector / Scanner audit passes with zero errors
```
