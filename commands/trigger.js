const Discord = require("discord.js");
const AME_API =
  "e82863b65736272fd83285b9e97d79e3b563493475a21425dd79e5854f2953de06063997a93cc5c825a7d50804d4fbb4cedc04c786316ab8ef0cb2b0ba06a034";
const AmeClient = require("amethyste-api");
const AmeAPI = new AmeClient(AME_API);
module.exports = {
  name: "trigger",
  category: "fun",
  cooldown: 30,
  aliases: ["angry"],
  description: "Makes someone's avatar triggered :D",
  async execute(client, message, args) {
    let user =
      (await message.mentions.members.first()) ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        r => r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
      ) ||
      message.guild.members.cache.find(
        r => r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
      ) ||
      message.member;
    let m = await message.channel.send("**Please wait...**");
    let buffer = await AmeAPI.generate("triggered", {
      url: user.user.displayAvatarURL({ format: "png", size: 512 }),
      sepia: "false",
      invert: "false"
    });
    let attachment = new Discord.MessageAttachment(buffer, "triggered.gif");
    m.delete({ timeout: 5000 });
    message.channel.send(attachment);
  }
};
