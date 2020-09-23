const Discord = require("discord.js");
const randomPuppy = require("random-puppy");
module.exports = {
  name: "animememe",
  cooldown: 15,
  category: "fun",
  aliases: ["am"],
  usage: "f!animememe",
  description: "Get's an anime meme from the internet",
  async execute(client, message, args) {
    let reddit = ["animemes"];
    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];
    message.channel.startTyping();
    randomPuppy(subreddit)
      .then(async url => {
        await message.channel
          .send({ files: [{ attachment: url, name: "Animememe.png" }] })
          .then(() => message.channel.stopTyping());
      })
      .catch(err => console.error(err));
  }
};
