const discord = require("discord.js");
const imdb = require("imdb-api");

module.exports = {
  name: "movie",
  cooldown: 10,
  category: "info",
  aliases: ["series"],
  description: "Get's information about a series or a movie",
  async execute(client, message, args) {
    if (!args.length) {
      return message.channel.send("Please give the name of movie or series");
    }

    const imob = new imdb.Client({ apiKey: "84924c54" }); //You need to paste you imdb api

    let movie = await imob.get({ name: args.join(" ") });

    let embed = new discord.MessageEmbed()
      .setTitle(movie.title)
      .setColor("#ff2050")
      .setThumbnail(movie.poster)
      .setDescription(movie.plot)
      .setFooter(`Ratings: ${movie.rating}`)
      .addField("Country", movie.country, true)
      .addField("Languages", movie.languages, true)
      .addField("Type", movie.type, true);

    message.channel.send(embed);
  }
};
