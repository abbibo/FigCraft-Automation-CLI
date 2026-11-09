# Curated 24×24 Vector Icon Paths for FigCraft (`node.create` -> `type: "vector"`)

All paths below are normalized to a **`24 × 24` viewBox**.
When placing an icon in FigCraft inside a `batch`, wrap it in a `24×24` frame (or pass `width: 24, height: 24` on the vector node) with:
```json
{
  "command": "node.create",
  "params": {
    "type": "vector",
    "name": "Icon / Home",
    "parent": { "$step": 0 },
    "width": 20,
    "height": 20,
    "path": "M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V14H9V21H4C3.45 21 3 20.55 3 20V9.5Z",
    "props": {
      "fills": [],
      "stroke": "#FAFAFA",
      "strokeWeight": 1.75
    }
  }
}
```
*(Important: Always include `"fills": []` on outline icons so closed SVG subpaths (`Z`) do not receive FigCraft's default `#D9D9D9` solid fill. For solid/filled icons, set `"fill": "#HEX"`).*

---

## 1. Navigation & Core UI (16 Icons)

| Icon Name | `path` (24×24 Normalized) | Recommended Style |
| :--- | :--- | :--- |
| **home** | `M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V14H9V21H4C3.45 21 3 20.55 3 20V9.5Z` | Outline (`strokeWeight: 1.75`) |
| **search** | `M11 4C7.13 4 4 7.13 4 11C4 14.87 7.13 18 11 18C14.87 18 18 14.87 18 11C18 7.13 14.87 4 11 4ZM16.29 16.29L20.5 20.5` | Outline |
| **bell (notification)** | `M18 8C18 4.69 15.31 2 12 2C8.69 2 6 4.69 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8ZM13.73 21C13.38 21.6 12.74 22 12 22C11.26 22 10.62 21.6 10.27 21` | Outline |
| **user (profile)** | `M12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM5 21V19C5 16.79 6.79 15 9 15H15C17.21 15 19 16.79 19 19V21` | Outline |
| **settings (sliders)** | `M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14H7M9 8H15M17 16H23` | Outline |
| **menu (hamburger)** | `M4 6H20M4 12H20M4 18H20` | Outline |
| **close (x)** | `M18 6L6 18M6 6L18 18` | Outline |
| **plus** | `M12 5V19M5 12H19` | Outline |
| **minus** | `M5 12H19` | Outline |
| **check** | `M20 6L9 17L4 12` | Outline (`strokeWeight: 2`) |
| **chevron-right** | `M9 18L15 12L9 6` | Outline |
| **chevron-left** | `M15 18L9 12L15 6` | Outline |
| **chevron-down** | `M6 9L12 15L18 9` | Outline |
| **arrow-right** | `M5 12H19M13 6L19 12L13 18` | Outline |
| **arrow-left** | `M19 12H5M11 18L5 12L11 6` | Outline |
| **arrow-up-right** | `M7 17L17 7M8 7H17V16` | Outline |

---

## 2. Fintech, Banking & Commerce (14 Icons)

| Icon Name | `path` (24×24 Normalized) | Recommended Style |
| :--- | :--- | :--- |
| **wallet** | `M3 6C3 4.9 3.9 4 5 4H19C20.1 4 21 4.9 21 6V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V6ZM16 12C16 12.55 16.45 13 17 13H21V11H17C16.45 11 16 11.45 16 12Z` | Outline |
| **credit-card** | `M2 7C2 5.9 2.9 5 4 5H20C21.1 5 22 5.9 22 7V17C22 18.1 21.1 19 20 19H4C2.9 19 2 18.1 2 17V7ZM2 10H22M6 15H10` | Outline |
| **send (transfer)** | `M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z` | Outline |
| **receive (arrow-down-left)** | `M17 7L7 17M16 17H7V8` | Outline |
| **qr-code (scan)** | `M3 7V5C3 3.9 3.9 3 5 3H7M17 3H19C20.1 3 21 3.9 21 5V7M21 17V19C21 20.1 20.1 21 19 21H17M7 21H5C3.9 21 3 20.1 3 19V17M7 7H10V10H7V7ZM14 7H17V10H14V7ZM7 14H10V17H7V14ZM14 14H17V17H14V14Z` | Outline |
| **swap (exchange)** | `M7 10L12 5L17 10M17 14L12 19L7 14` | Outline |
| **receipt (invoice)** | `M5 3H19V21L16.5 19L14 21L12 19L10 21L7.5 19L5 21V3ZM9 8H15M9 12H15M9 16H12` | Outline |
| **shopping-bag** | `M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6ZM3 6H21M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10` | Outline |
| **shopping-cart** | `M1 2H4L6.68 15.39C6.87 16.34 7.71 17 8.68 17H19.4C20.37 17 21.21 16.34 21.4 15.39L23 6H6M9 21C9 21.55 8.55 22 8 22C7.45 22 7 21.55 7 21C7 20.45 7.45 20 8 20C8.55 20 9 20.45 9 21ZM20 21C20 21.55 19.55 22 19 22C18.45 22 18 21.55 18 21C18 20.45 18.45 20 19 20C19.55 20 20 20.45 20 21Z` | Outline |
| **tag (promo)** | `M20.59 13.41L13.42 20.58C12.64 21.36 11.37 21.36 10.59 20.58L2 12V2H12L20.59 10.59C21.37 11.37 21.37 12.63 20.59 13.41ZM7 7H7.01` | Outline |
| **shield-check (security)** | `M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22ZM9 12L11 14L15 10` | Outline |
| **lock** | `M5 11H19C20.1 11 21 11.9 21 13V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V13C3 11.9 3.9 11 5 11ZM7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V11` | Outline |
| **eye (show balance)** | `M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12ZM12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z` | Outline |
| **bank (building)** | `M3 21H21M3 10H21M5 6L12 3L19 6M4 10V21M20 10V21M8 14V17M12 14V17M16 14V17` | Outline |

---

## 3. SaaS, Analytics & Dashboard (16 Icons)

| Icon Name | `path` (24×24 Normalized) | Recommended Style |
| :--- | :--- | :--- |
| **grid (dashboard)** | `M3 3H10V10H3V3ZM14 3H21V10H14V3ZM14 14H21V21H14V14ZM3 14H10V21H3V14Z` | Outline |
| **bar-chart** | `M18 20V10M12 20V4M6 20V14` | Outline (`strokeWeight: 2`) |
| **trending-up** | `M23 6L13.5 15.5L8.5 10.5L1 18M17 6H23V12` | Outline |
| **trending-down** | `M23 18L13.5 8.5L8.5 13.5L1 6M17 18H23V12` | Outline |
| **layers** | `M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12` | Outline |
| **folder** | `M22 19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V5C2 3.9 2.9 3 4 3H9L11 6H20C21.1 6 22 6.9 22 8V19Z` | Outline |
| **file-text** | `M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM14 2V8H20M16 13H8M16 17H8M10 9H8` | Outline |
| **calendar** | `M4 5H20C21.1 5 22 5.9 22 7V19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V7C2 5.9 2.9 5 4 5ZM16 3V7M8 3V7M2 11H22` | Outline |
| **clock (history)** | `M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6V12L16 14` | Outline |
| **filter** | `M22 3H2L10 12.46V19L14 21V12.46L22 3Z` | Outline |
| **download** | `M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15M7 10L12 15L17 10M12 15V3` | Outline |
| **upload** | `M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15M17 8L12 3L7 8M12 3V15` | Outline |
| **terminal (code)** | `M4 17L10 11L4 5M12 19H20` | Outline |
| **zap (lightning/fast)** | `M13 2L3 14H12L11 22L21 10H12L13 2Z` | Outline / Filled |
| **globe** | `M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM2 12H22M12 2C14.5 4.74 15.92 8.29 16 12C15.92 15.71 14.5 19.26 12 22C9.5 19.26 8.08 15.71 8 12C8.08 8.29 9.5 4.74 12 2Z` | Outline |
| **sparkles (AI)** | `M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3ZM19 3L19.8 5.2L22 6L19.8 6.8L19 9L18.2 6.8L16 6L18.2 5.2L19 3Z` | Outline / Filled |

---

## 4. Status, Communication & Media (14 Icons)

| Icon Name | `path` (24×24 Normalized) | Recommended Style |
| :--- | :--- | :--- |
| **check-circle** | `M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM9 12L11 14L15 10` | Outline |
| **alert-circle (warning)** | `M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 8V12M12 16H12.01` | Outline |
| **info** | `M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 16V12M12 8H12.01` | Outline |
| **mail** | `M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4ZM22 6L12 13L2 6` | Outline |
| **message-square (chat)** | `M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z` | Outline |
| **heart** | `M20.84 4.61C19.32 3.09 16.86 3.09 15.34 4.61L12 7.95L8.66 4.61C7.14 3.09 4.68 3.09 3.16 4.61C1.64 6.13 1.64 8.59 3.16 10.11L12 18.95L20.84 10.11C22.36 8.59 22.36 6.13 20.84 4.61Z` | Outline / Filled |
| **star** | `M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z` | Outline / Filled |
| **bookmark** | `M19 21L12 16L5 21V5C5 3.9 5.9 3 7 3H17C18.1 3 19 3.9 19 5V21Z` | Outline |
| **share** | `M4 12V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V12M16 6L12 2L8 6M12 2V15` | Outline |
| **copy** | `M9 9H19C20.1 9 21 9.9 21 11V20C21 21.1 20.1 22 19 22H9C7.9 22 7 21.1 7 20V11C7 9.9 7.9 9 9 9ZM5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5` | Outline |
| **trash** | `M3 6H21M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6H19ZM10 11V17M14 11V17` | Outline |
| **edit (pencil)** | `M17 3C17.8 2.2 19.1 2.2 19.9 3L21 4.1C21.8 4.9 21.8 6.2 21 7L8 20L3 21L4 16L17 3Z` | Outline |
| **play** | `M6 4L20 12L6 20V4Z` | Filled / Outline |
| **more-horizontal** | `M5 12H5.01M12 12H12.01M19 12H19.01` | Outline (`strokeWeight: 2.5`) |
