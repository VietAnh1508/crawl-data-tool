const puppeteer = require('puppeteer');
const fs = require('fs');
const downloader = require('image-downloader');

function getLargestImageFromSrcSet(srcSet) {
  const splitedSrcs = srcSet.split(',');
  const imgSrc = splitedSrcs[splitedSrcs.length - 1].split(' ')[0];
  return imgSrc;
}

async function getImageUrlsFromPage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const imageSrcSets = await page.evaluate(() => {
    let imgs = Array.from(
      document.querySelectorAll('.separator img, tbody img')
    );

    let srcSetAttribute = imgs.map(i => i.getAttribute('src'));
    return srcSetAttribute;
  });

  const imgUrls = imageSrcSets.map(srcSet => getLargestImageFromSrcSet(srcSet));
  await browser.close();
  return imgUrls;
}

(async () => {
  const resutlFolder = './image';
  if (!fs.existsSync(resutlFolder)) {
    fs.mkdirSync(resutlFolder);
  }

  const url =
    'https://gxucanxay.blogspot.com/2012/01/ngay-mong-ba-thanh-hoa-cong-viec-lam-va.html';
  const images = await getImageUrlsFromPage(url);

  images.forEach(image => {
    downloader({
      url: `https:${image}`,
      dest: resutlFolder
    });
  });
})();
