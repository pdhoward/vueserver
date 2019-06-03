const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Your TELEGRAM_CHAT_ID is ${chatId}`);

  bot.closeWebHook();
  bot.stopPolling();
});