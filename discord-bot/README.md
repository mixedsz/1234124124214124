# Flake Development Reviews Bot

Discord bot that lets users submit reviews to the store website via `/review`.

## Setup

1. **Install dependencies**
   ```bash
   cd discord-bot
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Fill in all values in .env
   ```

3. **Register slash commands** (run once, or whenever you change commands)
   ```bash
   node register-commands.js
   ```

4. **Start the bot**
   ```bash
   node bot.js
   ```

## Vercel Setup

Add these two environment variables in your Vercel dashboard:

| Variable | Value |
|---|---|
| `REVIEWS_BOT_TOKEN` | A long random string (generate with `openssl rand -hex 32`) |

The same `REVIEWS_BOT_TOKEN` value goes in the bot's `.env` file.

## Discord Developer Portal Setup

1. Go to https://discord.com/developers/applications
2. Create a new application
3. Go to **Bot** tab → click **Add Bot**
4. Copy the bot token → put in `.env` as `DISCORD_BOT_TOKEN`
5. Under **OAuth2 → URL Generator**, select scopes: `bot` + `applications.commands`
6. Select permissions: **Send Messages**, **Embed Links**, **Use Slash Commands**
7. Use the generated URL to invite the bot to your server

## Commands

| Command | Description | Who can use |
|---|---|---|
| `/review` | Submit a review (rating 1-5 + text + optional product name) | Everyone |
| `/deletereview` | Delete a review by ID | Administrators only |
