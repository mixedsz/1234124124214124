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

const CONFIG_PATH    = path.join(__dirname, 'config.json');
const LOGO_URL       = 'https://flakedevelopment.tebex.io/fd-favicon.png';
const EMBED_COLOR    = 0x3b82f6; // blue

const WEBSITE_URL = process.env.WEBSITE_URL || process.env.SITE_URL;

// ── Config helpers ────────────────────────────────────────────────────────────

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

function writeConfig(data) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Rating colour map ─────────────────────────────────────────────────────────

function ratingColor(rating) {
  switch (rating) {
    case 5:  return 0xffd700; // gold
    case 4:  return 0x22c55e; // green
    case 3:  return 0xeab308; // yellow
    case 2:  return 0xf97316; // orange
    default: return 0xef4444; // red  (1 star)
  }
}

// ── "Leave a Review" embed + button ──────────────────────────────────────────

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
  const button = new ButtonBuilder()
    .setCustomId('leave_review')
    .setLabel('⭐ Leave a Review')
    .setStyle(ButtonStyle.Primary);

  return new ActionRowBuilder().addComponents(button);
}

// ── Review result embed ───────────────────────────────────────────────────────

function buildResultEmbed(user, rating, title, reviewText) {
  const stars = '⭐'.repeat(rating);
  return new EmbedBuilder()
    .setColor(ratingColor(rating))
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL({ extension: 'png', size: 64 }),
    })
    .setTitle(`Review from ${user.username}`)
    .addFields(
      { name: 'Rating',        value: stars,      inline: true },
      { name: 'Product/Title', value: title,      inline: true },
      { name: 'Review',        value: reviewText, inline: false },
    )
    .setFooter({ text: `Submitted by ${user.tag ?? user.username}` })
    .setTimestamp();
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function buildReviewModal() {
  const modal = new ModalBuilder()
    .setCustomId('review_modal')
    .setTitle('Leave a Review');

  const ratingInput = new TextInputBuilder()
    .setCustomId('modal_rating')
    .setLabel('Rating (1-5)')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(1)
    .setPlaceholder('Enter a number from 1 to 5');

  const titleInput = new TextInputBuilder()
    .setCustomId('modal_title')
    .setLabel('Title')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100)
    .setPlaceholder('e.g. Amazing script!');

  const reviewInput = new TextInputBuilder()
    .setCustomId('modal_review')
    .setLabel('Review')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(1000)
    .setPlaceholder('Tell us what you think...');

  modal.addComponents(
    new ActionRowBuilder().addComponents(ratingInput),
    new ActionRowBuilder().addComponents(titleInput),
    new ActionRowBuilder().addComponents(reviewInput),
  );

  return modal;
}

