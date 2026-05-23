require('./env');
const { Client, GatewayIntentBits, Events } = require('discord.js');

const SITE_URL = process.env.SITE_URL;          // e.g. https://yourstore.com
const BOT_TOKEN = process.env.REVIEWS_BOT_TOKEN; // same value as on Vercel
const REVIEWS_CHANNEL_ID = process.env.REVIEWS_CHANNEL_ID; // optional: channel to post confirmations

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // ── /review ──────────────────────────────────────────────────────────────
  if (interaction.commandName === 'review') {
    await interaction.deferReply({ ephemeral: true });

    const rating = interaction.options.getInteger('rating', true);
    const content = interaction.options.getString('review', true);
    const productName = interaction.options.getString('product') ?? undefined;
    const user = interaction.user;

    const payload = {
      discord_id: user.id,
      username: user.username,
      avatar_url: user.displayAvatarURL({ extension: 'png', size: 128 }),
      rating,
      content,
      product_name: productName,
      verified_purchase: false, // you can set this to true if you verify purchases via Tebex API
    };

    try {
      const res = await fetch(`${SITE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BOT_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        await interaction.editReply({ content: `❌ Failed to submit review: ${err.error || res.status}` });
        return;
      }

      const data = await res.json();
      const stars = '⭐'.repeat(rating);

      await interaction.editReply({
        content: `✅ Your review has been submitted!\n\n${stars} — ${content.slice(0, 100)}${content.length > 100 ? '…' : ''}`,
      });

      // Optionally post to a reviews channel
      if (REVIEWS_CHANNEL_ID) {
        const channel = await client.channels.fetch(REVIEWS_CHANNEL_ID).catch(() => null);
        if (channel?.isTextBased()) {
          channel.send({
            embeds: [{
              color: 0x3b82f6,
              author: {
                name: user.username,
                icon_url: user.displayAvatarURL({ extension: 'png', size: 64 }),
              },
              title: `${stars} ${productName ? `Review for ${productName}` : 'New Review'}`,
              description: content,
              footer: { text: `Review ID: ${data.review?.id ?? 'unknown'}` },
              timestamp: new Date().toISOString(),
            }],
          }).catch(console.error);
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      await interaction.editReply({ content: '❌ Network error — could not reach the store API.' });
    }
    return;
  }

  // ── /deletereview ─────────────────────────────────────────────────────────
  if (interaction.commandName === 'deletereview') {
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.options.getString('id', true);

    try {
      const res = await fetch(`${SITE_URL}/api/reviews?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${BOT_TOKEN}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        await interaction.editReply({ content: `❌ ${err.error || 'Failed to delete review'}` });
        return;
      }

      await interaction.editReply({ content: `✅ Review \`${id}\` deleted.` });
    } catch (err) {
      console.error('Error deleting review:', err);
      await interaction.editReply({ content: '❌ Network error.' });
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
