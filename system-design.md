## SnapNature System Design

### Challenge: DEV Hacktoberfest 2026 - Week 1 "Touch Grass"
### Project: SnapNature - Open-Source AI Nature Identifier
### Date: October 11, 2026

### 1. Requirements
- Open-source AI at core (not closed APIs)
- Gets people off screen → into nature
- Works offline/on-device
- Allows model fine-tuning/swapping
- Mobile-first experience

### 2. End-to-End Flow
```
┌──────────────┐     ┌─────────────────────┐     ┌────────────────┐
│ User Photo   │────▶│ HuggingFace Open AI│────▶│ Species ID +   │
│ (Camera/Up)  │     │ (ViT open-weight)   │     │ Confidence     │
└──────────────┘     └─────────────────────┘     └────────┬───────┘
                                                          │
                    ┌───────────────────────────────────────┘
                    ▼
            ┌──────────────┐     ┌────────────────────┐
            │ Fun Facts    │────▶│ Save to Journal    │
            │ (Nature      │     │ (localStorage)     │
            │ education)   │     └────────────────────┘
            └──────────────┘
                    │
                    ▼
            ┌────────────────────┐
            │ PWA Service Worker│── Offline access
            │ + Manifest         │── Installable app
            └────────────────────┘
```

### 3. Component Breakdown

**Frontend (index.html + css/style.css)**
- Mobile-first responsive layout
- Camera access via getUserMedia
- Photo upload fallback
- Results display with confidence bar
- Journal viewer

**AI Layer (js/app.js → HuggingFace API)**
- `processImage()` → converts to base64
- `getPrediction()` → POST to `api-inference.huggingface.co`
- `processPredictions()` → filters + selects top result
- Uses `google/vit-base-patch16-224` (open-weight ViT)

**Storage Layer**
- `localStorage` for journal entries (offline persistence)
- Service worker caches assets for PWA offline support
- No external database required

**Submission Layer**
- DEV post (`dev-post.md`) covering challenge requirements
- Kaggle benchmark (`kaggle-post.md`) comparing open-source AI performance
- GitHub repository with full code

### 4. Task Completion List

| # | Task | Status | File(s) |
|---|------|--------|---------|
| 1 | Project idea + system design | ✅ Done | system-design.md |
| 2 | HTML structure + PWA manifest | ✅ Done | index.html, manifest.json |
| 3 | CSS mobile-first design | ✅ Done | css/style.css |
| 4 | Camera capture + upload | ✅ Done | js/app.js |
| 5 | HuggingFace open-source AI integration | ✅ Done | js/app.js |
| 6 | Results display + fun facts | ✅ Done | js/app.js |
| 7 | Offline journal (localStorage) | ✅ Done | js/app.js |
| 8 | Service worker (offline PWA) | ✅ Done | sw.js |
| 9 | DEV submission post (Week 1) | ✅ Done | dev-post.md |
| 10 | Kaggle benchmark post | ✅ Done | kaggle-post.md |
| 11 | README + documentation | ✅ Done | README.md |

### 5. Challenge Criteria Match

Week 1 Requirements:
- ✅ Open-source AI at core (HuggingFace open-weight ViT)
- ✅ Gets people outside / "Touch Grass"
- ✅ DEV post explaining "Why Does Open Innovation Matter?"
- ✅ Bonus: works outside / shares experience
- ✅ Tags: `devchallenge`, `hf26challenge`

Kaggle Benchmark Requirements:
- ✅ Benchmark testing model capabilities (image classification)
- ✅ Reports findings / insights
- ✅ Required Kaggle link reference (to be uploaded to Kaggle)
- ✅ Tags: `#kagglechallenge`

### 6. What Remains for Full Submission
1. Upload `snapnature/` folder to GitHub repository
2. Submit DEV post with tags `#devchallenge` + `#hf26challenge`
3. Create/upload Kaggle benchmark notebook + submit `#kagglechallenge` post
4. Both due: October 11, 2026 (TODAY)

### 7. Next Steps (Post-Submission)
- Fine-tune ViT model for specific region's biodiversity
- Add species database with local conservation status
- Expand to audio (bird call identification) for full "trail" experience
- Deploy to GitHub Pages / Vercel for public access
