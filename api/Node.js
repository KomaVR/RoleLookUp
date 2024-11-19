import fetch from 'node-fetch';

// Replace this URL with your Pastebin raw link
const PASTEBIN_URL = 'https://pastebin.com/raw/vKG7USvD';

async function getBotToken() {
  try {
    const response = await fetch(PASTEBIN_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch bot token');
    }
    return await response.text();
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching bot token');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { guildId, roleId } = req.body;

  if (!guildId || !roleId) {
    return res.status(400).json({ error: 'Guild ID and Role ID are required' });
  }

  try {
    const BOT_TOKEN = await getBotToken();

    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch members' });
    }

    const members = await response.json();
    const roleMembers = members.filter(member => member.roles.includes(roleId));

    res.status(200).json(roleMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
