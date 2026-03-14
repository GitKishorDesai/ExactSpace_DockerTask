const puppeteer = require("puppeteer-core");
const fs = require("fs");

const DEFAULT_URL = "https://exactspace.co/";

function resolveURL() {
  const envURL = process.env.SCRAPE_URL;

  if (envURL) {
    console.log("[INFO] SCRAPE_URL detected.");
    console.log("[INFO] Overriding default URL.");
    console.log("[INFO] Target URL:", envURL);
    return envURL;
  }

  console.log("[INFO] No SCRAPE_URL provided.");
  console.log("[INFO] Using default URL:", DEFAULT_URL);

  return DEFAULT_URL;
}

async function scrapeAndSave()
{

  console.log("[INFO] Starting scraper...");

  const url = resolveURL();
  console.log("[INFO] Target URL:", url);

  let browser;

  try {

    console.log("[INFO] Launching headless browser...");

    browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    console.log("[INFO] Navigating to page...");

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    console.log("[INFO] Page loaded successfully");

    console.log("[INFO] Extracting page data...");

    const pageData = await page.evaluate(() => {

      const getTextArray = (selector) => {
        return Array.from(document.querySelectorAll(selector))
          .map(el => el.innerText.trim())
          .filter(text => text.length > 0);
      };

      const metaDescriptionTag = document.querySelector('meta[name="description"]');

      return {
        title: document.title,

        meta_description: metaDescriptionTag
          ? metaDescriptionTag.getAttribute("content")
          : null,

        headings: {
          h1: getTextArray("h1"),
          h2: getTextArray("h2"),
          h3: getTextArray("h3")
        },

        statistics: {
          total_links: document.querySelectorAll("a").length,
          total_images: document.querySelectorAll("img").length
        }
      };

    });

    const data = {
      url,
      ...pageData,
      scraped_at: new Date().toISOString()
    };

    console.log("[INFO] Writing output file...");

    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

    console.log("[INFO] Scraping completed successfully");

  } catch (error) {

    console.error("[ERROR] Failed to scrape page");

    const errorOutput = {
      url,
      status: "failed",
      error: error.message,
      scraped_at: new Date().toISOString()
    };

    fs.writeFileSync("data.json", JSON.stringify(errorOutput, null, 2));

  } finally {

    if (browser) {
      await browser.close();
      console.log("[INFO] Browser closed");
    }

  }

}

scrapeAndSave();