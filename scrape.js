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

(async () => {
  try {
    const url = resolveURL();

    console.log("Scraping URL:", url);

    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    const title = await page.title();

    const heading = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      return h1 ? h1.innerText : null;
    });

    const data = {
      url,
      title,
      heading,
      scraped_at: new Date().toISOString()
    };

    fs.writeFileSync("scraped_data.json", JSON.stringify(data, null, 2));

    console.log("Scraped data saved to scraped_data.json");

    await browser.close();
  } catch (error) {
    console.error("Scraping failed:", error);
    process.exit(1);
  }
})();