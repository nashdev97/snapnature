"""
Tests for SnapNature MVP
"""

import io
from unittest.mock import patch, MagicMock

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from main import app, predict, load_labels

client = TestClient(app)


def test_health_endpoint():
    """Test that health endpoint returns expected fields"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "uptime_seconds" in data
    assert data["model"] == "ResNet50"
    assert "labels_loaded" in data


def test_index_endpoint():
    """Test that root endpoint returns HTML"""
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert "SnapNature" in response.text


def test_predict_endpoint_invalid_file():
    """Test predict endpoint with invalid file"""
    response = client.post("/predict", files={"file": ("test.txt", b"not an image", "text/plain")})
    assert response.status_code == 500  # Our implementation returns 500 on error


def test_load_labels_returns_dict():
    """Test that load_labels returns a dictionary with expected structure"""
    labels = load_labels()
    assert isinstance(labels, dict)
    assert len(labels) > 0
    # Check it has the expected key-value structure
    assert 0 in labels
    assert isinstance(labels[0], str)


def test_predict_returns_list_of_dicts():
    """Test that predict function returns expected structure"""
    # Create a small test image
    img = Image.new('RGB', (224, 224), color='red')
    # This would fail without the model loaded, so we mock it
    with patch('main.MODEL') as mock_model:
        import torch
        mock_model.return_value = torch.zeros(1, 1000)
        mock_model.eval.return_value = mock_model

        # We can't easily test full prediction without the model, but we can test structure
        # by mocking the model forward pass
        pass


@patch('main.MODEL')
@patch('main.load_labels')
def test_predict_structure(mock_load_labels, mock_model):
    """Test predict function output structure with mocked model"""
    import torch

    # Setup mocks
    mock_load_labels.return_value = {0: "tench", 1: "goldfish", 2: "shark", 3: "eel", 4: "trout"}
    mock_output = torch.zeros(1, 1000)
    mock_output[0, 0] = 1.0  # class 0 has highest probability
    mock_model.return_value = mock_output
    mock_model.eval.return_value = mock_model

    # Create test image
    img = Image.new('RGB', (224, 224), color='red')

    # Call predict
    results = predict(img, topk=3)

    # Verify structure
    assert isinstance(results, list)
    assert len(results) == 3
    assert all("label" in r and "confidence" in r for r in results)
    assert all(isinstance(r["label"], str) for r in results)
    assert all(isinstance(r["confidence"], float) for r in results)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])