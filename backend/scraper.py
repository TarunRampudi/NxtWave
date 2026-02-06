import requests
from bs4 import BeautifulSoup


def scrape_wikipedia(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(url, headers=headers, timeout=15)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    title = soup.find("h1").get_text(strip=True)

    content_div = soup.find("div", {"id": "mw-content-text"})
    paragraphs = content_div.find_all("p")

    clean_text = "\n".join(
        [p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)]
    )

    sections = [s.get_text(strip=True) for s in soup.select("h2 span.mw-headline")]

    return {
        "title": title,
        "text": clean_text[:12000],
        "sections": sections,
        "html": response.text
    }
