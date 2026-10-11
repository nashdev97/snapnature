# SnapNature

A minimal web application for nature image recognition using deep learning.

## Overview
SnapNature uses a pre-trained ResNet50 model (ImageNet) to classify images. Upload a photo of plants, animals, or natural objects, and get instant predictions.

## Features
- 🖼️ Web-based image upload interface
- 🔍 Top-5 predictions with confidence scores
- 🌐 REST API for programmatic access
- 🐳 Docker support
- ⚡ Fast inference with PyTorch

## Quick Start

### Option 1: Local Setup
```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run the app
uvicorn main:app --reload --port 8000
```

Visit http://127.0.0.1:8000 to use the web interface.

### Option 2: Docker
```bash
docker build -t snapnature .
docker run -p 8000:8000 snapnature
```

## API Usage

### Upload Image
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -F "file=@path/to/image.jpg"
```

### Predict from URL
```bash
curl "http://127.0.0.1:8000/predict_url?url=https://example.com/image.jpg"
```

### Health Check
```bash
curl "http://127.0.0.1:8000/health"
```

## Project Structure
```
snapnature/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── requirements-dev.txt    # Development dependencies
├── Dockerfile             # Container configuration
├── README.md              # This file
├── INSTALL.md             # Detailed installation guide
└── tests/
    └── test_main.py       # Unit tests
```

## Technology Stack
- **Backend**: FastAPI
- **ML Framework**: PyTorch + torchvision
- **Model**: ResNet50 (pre-trained on ImageNet)
- **Server**: Uvicorn (ASGI)

## Roadmap
- [ ] Replace generic ImageNet with nature-specific model
- [ ] Add support for iNaturalist dataset
- [ ] Implement user accounts and history
- [ ] Mobile app interface
- [ ] Cloud deployment (AWS/GCP/Azure)
- [ ] Real-time video feed classification

## Contributing
Contributions welcome! This project is built for hackathons and learning.

## License
MIT License

## Acknowledgments
- ImageNet pre-trained models from PyTorch
- FastAPI framework
- Open source community
