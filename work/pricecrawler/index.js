const watchlist = require('./watchlist.json');
const Crawler = require('crawler');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

require('dotenv').config();

let history = {};
let lastHistory = null;

const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY, { polling: false });

const settings = {
  verkkokauppa: {
    baseUrl: (id) => `https://www.verkkokauppa.com/fi/product/${id}`,
    parsePrice: (node) => node.$('.price-tag-content__price-tag-price--current > .price-tag-price__euros').attr('content'),
    parseName: (node) => node.$('.product__name-title').text(),
  },
  jimms: {
    baseUrl: (id) => `https://www.jimms.fi/fi/Product/Show/${id}`,
    parsePrice: (node) => node.$('.price .pricetext > span').text().replace(',', '.'),
    parseName: (node) => node.$('.nameinfo h1.name').text(),
  },
  gigantti: {
    baseUrl: (id) => `https://www.gigantti.fi/search?SearchTerm=${id}&RedirectToFirstSearchResult=true`,
    parsePrice: (node) => node.$('.product-price-container').text(),
    parseName: (node) => node.$('.product-title').text(),
  },
};

const productsToWatch = Object.keys(watchlist).reduce((l, x) => {
  return [...l, ...watchlist[x].map(y => ({
    id: y,
    type: x,
  }))];
}, []);

const crawler = new Crawler({
  maxConnections : 10,
  callback: () => { throw "No custom function defined" },
});

let crawledIndex = 0;

const finishedCrawling = () => {
  if (fs.existsSync('./db.json')) lastHistory = JSON.parse(fs.readFileSync('./db.json'));

  if (lastHistory) {
    for (let productId in lastHistory) {
      const product = lastHistory[productId];
      const timeDifference = Math.abs(new Date().getTime() - product.time) / (1000 * 3600 * 24);

      product.id = productId.split('-').slice(1).join('-');
      product.type = productId.split('-')[0];

      if (!product.value && timeDifference >= 1 && !product.notified) {
        const message = `Unable to get price for (${product.type}) product [${product.id}]`;
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);

        history[productId].notified = true;
        console.log(message);
        continue;
      }

      if (product.value && history[productId] && history[productId].value && product.value !== history[productId].value) {
        const url = settings[product.type].baseUrl(product.id);
        const message = [
          `Price has ${product.value < history[productId].value ? 'increased' : 'dropped'} for product:`,
          `[${product.name}](${url})`,
          '',
          `${product.value.toFixed(2)}€ → *${history[productId].value.toFixed(2)}€*`,
          `(${(history[productId].value - product.value).toFixed(2)}€)`,
        ];

        bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message.join('\n'), { parse_mode: 'markdown' });

        console.log(message);
        continue;
      }
    }
  }

  fs.writeFileSync('./db.json', JSON.stringify(history));

  console.log(`Finished crawling [${crawledIndex}] products`);
}

for (let product of productsToWatch) {
  const setting = settings[product.type];

  if (!setting) throw "Unknown product type";

  crawler.queue([{
    uri: setting.baseUrl(product.id),
    jQuery: true,
  
    callback: (error, res, done) => {
      let value = null;
      let name = product.id;

      if (!error) {
        try {
          value = parseFloat(setting.parsePrice(res));
        } catch(e) {
          value = null;
        }

        try {
          name = setting.parseName(res);
        } catch(e) {
          name = null;
        }
      } else {
        console.error(error);
      }

      history[`${product.type}-${product.id}`] = {
        time: Date.now(),
        name,
        value,
      };

      crawledIndex++;

      if (crawledIndex === productsToWatch.length) {
        finishedCrawling();
      }

      done();
    }
  }]);
}
