import { config } from "dotenv";
config();
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

const chatId = process.env.CHAT_ID;
const devChatId = process.env.DEV_CHAT_ID;

export function sendMessage(message, options = {}) {
  bot.sendMessage(chatId, message, options);
}

export function sendDebug(message, options = {}) {
  bot.sendMessage(devChatId, message, options);
}

export function sendMessageWithReplyMarkup(message, options = {}) {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: options.linkText,
            url: options.linkUrl,
          },
        ],
      ],
    },
  };
  bot.sendMessage(chatId, message, opts);
}

bot.on("polling_error", (err) => console.log(err));
