"""
SnapNature MVP
Minimal image-based species recognition using a pre-trained ImageNet model.
- Frontend: simple HTML form to upload an image.
- Backend: FastAPI + PyTorch (ResNet50).
- Inference: top-5 predictions with ImageNet labels (fetched at runtime).
"""
import time
import io
import json
import urllib.request
from io import BytesIO
from typing import List, Dict, Union

import torch
from PIL import Image
from torchvision import transforms, models
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="SnapNature MVP")

# Enable CORS for local testing and simple frontend usage
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup time for health endpoint
START_TIME = time.time()

# ImageNet preprocessing
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

MODEL = None
IDX2LABEL = None


def load_labels():
    global IDX2LABEL
    if IDX2LABEL is not None:
        return IDX2LABEL
    try:
        url = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_class_index.json"
        with urllib.request.urlopen(url) as f:
            class_idx = json.loads(f.read().decode())
            IDX2LABEL = {int(k): v[1] for k, v in class_idx.items()}
    except Exception:
        # Fallback minimal mapping in case network is unavailable
        IDX2LABEL = {0: "tench", 1: "goldfish", 2: "great_white_shark", 3: "tiger_shark", 4: "eel"}
        for i in range(5, 1000):
            IDX2LABEL[i] = f"class_{i}"
    return IDX2LABEL


def ensure_model():
    global MODEL
    if MODEL is None:
        MODEL = models.resnet50(pretrained=True)
        MODEL.eval()


@app.on_event("startup")
def startup():
    ensure_model()
    load_labels()


def predict(img: Image.Image, topk: int = 5) -> List[Dict[str, Union[str, float]]]:
    global MODEL
    if img.mode != "RGB":
        img = img.convert("RGB")
    x = transform(img)
    x = x.unsqueeze(0)  # batch dimension
    with torch.no_grad():
        out = MODEL(x)
    probs = torch.nn.functional.softmax(out[0], dim=0)
    topk_vals, topk_indices = torch.topk(probs, topk)
    idx2lbl = load_labels()
    results: List[Dict[str, Union[str, float]]] = []
    for idx, conf in zip(topk_indices.tolist(), topk_vals.tolist()):
        label = idx2lbl[idx] if idx < len(idx2lbl) else f"class_{idx}"
        results.append({"label": label, "confidence": float(conf)})
    return results


@app.get("/")
def index():
    html = """
    <!doctype html>
    <html>
      <head><title>SnapNature MVP</title></head>
      <body>
        <h1>SnapNature MVP</h1>
        <p>Upload an image to get top-5 predictions (ImageNet labels)</p>
        <form id="upload-form" enctype="multipart/form-data">
          <input type="file" name="file" accept="image/*" />
          <button type="submit">Identify</button>
        </form>
        <pre id="output" style="white-space: pre-wrap;"></pre>
        <script>
          document.getElementById('upload-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const res = await fetch('/predict', { method: 'POST', body: fd });
            const data = await res.json();
            document.getElementById('output').textContent = JSON.stringify(data, null, 2);
          });
        </script>
      </body>
    </html>
    """
    return HTMLResponse(content=html)


@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    try:
        content = await file.read()
        image = Image.open(BytesIO(content)).convert('RGB')
        preds = predict(image, topk=5)
        return {"predictions": preds}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


@app.get("/health")
def health():
    uptime = time.time() - START_TIME
    return {
        "status": "healthy",
        "uptime_seconds": int(uptime),
        "model": "ResNet50",
        "labels_loaded": len(IDX2LABEL) if IDX2LABEL else 0,
    }


@app.get("/predict_url")
async def predict_url_endpoint(url: str):
    try:
        with urllib.request.urlopen(url) as f:
            data = f.read()
            image = Image.open(BytesIO(data)).convert('RGB')
            preds = predict(image, topk=5)
            return {"predictions": preds}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
