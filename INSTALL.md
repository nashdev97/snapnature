# SnapNature - Installation & Setup Guide

## Prerequisites
- Python 3.10+ installed
- pip package manager
- (Optional) Docker for containerized deployment

## Installation Steps

### 1. Create Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Install Development Dependencies (Optional)
```bash
pip install -r requirements-dev.txt
```

## Running the Application

### Local Development
```bash
uvicorn main:app --reload --port 8000
```

Then open your browser to: http://127.0.0.1:8000

### Docker Deployment
```bash
docker build -t snapnature .
docker run -p 8000:8000 snapnature
```

## API Endpoints

- **GET /** - Web interface for uploading images
- **POST /predict** - Upload image file, returns top-5 predictions
- **GET /predict_url?url=<image_url>** - Predict from image URL
- **GET /health** - Health check endpoint

## Testing
```bash
pytest tests/ -v
```

## Troubleshooting

### PyTorch Installation Issues
If PyTorch installation fails, try installing it separately:
```bash
# CPU-only version (smaller, faster download)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### Windows-Specific Issues
If you encounter issues with the `python` command, try using `py` instead:
```bash
py -m venv venv
py -m pip install -r requirements.txt
```

## Next Steps
- Replace ImageNet model with nature-specific classifier
- Add user authentication
- Deploy to cloud (Heroku, Railway, Render, etc.)
