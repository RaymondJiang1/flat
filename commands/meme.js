const Discord = require("discord.js");
const randomPuppy = require("random-puppy");
module.exports = {
  name: "meme",
  cooldown: 30,
  aliases: ["m"],
  category: "fun",
  description: "Get's a meme from the internet",
  async execute(client, message, args) {
    let reddit = [
      "meme",
      "animemes",
      "MemesOfAnime",
      "animememes",
      "AnimeFunny",
      "dankmemes",
      "dankmeme",
      "wholesomememes",
      "MemeEconomy",
      "techsupportanimals",
      "meirl",
      "me_irl",
      "2meirl4meirl",
      "AdviceAnimals"
    ];

    let subreddit = reddit[Math.floor(Math.random() * reddit.length)];

    message.channel.startTyping();

    randomPuppy(subreddit)
      .then(async url => {
        await message.channel
          .send({
            files: [
              {
                attachment: url,
                name: "meme.png"
              }
            ]
          })
          .then(() => message.channel.stopTyping());
      })
      .catch(err => console.error(err));
  }
};
