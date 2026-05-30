# Flake Development Discord Bot

Discord bot for submitting reviews and managing the website showcase video.

## Setup

1. **Install dependencies**
   ```bash
   cd discord-bot
   npm install
   ```

2. **Configure environment** — create a `.env` file (or set these on your host):
   ```
   DISCORD_BOT_TOKEN=your_bot_token
   DISCORD_CLIENT_ID=your_application_id
   DISCORD_GUILD_ID=your_server_id
   WEBSITE_URL=https://flakedev.com
   BLOB_WEBHOOK_PUBLIC_KEY=same_value_as_in_vercel
   ```

3. **Register slash commands** (run once, or whenever you add/change commands)
   ```bash
   node register-commands.js
   ```

4. **Start the bot**
   ```bash
   node bot.js
   ```

   Commands also auto-register on every startup, so restarting the bot is enough after code changes.

## Environment Variables

| Variable | Where to get it |
|---|---|
| `DISCORD_BOT_TOKEN` | Discord Developer Portal → Bot → Token |
| `DISCORD_CLIENT_ID` | Discord Developer Portal → General Information → Application ID |
| `DISCORD_GUILD_ID` | Right-click your Discord server → Copy Server ID (Developer Mode must be on) |
| `WEBSITE_URL` | `https://flakedev.com` |
| `BLOB_WEBHOOK_PUBLIC_KEY` | Same value set in Vercel env vars |

## Discord Developer Portal Setup

1. Go to https://discord.com/developers/applications
2. Create (or select) your application
3. Go to **Bot** tab → copy the bot token → set as `DISCORD_BOT_TOKEN`
4. Copy the **Application ID** from General Information → set as `DISCORD_CLIENT_ID`
5. Under **OAuth2 → URL Generator**, select scopes: `bot` + `applications.commands`
6. Select permissions: **Send Messages**, **Embed Links**, **Use Slash Commands**
7. Use the generated URL to invite the bot to your server

## Commands

| Command | Description | Who can use |
|---|---|---|
| `/review` | Submit a review (rating 1-5 + text + optional product name) | Everyone |
| `/setup` | Set the review embed channel and results channel | Administrators only |
| `/deletereview` | Delete a review by ID | Administrators only |
| `/updatevideo` | Set the website showcase video (YouTube URL or video ID) | Administrators only |
