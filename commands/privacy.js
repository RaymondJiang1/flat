module.exports = {
	aliases: ['privacy policy'],
	category: 'info',
	cooldown: 5,
	description: "Get's the Privacy Policy of this bot!",
	name: 'privacy',
	usage: 'f!privacy',
	async execute(client, message, args) {
		message.channel.send({
			embed: {
				color: 'RANDOM',
				title: 'Privacy Policy',
				description: "We do not take any user's info or server info! Contact?\n DM either RaymondJiang1#5270 or neko#0003 😘 ",
			},
		});
	},
};