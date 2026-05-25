require('./env');

const fs   = require('fs');
const path = require('path');

const {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  REST,
  Routes,
  SlashCommandBuilder,
  ChannelType,
} = require('discord.js');

// ── Constants ─────────────────────────────────────────────────────────────────

const CONFIG_PATH = path.join(__dirname, 'config.json');
const LOGO_URL    = 'https://flakedevelopment.tebex.io/fd-favicon.png';
const EMBED_COLOR = 0x3b82f6;

const WEBSITE_URL = process.env.WEBSITE_URL || process.env.SITE_URL;

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function readConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')); } catch { return {}; }
}

function writeConfig(data) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function ratingColor(rating) {
  switch (rating) {
    case 5:  return 0xffd700;
    case 4:  return 0x22c55e;
    case 3:  return 0xeab308;
    case 2:  return 0xf97316;
    default: return 0xef4444;
  }
}

// ── Embeds ────────────────────────────────────────────────────────────────────

function buildReviewEmbed() {
  return new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle('⭐ Leave a Review!')
    .setDescription(
      "We hugely appreciate any reviews, good or bad! We do kindly ask that if you're having a problem, open a ticket and let us try to solve it for you first! 🧡",
    )
    .setThumbnail(LOGO_URL);
}

function buildReviewButton() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('leave_review')
      .setLabel('⭐ Leave a Review')
      .setStyle(ButtonStyle.Primary),
  );
}

function buildResultEmbed(user, rating, title, reviewText, reviewId) {
  const stars = '⭐'.repeat(rating);
  return new EmbedBuilder()
    .setColor(ratingColor(rating))
    .setAuthor({
      name:    `Review from ${user.username}`,
      iconURL: user.displayAvatarURL({ extension: 'png', size: 64, forceStatic: false }),
    })
    .setDescription(`${stars}\n**${title}**\n${reviewText}`)
    .setFooter({ text: `ID: ${reviewId ?? 'unknown'}` })
    .setTimestamp();
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function buildReviewModal() {
  const modal = new ModalBuilder().setCustomId('review_modal').setTitle('Leave a Review');
  modal.addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder().setCustomId('modal_rating').setLabel('Rating (1-5)')
        .setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(1).setPlaceholder('1–5'),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder().setCustomId('modal_title').setLabel('Title')
        .setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(100).setPlaceholder('e.g. Amazing script!'),
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder().setCustomId('modal_review').setLabel('Review')
        .setStyle(TextInputStyle.Paragraph).setRequired(true).setMaxLength(1000)
        .setPlaceholder('Tell us what you think...'),
    ),
  );
  return modal;
}

// ── Fetch all messages from a channel (paginates until exhausted) ─────────────

async function fetchAllMessages(channel) {
  const all = [];
  let before;
  while (true) {
    const opts = { limit: 100 };
    if (before) opts.before = before;
    const batch = await channel.messages.fetch(opts);
    if (batch.size === 0) break;
    all.push(...batch.values());
    before = batch.last().id;
    await sleep(600); // respect Discord rate limits
  }
  return all;
}

