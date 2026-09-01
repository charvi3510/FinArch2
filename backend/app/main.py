import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.database import init_db
from app.api.endpoints import router as api_router

app = FastAPI(
    title="FINARCH AI - Autonomous Financial Decision Engine",
    description="Intelligent financial optimization, Monte Carlo scenario simulation, and explainable AI reasoning layer.",
    version="1.0.0"
)

# Enable CORS for local React/Vite development and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix="/api")

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {
        "engine": "FINARCH AI",
        "tagline": "Your Autonomous Financial Decision Engine",
        "docs_url": "/docs",
        "api_status": "/api/health"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
