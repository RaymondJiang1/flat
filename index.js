const { Client, Collection, MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const {
	TOKEN,
	PREFIX,
	topgg,
	discordboats,
	danbot,
	MONGODB_URL,
} = require('./config.json');
const DBL = require('dblapi.js');
const dan = require('danbot-hosting');
const BOATS = require('boats.js');
const Boats = new BOATS(discordboats);
const GuildConfig = require('./database/GuildConfig');
const mongoose = require('mongoose');
mongoose.connect(`${MONGODB_URL}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const client = new Client({ disableMentions: 'everyone' });
const dbl = new DBL(topgg, client);

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
 * Client Events
 */
client.on('ready', async () => {
	const members = client.users.cache.size;
	const channels = client.channels.cache.size;
	const servers = client.guilds.cache.size;
	const id = client.user.id;
	const activitys = [
		`${members} users!`,
		`${servers} servers!`,
		`${channels} channels!`,
	];
	let i = 1;
	console.log(`${client.user.username} ready!`);
	setInterval(() => {
		client.user.setPresence({
			activity: {
				name: `${PREFIX}help | ${activitys[i++ % activitys.length]}`,
			},
			status: 'dnd',
		});
	}, 300000);
	Boats.postStats(servers, id)
		.then(() => {
			console.log('Successfully updated server count.');
		})
		.catch((err) => {
			console.error(err);
		});
	setInterval(() => {
		Boats.postStats(servers, id)
			.then(() => {
				console.log('Successfully updated server count.');
			})
			.catch((err) => {
				console.error(err);
			});
		dbl.postStats(
			client.guilds.cache.size,
			client.shards.Id,
			client.shards.total,
		);
	}, 1800000);
	const API = new dan.Client(danbot, client);

	// Start posting
	let initalPost = await API.autopost();

	if (initalPost) {
		console.error(initalPost); // console the error
	}
});
client.on('warn', (info) => console.log(info));
client.on('error', console.error);
client.on('guildCreate', async (guild) => {
	try {
		const guildConfig = await GuildConfig.create({
			guildId: guild.id,
		});
		console.log('Bot has joined a server. Saved to DB');
	} catch (err) {
		console.log(err);
	}
});
/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, 'commands')).filter((file) =>
	file.endsWith('.js'),
);
for (const file of commandFiles) {
	const command = require(join(__dirname, 'commands', `${file}`));
	client.commands.set(command.name, command);
}

client.on('message', async (message) => {
	if (message.author.bot) return;
	if (!message.guild) return;

	const prefixRegex = new RegExp(
		`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`,
	);
	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);

	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command =
		client.commands.get(commandName) ||
		client.commands.find(
			(cmd) => cmd.aliases && cmd.aliases.includes(commandName),
		);

	if (!command) return;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(
				`please wait ${timeLeft.toFixed(
					1,
				)} more second(s) before reusing the \`${command.name}\` command.`,
			);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(client, message, args);
	} catch (error) {
		console.error(error);
		message
			.reply('There was an error executing that command.')
			.catch(console.error);
	}
});
