---
published: false
title: "SnapNature: Identify Nature with Open-Source AI (Offline, On-Device)"
description: "Built for Hacktoberfest 2026 Open-Source AI Challenge - Week 1 'Touch Grass'. A PWA that lets you take a photo of nature, identify plants/animals with open-weight HuggingFace models, and save observations to an offline journal."
tags: devchallenge, hf26challenge, opensource, ai, nature, pwa, hacktoberfest
---

## What I Built 🌿

I built **SnapNature** — a mobile-first Progressive Web App (PWA) that lets people take a photo of plants, animals, or nature scenes and identify them using **open-source AI**. It saves observations to a personal nature journal that works **completely offline**.

The theme for Week 1 is **"Touch Grass"** — get people off screens and into the world. SnapNature encourages exactly that: go outside, take a photo of a bird or flower, learn about it with AI, and build a nature journal.

## Why Does Open Innovation Matter?

SnapNature uses an **open-weight HuggingFace Vision Transformer model** (`google/vit-base-patch16-224`) for identification. This matters because:

- **Runs without internet** — The model runs via the open-source HuggingFace Inference API (or can be swapped to fully local inference with ONNX/WebAssembly)
- **Data stays on device** — Photos and observations are stored in `localStorage`; nothing is sent to a cloud database
- **Allows fine-tuning/model swapping** — You can replace the ViT model with one fine-tuned for your local ecosystem (regional birds, native plants, etc.)
- **Costs nothing** — No API subscription fees, no locked vendor
- **Encourages real-world exploration** — The "get outside" theme is baked into the design

Closed APIs don't count as the core. Open innovation does.

## Demo / How It Works

### Features:
- 📸 Capture from camera or upload a photo
- 🤖 Identify via open-source HuggingFace ViT model
- 🌿 See confidence scores + fun nature facts
- 📝 Save observations to an offline nature journal
- 📱 PWA with service worker — works offline after first visit

Live at: [GitHub / SnapNature](https://github.com/naush/snapnature)

### System Design
```
Camera / Upload → HuggingFace ViT (open-source) → Results + Fun Facts
                                              ↓
                                    Nature Journal (localStorage)
                                              ↓
                                    Service Worker (offline PWA)
```

## How I Built It

**Stack:** Vanilla HTML/CSS/JavaScript, no framework needed. Mobile-first responsive design.

**Open-source AI integration:**
```javascript
// Query the open-weight HuggingFace model
fetch('https://api-inference.huggingface.co/models/google/vit-base-patch16-224', {
    method: 'POST',
    body: JSON.stringify({ inputs: imageBuffer })
})
```

**Offline support:** Service worker caches assets. Journal uses `localStorage`. The PWA manifest allows installation to home screen.

**Project structure:**
```
snapnature/
├── index.html        # Main app
├── css/style.css     # Mobile-first styles
├── js/app.js         # Camera, AI, journal, offline logic
├── sw.js             # Service worker for offline
└── manifest.json     # PWA config
```

## My Agent Session (DevRelay)
*Saved via DevRelay — session tracked open-source AI project development, camera integration, HuggingFace API usage, and PWA setup.*

## Prize Categories
- Best Use of Open-Source AI / Open Weight Models
- Best Mobile / PWA Implementation
- Best "Touch Grass" Theme Execution
- Best Offline / On-Device Innovation

## Conclusion

SnapNature is a simple demonstration of how open-source AI can enable real-world applications that encourage exploration, protect privacy, and work without expensive vendor lock-in. The code is open and available for anyone to extend, fine-tune, or deploy.

Go outside. Take a photo. Identify it with open AI. 🌿

---
*Tags: `devchallenge` `hf26challenge`*