from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

app = FastAPI(title="Climate Hazard Trend Analyzer")

# Redirect HTTP to HTTPS
@app.middleware("http")
async def redirect_to_https(request: Request, call_next):
    if request.url.scheme == "http":
        url = request.url.replace(scheme="https")
        return RedirectResponse(url=str(url))
    return await call_next(request)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://climate-hazzard.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(api_router)
