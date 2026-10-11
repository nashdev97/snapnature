"""
SnapNature Configuration
Environment variables and settings
"""

import os
from typing import Optional

class Settings:
    # Application
    APP_NAME: str = "SnapNature MVP"
    VERSION: str = "0.1.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Model
    MODEL_NAME: str = os.getenv("MODEL_NAME", "resnet50")
    TOP_K: int = int(os.getenv("TOP_K", "5"))

    # API
    MAX_UPLOAD_SIZE: int = int(os.getenv("MAX_UPLOAD_SIZE", "10485760"))  # 10MB

    # CORS
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "*").split(",")


settings = Settings()