// ── Discord client ────────────────────────────────────────────────────────────

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // Auto-register slash commands on every startup
  const commands = [
    new SlashCommandBuilder()
      .setName('setup')
      .setDescription('[Admin] Set up the review channels and post the Leave a Review embed')
      .setDefaultMemberPermissions(8)
      .addChannelOption(opt =>
        opt.setName('review_channel').setDescription('Channel where the "Leave a Review" embed will be posted').addChannelTypes(ChannelType.GuildText).setRequired(true)
      )
      .addChannelOption(opt =>
        opt.setName('results_channel').setDescription('Channel where submitted reviews will be displayed').addChannelTypes(ChannelType.GuildText).setRequired(true)
      ),
    new SlashCommandBuilder()
      .setName('review')
      .setDescription('Submit a review for a Flake Development script')
      .addIntegerOption(opt =>
        opt.setName('rating').setDescription('Your rating (1–5 stars)').setRequired(true)
          .addChoices(
            { name: '⭐ 1 star',          value: 1 },
            { name: '⭐⭐ 2 stars',       value: 2 },
            { name: '⭐⭐⭐ 3 stars',     value: 3 },
            { name: '⭐⭐⭐⭐ 4 stars',   value: 4 },
            { name: '⭐⭐⭐⭐⭐ 5 stars', value: 5 },
          )
      )
      .addStringOption(opt => opt.setName('review').setDescription('Your review (max 1000 characters)').setRequired(true).setMaxLength(1000))
      .addStringOption(opt => opt.setName('product').setDescription('Which script are you reviewing?').setRequired(false)),
    new SlashCommandBuilder()
      .setName('deletereview')
      .setDescription('[Admin] Delete a review by ID')
      .setDefaultMemberPermissions(8)
      .addStringOption(opt => opt.setName('id').setDescription('Review ID to delete').setRequired(true)),
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

// ── Interaction handler ───────────────────────────────────────────────────────

client.on(Events.InteractionCreate, async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'setup')        return handleSetup(interaction);
      if (interaction.commandName === 'review')       return handleReviewCommand(interaction);
      if (interaction.commandName === 'deletereview') return handleDeleteReview(interaction);
    }
    if (interaction.isButton()) {
      if (interaction.customId === 'leave_review') return handleLeaveReviewButton(interaction);
    }
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'review_modal') return handleReviewModal(interaction);
    }
  } catch (err) {
    console.error('Unhandled interaction error:', err);
    const msg = { content: '❌ An unexpected error occurred. Please try again.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg).catch(() => {});
    } else {
      await interaction.reply(msg).catch(() => {});
    }
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
    embedMessage = await reviewChannel.send({
      embeds:     [buildReviewEmbed()],
      components: [buildReviewButton()],
    });
  } catch (err) {
    console.error('Failed to post review embed:', err);
    return interaction.editReply({
      content: `❌ Could not post to <#${reviewChannel.id}>. Make sure I have **Send Messages** and **Embed Links** permissions there.`,
    });
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

// ── Button: "Leave a Review" ──────────────────────────────────────────────────

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
    return interaction.editReply({ content: '❌ Rating must be a number between **1** and **5**.' });
  }

  const user = interaction.user;
  const config = readConfig();
  const resultsChannelId = config[interaction.guildId]?.resultsChannelId;

  const payload = {
    discord_id:        user.id,
    username:          user.username,
    avatar_url:        user.displayAvatarURL({ extension: 'png', size: 128 }),
    rating,
    content:           reviewText,
    product_name:      title,
    verified_purchase: false,
  };

  try {
    if (!WEBSITE_URL) {
      console.warn('⚠️  WEBSITE_URL is not set — skipping API call.');
    } else {
      const res = await fetch(`${WEBSITE_URL}/api/reviews`, {
        method:  'POST',
<<<<<<< HEAD
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DISCORD_BOT_TOKEN}` },
=======
        headers: { 'Content-Type': 'application/json' },
>>>>>>> f4e6692 (Remove REVIEWS_BOT_TOKEN auth gate from reviews API)
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('API error:', res.status, err);
        return interaction.editReply({ content: `❌ Failed to submit review: ${err.error || `HTTP ${res.status}`}` });
      }
    }
  } catch (err) {
    console.error('Network error submitting review:', err);
    return interaction.editReply({ content: '❌ Network error — could not reach the store API. Please try again later.' });
  }

  if (resultsChannelId) {
    try {
      const resultsChannel = await client.channels.fetch(resultsChannelId).catch(() => null);
      if (resultsChannel?.isTextBased()) {
        await resultsChannel.send({ embeds: [buildResultEmbed(user, rating, title, reviewText)] });
      }
    } catch (err) {
      console.error('Failed to post result embed:', err);
    }
  }

  await interaction.editReply({ content: "✅ Thanks for your review! It's been submitted successfully." });
}

// ── /review (slash command) ───────────────────────────────────────────────────

async function handleReviewCommand(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const rating      = interaction.options.getInteger('rating', true);
  const reviewText  = interaction.options.getString('review', true);
  const productName = interaction.options.getString('product') ?? 'N/A';
  const user        = interaction.user;

  const payload = {
    discord_id:        user.id,
    username:          user.username,
    avatar_url:        user.displayAvatarURL({ extension: 'png', size: 128 }),
    rating,
    content:           reviewText,
    product_name:      productName,
    verified_purchase: false,
  };

  try {
    if (!WEBSITE_URL) {
      console.warn('⚠️  WEBSITE_URL is not set — skipping API call.');
    } else {
      const res = await fetch(`${WEBSITE_URL}/api/reviews`, {
        method:  'POST',
<<<<<<< HEAD
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DISCORD_BOT_TOKEN}` },
=======
        headers: { 'Content-Type': 'application/json' },
>>>>>>> f4e6692 (Remove REVIEWS_BOT_TOKEN auth gate from reviews API)
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return interaction.editReply({ content: `❌ Failed to submit review: ${err.error || `HTTP ${res.status}`}` });
      }
    }
  } catch (err) {
    console.error('Network error submitting review:', err);
    return interaction.editReply({ content: '❌ Network error — could not reach the store API.' });
  }

  const config = readConfig();
  const resultsChannelId = config[interaction.guildId]?.resultsChannelId;
  if (resultsChannelId) {
    const resultsChannel = await client.channels.fetch(resultsChannelId).catch(() => null);
    if (resultsChannel?.isTextBased()) {
      await resultsChannel.send({ embeds: [buildResultEmbed(user, rating, productName, reviewText)] }).catch(console.error);
    }
  }

  const stars = '⭐'.repeat(rating);
  await interaction.editReply({
    content: `✅ Your review has been submitted!\n\n${stars} — ${reviewText.slice(0, 100)}${reviewText.length > 100 ? '…' : ''}`,
  });
}

// ── /deletereview ─────────────────────────────────────────────────────────────

async function handleDeleteReview(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const id = interaction.options.getString('id', true);

<<<<<<< HEAD
  if (!WEBSITE_URL || !DISCORD_BOT_TOKEN) {
    return interaction.editReply({ content: '❌ WEBSITE_URL or DISCORD_BOT_TOKEN is not configured.' });
  }

  try {
    const res = await fetch(`${WEBSITE_URL}/api/reviews?id=${encodeURIComponent(id)}`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${DISCORD_BOT_TOKEN}` },
    });
=======
  if (!WEBSITE_URL) {
    return interaction.editReply({
      content: '❌ WEBSITE_URL is not configured.',
    });
  }

  try {
    const res = await fetch(
      `${WEBSITE_URL}/api/reviews?id=${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    );

>>>>>>> f4e6692 (Remove REVIEWS_BOT_TOKEN auth gate from reviews API)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return interaction.editReply({ content: `❌ ${err.error || `Failed to delete review (HTTP ${res.status})`}` });
    }
    await interaction.editReply({ content: `✅ Review \`${id}\` deleted successfully.` });
  } catch (err) {
    console.error('Error deleting review:', err);
    await interaction.editReply({ content: '❌ Network error — could not reach the store API.' });
  }
}

// ── Start ─────────────────────────────────────────────────────────────────────

// Minimal HTTP server so Render web service detects an open port
const http = require('http');
http.createServer((_, res) => res.end('OK')).listen(process.env.PORT || 3000);

client.login(process.env.DISCORD_BOT_TOKEN);
