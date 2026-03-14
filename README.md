# Simple Web Scraper with Node.js, Puppeteer, Python Flask, and Docker

This small project demonstrates how **Node.js** and **Python** can be used together in a Docker multi-stage build.

* **Node.js + Puppeteer** is used to scrape a webpage.
* **Python + Flask** is used to serve the scraped result through a simple HTTP endpoint.

The scraping happens during the **Docker build stage**, and the final container only runs the Flask server. This keeps the final image lighter because Node.js and Chromium are not included in the runtime stage.


## Git History Available at:
https://github.com/GitKishorDesai/ExactSpace_DockerTask



## What the Scraper Extracts

The scraper collects some basic information from the page:

* Page title
* Meta description (if available)
* Headings (H1, H2, H3)
* Number of links on the page
* Number of images on the page
* Scrape timestamp

The result is stored in a JSON file.


## Build the Docker Image

You can provide a URL to scrape using a build argument:

```bash
docker build --build-arg SCRAPE_URL=https://example.com -t scraper-app .
```

If no URL is provided, the scraper uses a default URL (here - exactspace's home page)  defined in the script.


## Run the Container

```bash
docker run -p 5000:5000 scraper-app
```


## Access the Scraped Data

Open the following in your browser:

```
http://localhost:5000
```

The server will return the scraped JSON data.
