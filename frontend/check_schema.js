const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://tajpetha.in/in/products/dalmoth', { waitUntil: 'networkidle2' });
  
  const schemas = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map(script => script.innerHTML);
  });
  
  console.log(JSON.stringify(schemas, null, 2));
  await browser.close();
})();
