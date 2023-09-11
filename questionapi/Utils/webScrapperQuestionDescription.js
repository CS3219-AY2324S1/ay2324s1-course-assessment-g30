const puppeteer = require('puppeteer');

const webScrapperQuestionDescription = async (link) => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(link);
    const selector = 'div.xFUwe[data-track-load="description_content"]';

    await page.waitForSelector(selector);
    const element = await page.$(selector);

    if (element) {
      const outerHTML = await page.evaluate((el) => el.outerHTML, element);
      await browser.close();
      return outerHTML;
    } else {
      throw new Error('Element not found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


module.exports = {webScrapperQuestionDescription}