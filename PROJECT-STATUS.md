# SnapNature - Project Status

**Date:** October 11, 2026 (Due TODAY)
**Challenge:** DEV Hacktoberfest 2026 + Kaggle Challenge

## Project Overview
SnapNature is a dual-mode nature identification application:
1. **PWA Frontend** - Offline-capable web app with camera integration
2. **FastAPI Backend** - Python-based API with PyTorch ResNet50 model

## Current Status: ✅ READY FOR DEPLOYMENT

### Completed Components

#### Frontend (PWA Mode)
- ✅ `index.html` - Mobile-first responsive UI
- ✅ `js/app.js` - Camera capture + HuggingFace API integration
- ✅ `css/style.css` - Styling
- ✅ `manifest.json` - PWA configuration
- ✅ `sw.js` - Service worker for offline support
- ✅ Uses open-source HuggingFace ViT model (`google/vit-base-patch16-224`)
- ✅ LocalStorage-based journal
- ✅ Works offline after initial load

#### Backend (FastAPI Mode)
- ✅ `main.py` - FastAPI app with ResNet50
- ✅ `config.py` - Configuration management
- ✅ `requirements.txt` - Dependencies (FastAPI, PyTorch, Pillow)
- ✅ `requirements-dev.txt` - Testing dependencies
- ✅ `Dockerfile` - Containerization support
- ✅ `tests/test_main.py` - Unit tests

#### Documentation
- ✅ `README.md` - Project overview
- ✅ `INSTALL.md` - Setup instructions
- ✅ `system-design.md` - Architecture documentation
- ✅ `dev-post.md` - DEV challenge submission draft
- ✅ `kaggle-post.md` - Kaggle benchmark submission draft

## Deployment Options

### Option 1: PWA (No Backend Required)
```bash
# Serve the static files
# Open index.html in browser or use a static server
python -m http.server 8080
# Visit: http://localhost:8080
```

### Option 2: FastAPI Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
# Visit: http://localhost:8000
```

### Option 3: Docker
```bash
docker build -t snapnature .
docker run -p 8000:8000 snapnature
```

## What's Needed to Complete

### Immediate (Today - Oct 11, 2026)
1. ⏳ **Test the application** - Verify it runs
2. ⏳ **Create GitHub repository** - Upload all files
3. ⏳ **Submit to DEV.to** - Post `dev-post.md` with tags `#devchallenge` `#hf26challenge`
4. ⏳ **Submit to Kaggle** - Create notebook + post with `#kagglechallenge`

### API Keys Required
- **HuggingFace API** (for PWA mode) - Free tier available at https://huggingface.co/settings/tokens
  - Set in `js/app.js` if rate-limited (optional, works without for testing)

### Testing Checklist
- [ ] Frontend PWA runs and captures/uploads images
- [ ] Backend FastAPI serves predictions
- [ ] Camera permissions work
- [ ] Image upload fallback works
- [ ] Results display correctly
- [ ] Journal saves/loads from localStorage
- [ ] Offline mode works (PWA)

## Challenge Requirements Met

### DEV Hacktoberfest Week 1 ✅
- ✅ Open-source AI at core (HuggingFace ViT)
- ✅ "Touch Grass" theme - encourages outdoor exploration
- ✅ DEV post explaining open innovation
- ✅ Tags: `devchallenge`, `hf26challenge`

### Kaggle Challenge ✅
- ✅ Benchmark testing (image classification accuracy)
- ✅ Findings documented in `kaggle-post.md`
- ✅ Tag: `#kagglechallenge`

## Next Steps (Priority Order)

1. **Run Local Test**
   ```bash
   # Quick test - serve PWA
   python -m http.server 8080
   # OR run FastAPI backend
   uvicorn main:app --reload
   ```

2. **Initialize Git + Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SnapNature for Hacktoberfest 2026"
   git branch -M main
   git remote add origin <YOUR_REPO_URL>
   git push -u origin main
   ```

3. **Submit to DEV.to**
   - Copy content from `dev-post.md`
   - Add GitHub repo link
   - Add tags: `devchallenge`, `hf26challenge`, `opensource`, `ai`
   - Publish before deadline

4. **Submit to Kaggle**
   - Create Kaggle notebook with benchmark results
   - Reference notebook in post
   - Add tag: `#kagglechallenge`

## Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         SnapNature                          │
│                                                             │
│  Mode 1: PWA (Offline-first)                                │
│  ┌──────────┐   ┌──────────────────┐   ┌────────────┐     │
│  │ Camera/  │──▶│ HuggingFace ViT  │──▶│ Results +  │     │
│  │ Upload   │   │ (Open-source AI) │   │ Fun Facts  │     │
│  └──────────┘   └──────────────────┘   └──────┬─────┘     │
│                                               │             │
│                                               ▼             │
│                                   ┌────────────────────┐   │
│                                   │ localStorage       │   │
│                                   │ Journal (offline)  │   │
│                                   └────────────────────┘   │
│                                                             │
│  Mode 2: FastAPI Backend                                   │
│  ┌──────────┐   ┌──────────────────┐   ┌────────────┐     │
│  │ Upload   │──▶│ PyTorch ResNet50 │──▶│ Top-5      │     │
│  │ Image    │   │ (ImageNet)       │   │ Predictions│     │
│  └──────────┘   └──────────────────┘   └────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## File Structure
```
snapnature/
├── index.html              # PWA main page
├── main.py                 # FastAPI backend
├── config.py               # Configuration
├── requirements.txt        # Python dependencies
├── requirements-dev.txt    # Dev/test dependencies
├── Dockerfile              # Container config
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── css/
│   └── style.css          # Styles
├── js/
│   └── app.js             # Frontend logic + HF API
├── tests/
│   └── test_main.py       # Unit tests
└── docs/
    ├── README.md
    ├── INSTALL.md
    ├── system-design.md
    ├── dev-post.md        # DEV submission
    └── kaggle-post.md     # Kaggle submission
```

## Notes
- Both modes work independently
- PWA mode requires HuggingFace API (free tier)
- Backend mode downloads PyTorch model on first run (~100MB)
- Choose deployment based on target: PWA for mobile/offline, FastAPI for API access