// ── Discord client ────────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const commands = [
    new SlashCommandBuilder()
      .setName('setup')
      .setDescription('[Admin] Set up review channels and post the Leave a Review embed')
      .setDefaultMemberPermissions(8)
      .addChannelOption(opt =>
        opt.setName('review_channel').setDescription('Channel for the "Leave a Review" embed')
          .addChannelTypes(ChannelType.GuildText).setRequired(true),
      )
      .addChannelOption(opt =>
        opt.setName('results_channel').setDescription('Channel where submitted reviews appear')
          .addChannelTypes(ChannelType.GuildText).setRequired(true),
      ),

    new SlashCommandBuilder()
      .setName('review')
      .setDescription('Submit a review for a Flake Development script')
      .addIntegerOption(opt =>
        opt.setName('rating').setDescription('Your rating (1–5 stars)').setRequired(true)
          .addChoices(
            { name: '⭐ 1 star',         value: 1 },
            { name: '⭐⭐ 2 stars',       value: 2 },
            { name: '⭐⭐⭐ 3 stars',     value: 3 },
            { name: '⭐⭐⭐⭐ 4 stars',   value: 4 },
            { name: '⭐⭐⭐⭐⭐ 5 stars', value: 5 },
          ),
      )
      .addStringOption(opt =>
        opt.setName('review').setDescription('Your review (max 1000 characters)').setRequired(true).setMaxLength(1000),
      )
      .addStringOption(opt =>
        opt.setName('product').setDescription('Which script are you reviewing?').setRequired(false),
      ),

    new SlashCommandBuilder()
      .setName('restore')
      .setDescription('[Admin] Import all old reviews from a channel — posted as 5 ⭐ with original date & avatar')
      .setDefaultMemberPermissions(8)
      .addChannelOption(opt =>
        opt.setName('channel')
          .setDescription('Channel containing the old reviews to restore')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true),
      ),

    new SlashCommandBuilder()
      .setName('deletereview')
      .setDescription('[Admin] Delete a single review by its ID')
      .setDefaultMemberPermissions(8)
      .addStringOption(opt =>
        opt.setName('id').setDescription('Review ID').setRequired(true),
      ),

    new SlashCommandBuilder()
      .setName('purgereviews')
      .setDescription('[Admin] Delete ALL reviews from a specific Discord username')
      .setDefaultMemberPermissions(8)
      .addStringOption(opt =>
        opt.setName('username').setDescription('Discord username whose reviews should be deleted').setRequired(true),
      ),
  ].map(cmd => cmd.toJSON());

  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
      { body: commands },
    );
    console.log('✅ Slash commands registered.');
  } catch (err) {
    console.error('❌ Failed to register slash commands:', err);
  }
});

// ── Interaction router ────────────────────────────────────────────────────────

client.on(Events.InteractionCreate, async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'setup')        return handleSetup(interaction);
      if (interaction.commandName === 'review')       return handleReviewCommand(interaction);
      if (interaction.commandName === 'restore')      return handleRestore(interaction);
      if (interaction.commandName === 'deletereview') return handleDeleteReview(interaction);
      if (interaction.commandName === 'purgereviews') return handlePurgeReviews(interaction);
    }
    if (interaction.isButton())      { if (interaction.customId === 'leave_review') return handleLeaveReviewButton(interaction); }
    if (interaction.isModalSubmit()) { if (interaction.customId === 'review_modal') return handleReviewModal(interaction); }
  } catch (err) {
    console.error('Unhandled interaction error:', err);
    const msg = { content: '❌ An unexpected error occurred.', ephemeral: true };
    if (interaction.replied || interaction.deferred) await interaction.followUp(msg).catch(() => {});
    else await interaction.reply(msg).catch(() => {});
  }
});

// ── /setup ────────────────────────────────────────────────────────────────────

async function handleSetup(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const reviewChannel  = interaction.options.getChannel('review_channel',  true);
  const resultsChannel = interaction.options.getChannel('results_channel', true);

  for (const ch of [reviewChannel, resultsChannel]) {
    if (!ch.isTextBased()) {
      return interaction.editReply({ content: `❌ <#${ch.id}> is not a text channel.` });
    }
  }

  let embedMessage;
  try {
    embedMessage = await reviewChannel.send({ embeds: [buildReviewEmbed()], components: [buildReviewButton()] });
  } catch (err) {
    console.error('Failed to post review embed:', err);
    return interaction.editReply({ content: `❌ Could not post to <#${reviewChannel.id}>. Check bot permissions.` });
  }

  const config = readConfig();
  config[interaction.guildId] = {
    reviewChannelId:  reviewChannel.id,
    resultsChannelId: resultsChannel.id,
    embedMessageId:   embedMessage.id,
  };
  writeConfig(config);

  await interaction.editReply({
    content:
      `✅ Setup complete!\n\n` +
      `• **Review embed** posted in <#${reviewChannel.id}>\n` +
      `• **Submitted reviews** will appear in <#${resultsChannel.id}>`,
  });
}

// ── Button ────────────────────────────────────────────────────────────────────

async function handleLeaveReviewButton(interaction) {
  await interaction.showModal(buildReviewModal());
}

