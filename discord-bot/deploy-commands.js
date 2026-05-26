// Run once to register slash commands with Discord:
//   node deploy-commands.js

const { REST, Routes, SlashCommandBuilder, ChannelType } = require('discord.js');
require('./env');

const commands = [
  // ── /setup ──────────────────────────────────────────────────────────────────
  new SlashCommandBuilder()
    .setName('setup')
    .setDescription('[Admin] Set up the review channels and post the Leave a Review embed')
    .setDefaultMemberPermissions(8) // Administrator only
    .addChannelOption(opt =>
      opt
        .setName('review_channel')
        .setDescription('Channel where the "Leave a Review" embed will be posted')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addChannelOption(opt =>
      opt
        .setName('results_channel')
        .setDescription('Channel where submitted reviews will be displayed')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  // ── /review (legacy slash command kept for backwards compatibility) ─────────
  new SlashCommandBuilder()
    .setName('review')
    .setDescription('Submit a review for a Flake Development script')
    .addIntegerOption(opt =>
      opt
        .setName('rating')
        .setDescription('Your rating (1–5 stars)')
        .setRequired(true)
        .addChoices(
          { name: '⭐ 1 star',           value: 1 },
          { name: '⭐⭐ 2 stars',        value: 2 },
          { name: '⭐⭐⭐ 3 stars',      value: 3 },
          { name: '⭐⭐⭐⭐ 4 stars',    value: 4 },
          { name: '⭐⭐⭐⭐⭐ 5 stars',  value: 5 },
        )
    )
    .addStringOption(opt =>
      opt
        .setName('review')
        .setDescription('Your review (max 1000 characters)')
        .setRequired(true)
        .setMaxLength(1000)
    )
    .addStringOption(opt =>
      opt
        .setName('product')
        .setDescription('Which script are you reviewing?')
        .setRequired(false)
    ),

  // ── /deletereview ────────────────────────────────────────────────────────────
  new SlashCommandBuilder()
    .setName('deletereview')
    .setDescription('[Admin] Delete a review by ID')
    .setDefaultMemberPermissions(8) // Administrator only
    .addStringOption(opt =>
      opt
        .setName('id')
        .setDescription('Review ID to delete')
        .setRequired(true)
    ),

  // ── /updatevideo ─────────────────────────────────────────────────────────────
  new SlashCommandBuilder()
    .setName('updatevideo')
    .setDescription('[Admin] Set the showcase video on the website')
    .setDefaultMemberPermissions(8) // Administrator only
    .addStringOption(opt =>
      opt
        .setName('url')
        .setDescription('YouTube video URL or video ID')
        .setRequired(true)
    ),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID,
      ),
      { body: commands },
    );
    console.log('Commands registered successfully.');
  } catch (err) {
    console.error('Failed to register commands:', err);
    process.exit(1);
  }
})();
