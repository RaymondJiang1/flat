module.exports = {
  name: "ping",
  cooldown: 30,
  category: "info",
  aliases: ["pong"],
  description: "Get's the latency from the bot to the discord API",
  async execute(client, message, args) {
    message.channel.send(`Pong! \`${client.ws.ping}\`ms!`)
  }
}