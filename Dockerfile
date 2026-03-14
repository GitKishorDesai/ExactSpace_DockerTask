# ---------- Stage 1: Node Scraper ----------
FROM node:18-slim AS scraper

WORKDIR /app

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libnss3 \
    libxshmfence1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package.json .
COPY scrape.js .

RUN npm install

RUN node scrape.js


# ---------- Stage 2: Python Server ----------
FROM python:3.10-slim

WORKDIR /app

COPY server.py .
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY --from=scraper /app/scraped_data.json .

EXPOSE 5000

CMD ["python", "server.py"]