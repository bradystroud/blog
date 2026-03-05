import puppeteer, { type Browser, type Page } from "puppeteer";

const BUNNINGS_BASE = "https://www.bunnings.com.au";
const SEARCH_URL = `${BUNNINGS_BASE}/search/products`;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function launchBrowser(): Promise<Browser> {
  return puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

async function setStore(page: Page, store: string): Promise<void> {
  // Click the store selector and search for the store
  const storeButton = await page.$('[data-locator="store-selector-button"]');
  if (!storeButton) {
    // Try alternative selector
    const altButton = await page.$('[class*="store-selector"], [class*="StoreSelector"], button[aria-label*="store"]');
    if (altButton) {
      await altButton.click();
    } else {
      // Try clicking any element that mentions "store" or "location"
      await page.evaluate((storeName) => {
        const buttons = Array.from(document.querySelectorAll("button, a, [role='button']"));
        const storeBtn = buttons.find(
          (el) =>
            el.textContent?.toLowerCase().includes("store") ||
            el.textContent?.toLowerCase().includes("location")
        );
        if (storeBtn) (storeBtn as HTMLElement).click();
      }, store);
    }
  } else {
    await storeButton.click();
  }

  await delay(1000);

  // Type the store name in the search input
  const storeInput = await page.$(
    'input[placeholder*="suburb"], input[placeholder*="store"], input[placeholder*="postcode"], input[type="search"]'
  );
  if (storeInput) {
    await storeInput.click({ clickCount: 3 });
    await storeInput.type(store, { delay: 50 });
    await delay(1500);

    // Click first suggestion
    const suggestion = await page.$(
      '[class*="suggestion"], [class*="store-list"] li, [role="option"], [class*="StoreList"] button'
    );
    if (suggestion) {
      await suggestion.click();
      await delay(1000);
    }
  }
}

async function extractLocationFromPage(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const body = document.body.innerText;

    // Look for aisle/bay patterns in the page text
    const aisleMatch = body.match(/Aisle\s*[:\-]?\s*(\d+)/i);
    const bayMatch = body.match(/Bay\s*[:\-]?\s*(\d+)/i);

    if (aisleMatch || bayMatch) {
      const parts: string[] = [];
      if (aisleMatch) parts.push(`Aisle ${aisleMatch[1]}`);
      if (bayMatch) parts.push(`Bay ${bayMatch[1]}`);
      return parts.join(", ");
    }

    // Try looking for location-related elements
    const locationElements = document.querySelectorAll(
      '[class*="aisle"], [class*="Aisle"], [class*="bay"], [class*="Bay"], [class*="location"], [class*="Location"], [data-locator*="aisle"], [data-locator*="location"]'
    );
    for (const el of locationElements) {
      const text = (el as HTMLElement).innerText?.trim();
      if (text && text.length < 100) {
        return text;
      }
    }

    return null;
  });
}

export async function findProductLocation(query: string, store?: string): Promise<string> {
  let browser: Browser | undefined;

  try {
    browser = await launchBrowser();
    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1280, height: 800 });

    // Go to Bunnings search
    const searchUrl = `${SEARCH_URL}?q=${encodeURIComponent(query)}&sort=BoostOrder&page=1`;
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 30000 });

    // If a store is specified, set it
    if (store) {
      await setStore(page, store);
      // Re-search after store selection
      await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 30000 });
    }

    // Wait for search results
    await delay(2000);

    // Check for location info directly in search results
    const searchResultLocation = await extractLocationFromPage(page);

    // Get the first product link and name
    const firstProduct = await page.evaluate(() => {
      // Try various selectors for product cards
      const selectors = [
        'a[data-locator="product-tile-link"]',
        '[class*="product-tile"] a',
        '[class*="ProductTile"] a',
        'article a[href*="/"]',
        '[class*="search-result"] a[href*="/"]',
      ];

      for (const selector of selectors) {
        const link = document.querySelector(selector);
        if (link) {
          return {
            url: (link as HTMLAnchorElement).href,
            name:
              link.textContent?.trim().substring(0, 100) ||
              (link as HTMLAnchorElement).getAttribute("aria-label") ||
              "Unknown product",
          };
        }
      }

      // Fallback: find any link that looks like a product page
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      for (const link of allLinks) {
        const href = (link as HTMLAnchorElement).href;
        // Bunnings product URLs typically end with a numeric ID
        if (href.match(/bunnings\.com\.au\/[^/]+-\d+$/) || href.match(/\/p\/\d+/)) {
          return {
            url: href,
            name: link.textContent?.trim().substring(0, 100) || "Unknown product",
          };
        }
      }

      return null;
    });

    if (!firstProduct) {
      // Take a screenshot for debugging if needed
      const pageText = await page.evaluate(() => document.body.innerText.substring(0, 500));
      return `No products found for "${query}". Page content preview: ${pageText}`;
    }

    // Navigate to the product page
    await page.goto(firstProduct.url, { waitUntil: "networkidle2", timeout: 30000 });
    await delay(2000);

    // Extract location from product page
    const productLocation = await extractLocationFromPage(page);

    // Also get product details
    const productDetails = await page.evaluate(() => {
      const name =
        document.querySelector("h1")?.innerText?.trim() ||
        document.querySelector('[data-locator="product-title"]')?.textContent?.trim() ||
        "";
      const price =
        document.querySelector('[data-locator="product-price"]')?.textContent?.trim() ||
        document.querySelector('[class*="price"]')?.textContent?.trim() ||
        "";
      return { name, price };
    });

    const location = productLocation || searchResultLocation;
    const productName = productDetails.name || firstProduct.name;
    const price = productDetails.price ? ` (${productDetails.price})` : "";

    if (location) {
      return [
        `Found: ${productName}${price}`,
        `Location: ${location}`,
        `URL: ${firstProduct.url}`,
        "",
        "Note: This is a similar product to help you find the right area of the store.",
      ].join("\n");
    }

    return [
      `Found: ${productName}${price}`,
      `URL: ${firstProduct.url}`,
      "",
      "Could not find aisle/bay info. This usually means:",
      "- No store is selected (try specifying a store name)",
      "- The product doesn't have in-store location data",
      "",
      "Try opening the URL above and selecting your store to see the location.",
    ].join("\n");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
