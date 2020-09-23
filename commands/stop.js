const { canModifyQueue } = require("../util/FlatBot");


module.exports = {
  name: "stop",
  category: "music",
  cooldown: 30,
  description: "Stops the music",
  async execute(client, message, args){
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏹ stopped the music!`).catch(console.error);
  }
};