// ── Modal submit ──────────────────────────────────────────────────────────────

async function handleReviewModal(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const ratingStr  = interaction.fields.getTextInputValue('modal_rating').trim();
  const title      = interaction.fields.getTextInputValue('modal_title').trim();
  const reviewText = interaction.fields.getTextInputValue('modal_review').trim();

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return interaction.editReply({ content: '❌ Rating must be between **1** and **5**.' });
  }

  const user = interaction.user;
  const payload = {
    discord_id:        user.id,
    username:          user.username,
    avatar_url:        user.displayAvatarURL({ extension: 'png', size: 128, forceStatic: false }),
    rating,
    content:           reviewText,
    product_name:      title,
    verified_purchase: false,
  };

  let reviewId;
  if (WEBSITE_URL) {
    const res = await fetch(`${WEBSITE_URL}/api/reviews`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    }).catch(() => null);
    if (!res?.ok) {
      const err = await res?.json().catch(() => ({}));
      return interaction.editReply({ content: `❌ Failed to submit: ${err?.error || `HTTP ${res?.status}`}` });
    }
    reviewId = (await res.json().catch(() => ({}))).review?.id;
  }

  const config = readConfig();
  const resultsChannelId = config[interaction.guildId]?.resultsChannelId;
  if (resultsChannelId) {
    const ch = await client.channels.fetch(resultsChannelId).catch(() => null);
    if (ch?.isTextBased()) {
      await ch.send({ embeds: [buildResultEmbed(user, rating, title, reviewText, reviewId)] }).catch(() => {});
    }
  }

  await interaction.editReply({ content: "✅ Thanks for your review! It's been submitted." });
}

// ── /review ───────────────────────────────────────────────────────────────────

async function handleReviewCommand(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const rating      = interaction.options.getInteger('rating', true);
  const reviewText  = interaction.options.getString('review', true);
  const productName = interaction.options.getString('product') ?? 'N/A';
  const user        = interaction.user;

  const payload = {
    discord_id:        user.id,
    username:          user.username,
    avatar_url:        user.displayAvatarURL({ extension: 'png', size: 128, forceStatic: false }),
    rating,
    content:           reviewText,
    product_name:      productName,
    verified_purchase: false,
  };

  if (WEBSITE_URL) {
    const res = await fetch(`${WEBSITE_URL}/api/reviews`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    }).catch(() => null);
    if (!res?.ok) {
      const err = await res?.json().catch(() => ({}));
      return interaction.editReply({ content: `❌ ${err?.error || `HTTP ${res?.status}`}` });
    }
    const data = await res.json().catch(() => ({}));
    const config = readConfig();
    const ch = await client.channels.fetch(config[interaction.guildId]?.resultsChannelId).catch(() => null);
    if (ch?.isTextBased()) {
      await ch.send({ embeds: [buildResultEmbed(user, rating, productName, reviewText, data.review?.id)] }).catch(() => {});
    }
  }

  await interaction.editReply({
    content: `✅ Review submitted!\n\n${'⭐'.repeat(rating)} — ${reviewText.slice(0, 100)}${reviewText.length > 100 ? '…' : ''}`,
  });
}

// ── /restore ──────────────────────────────────────────────────────────────────

