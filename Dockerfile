# ---------- Stage 1: Node Scraper ----------
FROM node:18-slim AS nodejs_stage

WORKDIR /app

RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package.json .
COPY scrape.js .

RUN npm install

ARG SCRAPE_URL
ENV SCRAPE_URL=${SCRAPE_URL}

RUN node scrape.js


# ---------- Stage 2: Python Server ----------
FROM python:3.10-slim

WORKDIR /app

COPY server.py .
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY --from=nodejs_stage /app/data.json .

EXPOSE 5000

CMD ["python", "server.py"]