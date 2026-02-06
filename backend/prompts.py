QUIZ_PROMPT = """
You are a backend API that returns ONLY a valid JSON object.

STRICT OUTPUT RULES:
- Output ONLY raw JSON
- No markdown
- No explanations

JSON FORMAT (EXACT):

{{
  "summary": "string",
  "key_entities": {{
    "people": ["string"],
    "organizations": ["string"],
    "locations": ["string"]
  }},
  "quiz": [
    {{
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string",
      "difficulty": "easy|medium|hard",
      "explanation": "string"
    }}
  ],
  "related_topics": ["string"]
}}

CONTENT:
{text}
"""
