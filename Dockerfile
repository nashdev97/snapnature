FROM python:3.11-slim

WORKDIR /app

# System dependencies for building Python packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install PyTorch CPU wheels (no CUDA)
RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install the rest of the Python dependencies
RUN pip install --no-cache-dir fastapi uvicorn[standard] pillow

# Copy application code
COPY . .

EXPOSE 8000

CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8000"]