async function handleRestore(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const channel = interaction.options.getChannel('channel', true);

  if (!channel.isTextBased()) {
    return interaction.editReply({ content: '❌ The selected channel must be a text channel.' });
  }
  if (!WEBSITE_URL) {
    return interaction.editReply({ content: '❌ WEBSITE_URL is not configured on the bot.' });
  }

  await interaction.editReply({ content: '⏳ Fetching all messages… this may take a while for large channels.' });

  let allMessages;
  try {
    allMessages = await fetchAllMessages(channel);
  } catch (err) {
    console.error('Error fetching messages:', err);
    return interaction.editReply({ content: '❌ Failed to fetch messages. Make sure I have **Read Message History** in that channel.' });
  }

  // Keep only non-bot, non-empty messages; sort chronologically
  const reviewMessages = allMessages
    .filter(m => !m.author.bot && m.content.trim().length > 0)
    .sort((a, b) => a.createdTimestamp - b.createdTimestamp);

  if (reviewMessages.length === 0) {
    return interaction.editReply({ content: '⚠️ No eligible messages found in that channel (empty or bot-only).' });
  }

  await interaction.editReply({
    content: `⏳ Found **${reviewMessages.length}** messages. Importing to website…`,
  });

  // Get configured results channel
  const config = readConfig();
  const resultsChannelId = config[interaction.guildId]?.resultsChannelId;
  const resultsChannel = resultsChannelId
    ? await client.channels.fetch(resultsChannelId).catch(() => null)
    : null;

  let imported = 0;
  let skipped  = 0;
  let failed   = 0;

  for (let i = 0; i < reviewMessages.length; i++) {
    const msg  = reviewMessages[i];
    const user = msg.author;

    const payload = {
      id:                `restored-${msg.id}`,
      discord_id:        user.id,
      username:          user.username,
      avatar_url:        user.displayAvatarURL({ extension: 'png', size: 128, forceStatic: false }),
      rating:            5,
      content:           msg.content.trim().slice(0, 1000),
      verified_purchase: false,
      created_at:        msg.createdAt.toISOString(),
    };

    try {
      const res = await fetch(`${WEBSITE_URL}/api/reviews`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (res.status === 409) {
        skipped++; // already imported
      } else if (res.ok) {
        const data = await res.json().catch(() => ({}));
        imported++;
        // Post result embed to results channel
        if (resultsChannel?.isTextBased()) {
          await resultsChannel.send({
            embeds: [buildResultEmbed(user, 5, '⭐⭐⭐⭐⭐', msg.content.slice(0, 300), data.review?.id)],
          }).catch(() => {});
          await sleep(100);
        }
      } else {
        failed++;
      }
    } catch {
      failed++;
    }

    await sleep(150); // throttle to avoid overwhelming the API

    // Progress update every 10 messages
    if ((i + 1) % 10 === 0 || i === reviewMessages.length - 1) {
      await interaction.editReply({
        content: `⏳ **${i + 1}/${reviewMessages.length}** — ✅ ${imported} imported · ⏭️ ${skipped} skipped · ❌ ${failed} failed`,
      }).catch(() => {});
    }
  }

  await interaction.editReply({
    content:
      `✅ **Restore complete!**\n\n` +
      `• ✅ **${imported}** reviews imported\n` +
      `• ⏭️ **${skipped}** already existed (skipped)\n` +
      `• ❌ **${failed}** failed`,
  });
}

// ── /deletereview ─────────────────────────────────────────────────────────────

async function handleDeleteReview(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const id = interaction.options.getString('id', true);
  if (!WEBSITE_URL) return interaction.editReply({ content: '❌ WEBSITE_URL not configured.' });

  const res = await fetch(`${WEBSITE_URL}/api/reviews?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => null);
  if (!res?.ok) {
    const err = await res?.json().catch(() => ({}));
    return interaction.editReply({ content: `❌ ${err?.error || `HTTP ${res?.status}`}` });
  }

  await interaction.editReply({ content: `✅ Review \`${id}\` deleted.` });
}

// ── /purgereviews ─────────────────────────────────────────────────────────────

async function handlePurgeReviews(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const username = interaction.options.getString('username', true);
  if (!WEBSITE_URL) return interaction.editReply({ content: '❌ WEBSITE_URL not configured.' });

  const res = await fetch(
    `${WEBSITE_URL}/api/reviews?username=${encodeURIComponent(username)}`,
    { method: 'DELETE' },
  ).catch(() => null);

  if (!res?.ok) {
    const err = await res?.json().catch(() => ({}));
    return interaction.editReply({ content: `❌ ${err?.error || `HTTP ${res?.status}`}` });
  }

  const data = await res.json().catch(() => ({}));
  await interaction.editReply({
    content: `✅ Deleted **${data.deleted ?? 0}** reviews from username \`${username}\`.`,
  });
}

// ── HTTP health check (required by Render) ────────────────────────────────────

const http = require('http');
http.createServer((_, res) => res.end('OK')).listen(process.env.PORT || 3000);

client.login(process.env.DISCORD_BOT_TOKEN);
