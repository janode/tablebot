# TableBot

Passbot runs a node-cron job that listens for available timeslots for booking table at restaurants listed at dinnerbooking.com.
When available slots are detected, will post a message to Telegram

## Minutae

- Push to heroku `git push heroku main`
- Tail logs `heroku logs --tail`

## Telegram bot setup

- Search for @BotFather and start conversation
- Use `/newbot` to create a new bot
- Store HTTP API token in .env as `TELEGRAM_BOT_TOKEN`
- Create a new group and add the new bot by searching for the user name you gave it while running `/newbot`
- Send a message to the bot using `@<botname>`, to create a new chat (see below)

## Telegram chat id

- Go to URL `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates`
- ChatId can be found using JSON Path `$.result[*].my_chat_member.chat.id`
- Repeat the same process for a second group chat with the bot
