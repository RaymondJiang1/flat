const DBL = require("dblapi.js");
const { topgg } = require("../config.json");
const dbl = new DBL(process.env.DBLTOKEN)
const { MessageEmbed } = require("discord.js");

module.exports = {
  aliases: ["checkvote"],
  category: "info",
  cooldown: 5,
  description: "Checks if the user mentioned has voted for the bot",
  name: "vote",
  usage: "vote [ member ]",
  async execute(client, message, args) {
    exports.run = async (client, message, args) => {
      let user = message.mentions.users.first() || client.users.get(args[0]);
      if (!user) user = message.author;
      dbl.getVotes(user.id).then(voted => {
        if (!voted) {
          const embed = new MessageEmbed()
            .setDescription(`**${user.username}** is not voted me yet.`)
            .addField(
              "Please vote for me!",
              "[Vote for me!](https://top.gg/bot/733455907824074783/vote)"
            )
            .setColor(`RANDOM`);
          message.channel.send(embed);
        } else {
          message.channel.send(`Yay! **${user.username}** already voted me :)`);
        }
      });
    };
  }
};
