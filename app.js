require('dotenv').config(); // Load value from env
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js')
const axios = require('axios');

// Get value from env
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const IPINFO_TOKEN = process.env.IPINFO_TOKEN;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Create Discord Client Intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log('Made By _realrcs_');
    console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
    // Bot can't recognize bot message
    if (message.author.bot) return;

    // '&&ipinfo <ip>' command
    if (message.content.startsWith('&&ipinfo ')) {
        const ip = message.content.split(' ')[1];
        if (!ip) {
            message.reply('Please provide an IP address.');
            return;
        }

        try {
            // Search IP Info 
            const ipInfoResponse = await axios.get(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
            const ipInfo = ipInfoResponse.data;

            // Extract IP Info 
            const { city, region, country, loc } = ipInfo;
            const [latitude, longitude] = loc.split(',');

            // Create Google Maps Static Img URL
            const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=12&size=600x300&maptype=roadmap&markers=color:red%7Clabel:IP%7C${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

            // Create Embed Msg
            const embed = new EmbedBuilder()
                .setTitle(`IP Information for ${ip}`)
                .addFields(
                    { name: 'City', value: city || 'N/A', inline: true },
                    { name: 'Region', value: region || 'N/A', inline: true },
                    { name: 'Country', value: country || 'N/A', inline: true },
                    { name: 'Location', value: `${latitude}, ${longitude}` }
                )
                .setImage(mapUrl)
                .setColor('#0099ff');

            // Send Msg
            await message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching IP info:', error);
            message.reply('Error fetching IP information.');
        }
    }
});

// Login to Bot
client.login(DISCORD_TOKEN);
