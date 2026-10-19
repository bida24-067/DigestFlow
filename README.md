# DigestFlow — Interactive Human Digestive System Learning

An educational web game designed for students to master the human digestive system through progressive inquiry, interactive tactile feedback, and fluid Apple-style motion design.

---

## 🌟 Key Features

### 1. Educational Curriculum (3 Progressive Levels)
- **Level 1: The Core Journey (Foundations)**
  - *Mouth* — Ingestion, mastication, salivary bolus formation.
  - *Esophagus* — Peristaltic propulsion down the 25cm muscular food pipe.
  - *Stomach* — Gastric acid churning, protease activation, chyme synthesis.
  - *Small Intestine* — 6-meter nutrient absorption epicentre with duodenum, jejunum, ileum.
  - *Large Intestine* — Water reabsorption, electrolyte balance, stool compaction.
  - *Rectum & Anus* — Sphincter control, temporary storage, and egestion.

- **Level 2: The Helper Squad (Accessory Organs & Secretions)**
  - *Salivary Glands* — Parotid, submandibular, sublingual amylase secretion.
  - *Liver* — Metabolic powerhouse, toxin filtration, continuous bile synthesis.
  - *Gallbladder* — Bile concentration and timed squirts into the duodenum.
  - *Pancreas* — Dual organ delivering bicarbonate neutralizer and key digestive enzymes.
  - *Bile* — Alkaline fluid emulsifying lipid droplets for lipase digestion.
  - *Gastric Juice / HCl* — Low pH (~1.5–2) fluid unraveling proteins and eliminating pathogens.

- **Level 3: Microscopic & Molecular Mastery (Advanced)**
  - *Amylase* — Carbohydrate and starch cleavage into disaccharides.
  - *Pepsin* — Gastric protease breaking proteins into smaller peptide chains.
  - *Lipase* — Lipid hydrolysis into free fatty acids and glycerol.
  - *Villi & Microvilli* — 60x surface area multipliers with capillary beds and lacteals.
  - *Peristalsis* — Autonomous smooth muscle wave contractions.
  - *Gut Microbiome* — Trillions of symbiotic bacteria fermenting fiber and producing vitamins.

---

## 🎨 Apple Design System (Graphic Designed Canvas & Crisp Solid Colors)
Crafted strictly adhering to the **Apple Design Skill**:
- **Graphic Designed Vector Background**: Features an intricate, crisp biological architectural blueprint with continuous digestive flow paths, technical coordinate grid, gastric rugae folds, microvilli brush border diagrams, glucose rings ($C_6H_{12}O_6$), active catalytic sites, and water secretion markers.
- **Pure Solid Color Palette (No Muddy Gradients)**: Bold, punchy, high-contrast solid hues (Coral `#FF3B5C`, Cobalt `#0084FF`, Amber `#FF9500`, Emerald `#00B37E`, Violet `#7952DE`, Berry `#E0245E`) paired with crisp white typography.
- **Discovery-First Inquiry**: Mystery stages challenge students directly with diagnostic riddles and progressive hints, preserving the fun of deduction without spoiling organ identities.
- **Response**: Immediate tactile scale feedback (`scale(0.97)`) on pointer-down.
- **Physical Motion & Springs**: 3D perspective flip cards with Apple spring curves (`cubic-bezier(0.2, 0.9, 0.3, 1)` and `cubic-bezier(0.34, 1.45, 0.64, 1)`).
- **Multimodal Feedback**: Zero-dependency Web Audio API synthesizer generating real-time tactile micro-clicks, whooshes, harmonic chimes, gentle error bumps, and celebration fanfares + Vibration API haptics.
- **Initial Boot Experience**: Apple-style boot screen with a solid graphic badge, rotating four-color frame, and clean solid progress bar.
- **Inclusive Accessibility**: Non-punitive forgiving text matching (handles case-insensitivity, aliases, minor typos via Levenshtein distance), progressive hint disclosures, keyboard navigation (`Enter` to submit, `Esc` to flip back), and `@media (prefers-reduced-motion)` fallbacks.

---

## 🚀 How to Run

Because **DigestFlow** is built with pure static HTML, CSS, and modern JavaScript:

### Method 1: Direct File Opening
Double-click `index.html` in Finder or open it directly in any modern browser (Safari, Chrome, Edge, Firefox).

### Method 2: Local Static Server
```bash
# Using Python 3 built-in HTTP server:
python3 -m http.server 8000

# Open in browser:
http://localhost:8000
```
