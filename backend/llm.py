from google import genai
from dotenv import load_dotenv
import os
import json
from prompts import QUIZ_PROMPT

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = "models/gemini-2.5-flash"


def extract_json(text: str):
    text = text.replace("```json", "").replace("```", "").strip()

    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1:
        raise Exception(f"No JSON found:\n{text}")

    json_str = text[start:end+1]

    return json.loads(json_str)


def generate_quiz_from_text(text: str):
    safe_text = text[:12000]
    prompt = QUIZ_PROMPT.format(text=safe_text)

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    raw_output = response.text.strip()
    parsed_json = extract_json(raw_output)

    # safety defaults
    parsed_json.setdefault("summary", "")
    parsed_json.setdefault("quiz", [])
    parsed_json.setdefault("related_topics", [])
    parsed_json.setdefault("key_entities", {})

    return parsed_json
