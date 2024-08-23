require('dotenv').config(); // .env 파일에서 환경 변수 로드
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js'); // EmbedBuilder로 변경
const axios = require('axios');

// 환경 변수에서 토큰 및 API 키 가져오기
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const IPINFO_TOKEN = process.env.IPINFO_TOKEN;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// 디스코드 클라이언트 생성
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // 메시지 콘텐츠를 읽기 위해 추가
    ]
});

client.once('ready', () => {
    console.log('Made By _realrcs_');
    console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
    // 봇이 자신이 보낸 메시지에는 반응하지 않도록
    if (message.author.bot) return;

    // '&&ipinfo <ip>' 명령어 처리
    if (message.content.startsWith('&&ipinfo ')) {
        const ip = message.content.split(' ')[1];
        if (!ip) {
            message.reply('Please provide an IP address.');
            return;
        }

        try {
            // IP 정보 조회
            const ipInfoResponse = await axios.get(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
            const ipInfo = ipInfoResponse.data;

            // IP 정보 추출
            const { city, region, country, loc } = ipInfo;
            const [latitude, longitude] = loc.split(',');

            // Google Maps Static Image URL 생성
            const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=12&size=600x300&maptype=roadmap&markers=color:red%7Clabel:IP%7C${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

            // 임베드 메시지 생성
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

            // 메시지 전송
            await message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching IP info:', error);
            message.reply('Error fetching IP information.');
        }
    }
});

// 디스코드 봇 로그인
client.login(DISCORD_TOKEN);