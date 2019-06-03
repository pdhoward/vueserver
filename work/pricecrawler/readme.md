<h1 align="center">PriceCrawler</h1>

<p align="center">
  <img src="https://i.imgur.com/RD6Kny8.png" height="300">
</p>

## How it works?

PriceCrawler will create a `db.json` with product prices, and notify the user if the price changed. User will also be notified if PriceCrawler is not able to get new price data for over a day.

## How to use?

1. Install Node.js and run `npm install`

2. Register a Telegram bot by sending a message to https://t.me/BotFather, and create a `.env` file with the bot ID, example:
  ```
  TELEGRAM_BOT_KEY = 000000000:AAAAAAA-BBBBBBBBBBBBBBBBBBBBB-CCCCC
  ```

  > More info on Telegram bots: https://core.telegram.org/bots#creating-a-new-bot

3. Run `node getTelegramChatID.js`, and press start on your new bot, the bot shoud respond with the chat ID. Add this chat ID to the end of `.env`, example:
  ```
  TELEGRAM_BOT_KEY = 000000000:AAAAAAA-BBBBBBBBBBBBBBBBBBBBB-CCCCC
  TELEGRAM_CHAT_ID = 000000000
  ```

4. Populate `watchlist.json` with the product IDs you want to monitor. More info on how to get them below. Example:
  ```json
  {
    "verkkokauppa": ["2466", "31223"],
    "jimms": ["1750"],
    "gigantti": ["DDCLOUDUNGIG"],
  }
  ```

5. The bot crawls the price data every time `node index.js` or `npm start` is run. You should make one of these commands execute every 1h or so. Below is an example on how to do this with `crontab`.

  ```shell
  # Get node location
  whereis node
  
  crontab -e

  Choose 1-4 [2]: # Hit Enter

  # Scroll to bottom

  # Add the line below, this will run index.js with node every hour
  0 * * * * cd [FULL PATH TO CURRENT FOLDER] && [NODE LOCATION] index.js >/dev/null 2>&1
  
  # Example filled command
  0 * * * * cd /root/PriceCrawler && /usr/bin/node index.js >/dev/null 2>&1

  CTRL+X
  y
  # Hit Enter
  ```

## Supported stores

- Verkkokauppa.com
  - ID = /fi/product/`2466`/jtvxr/Verkkokauppa-com-jalkapallo
- Jimms.fi
  - ID = /fi/Product/Show/`1750`/jimms-kasaus/jimm-s-tietokoneen-kokoonpano-ja-testaus
- Gigantti.fi
  - ID = /product/tietokoneet/ohjelmistot-ja-antivirus/`DDCLOUDUNGIG`/gigantti-pilvipalvelu
