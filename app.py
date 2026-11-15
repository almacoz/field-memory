"""Punto de entrada para Vercel (busca una instancia FastAPI llamada `app`).

En local se sigue usando:  uvicorn rotaciones.api:app --reload
"""
from rotaciones.api import app  # noqa: F401
