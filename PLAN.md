# Valentine 2026 — Modular Interactive Site Plan (Updated)

## Summary
Build a single-page vanilla HTML/CSS/JS site with a staged flow:
1. Personal hero (name + photo)
2. Big “Will you be my Valentine?” question
3. On “Yes”: send an email notification
4. Unlock three mini-games
5. After completing all games: reveal final message with cute animation

The project is designed to be fully customizable via `config.js` and a small `assets/` folder, with a clear README for non-technical users.

---

## Architecture & File Structure

Top-level files:
- `index.html` — semantic layout with staged sections and game panels
- `styles.css` — CSS variables, typography, animations, layout
- `script.js` — all interactivity, game logic, stage switching
- `config.js` — single source of truth for names, images, text, colors, email settings
- `README.md` — super friendly setup guide, “edit these 3 things” flow

Assets:
- `assets/`
- `assets/photo.jpg` (placeholder; user swaps)
- `assets/pair-1.jpg`, `assets/pair-2.jpg`, `assets/pair-3.jpg` (for match game)
- `assets/hearts.svg` (optional)
- `assets/favicon.png` (optional)

---

## Modular Design Principles
1. Config-first customization
   - Every text string, color, photo path, and email setting lives in `config.js`.
   - No customization requires touching `index.html` or `script.js`.
2. Data-driven game registry
   - `script.js` defines a `GAMES` array with metadata:
     - `id`, `title`, `goal`, `init()`, `reset()`, `isComplete()`
   - Each game panel is activated via this registry (easy to add/remove games).
3. Stage Controller
   - Simple state machine:
     - `question` → `yes` → `games` → `final`
   - Single `showStage(stageId)` function handles DOM transitions.

---

## Feature Breakdown

### 1) Hero + Personalization
- Photo frame with `assets/photo.jpg`
- Name + short hero message
- Pulls from `config.js`:
  - `valentineName`, `photoPath`, `heroMessage`

### 2) Valentine Question
- Big typography
- “Yes” and “No” buttons
- “No” button uses playful response system:
  - Rotate through cute prompts like “Try again?” / “Pretty please?”
  - Optional: slight “dodge” movement for fun

### 3) Email Notification (EmailJS)
- On “Yes” click, send email to site owner.
- Configurable in `config.js`:
  - `email.enabled`, `email.serviceId`, `email.templateId`, `email.publicKey`, `email.toEmail`
- `script.js` initializes EmailJS and sends with graceful fallback:
  - If not configured, show “Email not set up yet” message but continue flow.
- Easy setup instructions in README with screenshots and copy/paste steps.

### 4) Mini-Games (Three total)

Game A: Heart Catch
- Floating heart bubbles; user clicks to collect.
- Win when `score >= goal` (configurable).
- UI: progress counter (e.g., “3 / 5”).

Game B: Photo + City Match
- Two columns of cards:
  - Left: photo cards
  - Right: city name cards
- Player selects one photo + one city to form a pair.
- If correct → both lock; if incorrect → brief shake + reset.
- Win when all pairs matched.
- Pairs are fully defined in `config.js`, e.g.:
  - `{ photo: "assets/pair-1.jpg", city: "Paris", caption: "Our first trip" }`

Game C: Rapid-Click Love Meter
- User must click rapidly to fill the meter to 100%.
- If clicks slow down beyond a delay, meter decays.
- Configurable in `config.js`:
  - `goalPercent`, `fillPerClick`, `decayPerSecond`, `decayDelayMs`

### 5) Final Reveal
- Once all games complete:
  - Show final message + sparkles
  - Optional confetti animation
- Config options:
  - `finalMessage`, `finalTitle`, `finalEmojis`, `finalSubtext`

---

## `config.js` Design (Example Fields)

```js
const CONFIG = {
  valentineName: "Sophie",
  photoPath: "assets/photo.jpg",
  heroMessage: "A tiny adventure wrapped in a lot of love.",
  questionText: "Will you be my Valentine?",
  yesMessage: "Yay! You just unlocked cute challenges.",
  noMessages: ["Are you sure?", "Pretty please?", "Try again?"],
  theme: {
    background: "#fef1f7",
    accent: "#ff6fa8",
    dark: "#361a2e"
  },
  email: {
    enabled: true,
    serviceId: "YOUR_SERVICE_ID",
    templateId: "YOUR_TEMPLATE_ID",
    publicKey: "YOUR_PUBLIC_KEY",
    toEmail: "you@example.com"
  },
  games: {
    hearts: { goal: 5 },
    match: {
      pairs: [
        { photo: "assets/pair-1.jpg", city: "Paris", caption: "Our first trip" },
        { photo: "assets/pair-2.jpg", city: "Kyoto", caption: "Cherry blossoms" },
        { photo: "assets/pair-3.jpg", city: "Lisbon", caption: "Pastel de nata" }
      ]
    },
    meter: {
      goalPercent: 100,
      fillPerClick: 6,
      decayPerSecond: 8,
      decayDelayMs: 700
    }
  },
  final: {
    title: "You did it!",
    message: "Your gift is waiting for you.",
    emojis: "💌✨💖"
  }
};
```

---

## UX & Visual Direction
- Bold typography: romantic serif + modern sans pairing
- Soft gradient background with floating blob shapes
- Buttons have playful motion + glow
- Page-load animation for hero card
- Reduced-motion support for accessibility

---

## README Outline (Non-Tech Friendly)
1. Quick start (3 steps)
   - Replace `assets/photo.jpg` and `assets/pair-*.jpg`
   - Edit `config.js` (name + messages + email)
   - Deploy
2. EmailJS setup
   - Create free account
   - Create email service + template
   - Paste IDs into config
3. Deploy options
   - GitHub Pages (step-by-step)
   - Netlify (drag & drop)
4. Customization cheatsheet
   - “Change colors here”
   - “Change games here”
   - “Add/remove a pair”

---

## Public Interfaces / APIs
- No external API beyond EmailJS.
- `CONFIG` is the only public interface for customization.

---

## Test Scenarios
1. Customization sanity
   - Change name, photo, hero message in `config.js` → reflected in UI
2. Question flow
   - Click “No” repeatedly → cycle responses
   - Click “Yes” → stage switches and email attempt shown
3. EmailJS
   - With valid keys → email sent
   - Without keys → fallback warning, flow continues
4. Game progression
   - Heart catch counts correctly
   - Photo+city pairs lock only on correct match
   - Love meter fills with rapid clicks and decays when idle
   - Final stage reveals only after all three complete
5. Mobile
   - Buttons accessible, layout stacks, no overlap

---

## Assumptions & Defaults
- Use EmailJS for client-side emails.
- Three mini-games by default.
- Final reveal is message + cute animation.
- All text, colors, images, and game data modifiable via `config.js`.
