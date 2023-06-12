// This class will be made to handle all the discord bot functions
const discord = require('discord.js');
const client = new discord.Client();
const { MessageEmbed } = require('discord.js');

class DiscordBot {

    SendDiscordMessage(userId, message, status) {
        const user = client.users.cache.get(userId);
        if (!user) {
            console.error(`Could not find user with ID: ${userId}`);
            return;
        }
        // Create an embed message using the MessageEmbed class
        const embedMessage = new MessageEmbed()
            .setDescription(message);

        // If status is 'bad', make the color red and prepend the message with an X emoji
        if (status === 'bad') {
            embedMessage.setColor('#FF0000') // red color
                .setTitle('❌ ERROR ❌');
        }
        // If status is 'good', make the color green and prepend the message with a check emoji
        else if (status === 'good') {
            embedMessage.setColor('#00FF00') // green color 
                .setTitle('✅ SUCCESS ✅'); 
        }

        user.send(embedMessage).catch(console.error);
    }

    sendDiscordChannelMessage(channelId, message, status) {
        const channel = client.channels.cache.get(channelId);    
        if (!channel) {
          console.error(`Could not find channel with ID: ${channelId}`);
          return;
        }  
        // Create an embed message using the MessageEmbed class
        const embedMessage = new MessageEmbed()
          .setDescription(message);
      
        // If status is 'bad', make the color red and prepend the message with an X emoji
        if (status === 'bad') {
          embedMessage.setColor('#FF0000') // red color
            .setTitle('❌ ERROR ❌');
        }
        // If status is 'good', make the color green and prepend the message with a check emoji
        else if (status === 'good') {
          embedMessage.setColor('#00FF00') // green color
            .setTitle('✅ SUCCESS ✅');
        }
        
        channel.send(embedMessage).catch(console.error);
      }
}

module.exports.DiscordBot = DiscordBot;
// export client so we can use it in server.js
module.exports.client = client;

