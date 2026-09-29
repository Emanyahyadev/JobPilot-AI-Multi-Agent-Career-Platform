import os
import json
import logging
from typing import List, Dict, Any, Optional
import requests
from dotenv import load_dotenv

# Ensure .env is loaded from backend directory or current working directory
env_paths = [
    os.path.join(os.path.dirname(__file__), "..", ".env"),
    os.path.join(os.getcwd(), "backend", ".env"),
    os.path.join(os.getcwd(), ".env"),
]
for p in env_paths:
    if os.path.exists(p):
        load_dotenv(p)
        break

logger = logging.getLogger(__name__)

# Active NVIDIA models in order of priority
NVIDIA_MODELS = [
    "meta/llama-3.2-11b-vision-instruct",
    "google/diffusiongemma-26b-a4b-it",
    "openai/gpt-oss-20b",
]

def get_nvidia_api_key() -> str:
    key = os.getenv("OPENAI_API_KEY", "").strip()
    if not key:
        for p in env_paths:
            if os.path.exists(p):
                load_dotenv(p)
                key = os.getenv("OPENAI_API_KEY", "").strip()
                if key:
                    break
    return key

def get_nvidia_base_url() -> str:
    return os.getenv("OPENAI_BASE_URL", "https://integrate.api.nvidia.com/v1").rstrip("/")

def call_nvidia_llm(
    prompt: str,
    system_prompt: Optional[str] = None,
    temperature: float = 0.3,
    max_tokens: int = 1500,
    model_override: Optional[str] = None,
) -> str:
    """
    Call NVIDIA NIM API with active models and automatic fallback.
    """
    api_key = get_nvidia_api_key()
    base_url = get_nvidia_base_url()
    
    if not api_key:
        logger.warning("No NVIDIA API key found in environment.")
        return ""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    models_to_try = [model_override] if model_override else NVIDIA_MODELS

    last_error = None
    for model in models_to_try:
        if not model:
            continue
        try:
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens
            }
            resp = requests.post(
                f"{base_url}/chat/completions",
                json=payload,
                headers=headers,
                timeout=8
            )
            if resp.status_code == 200:
                data = resp.json()
                choices = data.get("choices", [])
                if choices and len(choices) > 0:
                    content = choices[0].get("message", {}).get("content", "")
                    if content:
                        return content
            else:
                logger.warning(f"Model {model} returned status {resp.status_code}: {resp.text[:150]}")
                last_error = f"Status {resp.status_code}: {resp.text[:100]}"
        except Exception as e:
            logger.warning(f"Error calling {model}: {e}")
            last_error = str(e)

    logger.error(f"All NVIDIA models failed. Last error: {last_error}")
    raise RuntimeError(f"NVIDIA LLM service error: {last_error}")
