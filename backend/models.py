from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.dialects.mysql import LONGTEXT
from db import Base

class WikiQuiz(Base):
    __tablename__ = "wiki_quizzes"

    id = Column(Integer, primary_key=True, index=True)

    url = Column(String(500), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)

    # 🔥 FIX HERE
    raw_html = Column(LONGTEXT, nullable=True)

    extracted_data = Column(JSON, nullable=True)
    quiz_data = Column(JSON, nullable=True)
