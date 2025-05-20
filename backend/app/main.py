from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

app = FastAPI(title="Climate Hazard Trend Analyzer")

# Recommended CORS settings
origins = [
    "http://localhost:5173",
    "https://climate-hazzard.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Don't include trailing slash here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
