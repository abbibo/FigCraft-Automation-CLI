---
name: figcraft-mobile-ui
description: Designs platform-native iOS and Android mobile screens in FigCraft, enforcing Apple HIG and Material Design 3 ergonomics, safe areas, status bars, and 44pt or 48dp touch targets. Use when designing mobile apps, iOS or Android screens, responsive mobile layouts, or native mobile navigation.
---

# FigCraft Mobile UI Specialist (iOS and Android)

Designs production-grade mobile interfaces in FigCraft following Apple Human Interface Guidelines and Material Design 3 standards.

## 1. Viewport Selection and Device Presets

Use `frame.presets` to pick official mobile dimensions. Standard specifications:

| Platform | Recommended Preset | Dimensions | Top Safe Area | Bottom Safe Area | Min Tap Target |
|---|---|---|---|---|---|
| iOS Modern | iPhone 16 / 17 | 393 x 852 px | 59px (Dynamic Island) | 34px (Home Bar) | 44 x 44 pt |
| iOS Large | iPhone 16 Pro Max | 440 x 956 px | 59px | 34px | 44 x 44 pt |
| Android Compact | Android Compact | 412 x 917 px | 36dp (Status Bar) | 24dp (Gesture Bar) | 48 x 48 dp |
| Tablet | iPad Pro 11" | 834 x 1194 px | 24px | 20px | 44 x 44 pt |

Screen positioning: Place multi-screen mobile flows horizontally with an 80px gap between screens.

## 2. Three-Zone Screen Anatomy

Construct every mobile screen as a vertical auto-layout container (`layout: "vertical"`, `gap: 0`, `clip: true`) divided into three distinct zones:

1. **Top System and Navigation Zone** (`sizingH: "fill"`, `sizingV: "hug"`):
   - Status bar: Height 54px (iOS) or 36px (Android). Left aligned time (`9:41`, SemiBold 15px); right aligned network, Wi-Fi, and battery vector icons.
   - App bar: Height 48px to 56px. Back button, screen title, and contextual action icons with minimum 44x44px touch frames.
2. **Scrollable Content Body** (`sizingH: "fill"`, `sizingV: "fill"`, `layout: "vertical"`, `padding: [16, 20, 24, 20]`, `gap: 16`):
   - Adhere to a 4/8dp spatial grid (`4, 8, 12, 16, 20, 24, 32`).
   - Cards and lists: Rounded corners (`cornerRadius: 16` or `20`), subtle 1px border or surface elevation contrast.
   - Text scale: Titles 24px-28px Bold; section headers 18px-20px SemiBold; body 15px-16px Regular; captions 12px-13px Medium.
3. **Bottom Navigation and Gesture Zone** (`sizingH: "fill"`, `sizingV: "hug"`):
   - Tab bar: Height 56px to 64px with 3 to 5 primary destinations, vertical icon + label layout.
   - Home indicator: 34px height container with a 134x5px centered rounded capsule pill (`cornerRadius: 100`).

## 3. Touch Targets and One-Thumb Ergonomics

- All clickable elements (buttons, icons, chips, list rows) must provide minimum 44x44px bounding boxes.
- Primary actions (FAB, sticky purchase buttons) must reside within the thumb-reach zone at the lower third of the screen.
- Bottom sheet modals: Provide top grabber handle (36x4px pill, #71717A) and rounded top corners (`cornerRadius: 24`).

