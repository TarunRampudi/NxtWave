from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from db import SessionLocal, engine
from models import Base
from scraper import scrape_wikipedia
from llm import generate_quiz_from_text
from crud import (
    get_quiz_by_url,
    get_quiz_by_id,
    get_all_quizzes,
    create_quiz
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Wiki Quiz Generator")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Root check
@app.get("/")
def root():
    return {"message": "Wiki Quiz API Running"}


# Generate quiz from Wikipedia URL
@app.post("/generate")
def generate_quiz(url: str, db: Session = Depends(get_db)):

    # Check if quiz already exists
    existing = get_quiz_by_url(db, url)
    if existing:
        return existing

    # Scrape Wikipedia
    scraped = scrape_wikipedia(url)

    # Generate quiz using LLM
    ai_output = generate_quiz_from_text(scraped["text"])

    # Prepare DB payload
    db_data = {
        "url": url,
        "title": scraped["title"],
        "summary": ai_output.get("summary", ""),
        "raw_html": scraped["html"],   # LONGTEXT works now ✅
        "extracted_data": {
            "sections": scraped["sections"],
            "entities": ai_output.get("key_entities", {})
        },
        "quiz_data": ai_output
    }

    quiz = create_quiz(db, db_data)
    return quiz


# Get all quizzes (history)
@app.get("/history")
def history(db: Session = Depends(get_db)):
    return get_all_quizzes(db)


# Get quiz by ID
@app.get("/quiz/{quiz_id}")
def quiz_details(quiz_id: int, db: Session = Depends(get_db)):
    quiz = get_quiz_by_id(db, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz
