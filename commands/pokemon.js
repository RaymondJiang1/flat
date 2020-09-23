const { get } = require("request-promise-native");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "pokemon",
  cooldown: 10,
  description: "Get's information about a pokemon",
  category: "info",
  async execute(client, message, args) {
    const pokemon = args.join(" ");
    const options = {
      url: `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex.php?pokemon=${args.join(
        pokemon
      )}`,
      json: true
    };
    if (!pokemon) return message.channel.send('Please provide a pokemon name!')
    message.channel.send("Fetching Informtion for API").then(msg => {
      get(options)
        .then(body => {
          let embed = new MessageEmbed()
            .setAuthor(
              body.name,
              `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/${body.images.typeIcon}`
            )
            .setDescription(body.info.description)
            .setThumbnail(
              `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/${body.images.photo}`
            )
            .setColor("#ff2050")
            .setFooter(
              `Weakness of pokemon - ${body.info.weakness}`,
              `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/${body.images.weaknessIcon}`
            );

          message.channel.send(embed);
          msg.delete();
        })
        .catch(err => {
          message.channel.send("Pokemon not found 😢");
        });
    });
  }
};
