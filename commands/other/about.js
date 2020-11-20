const { Command } = require('discord.js-commando');

module.exports = class WhoMadeMeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'about',
      aliases: ['botinfo', 'whomademe', 'bot-maker', 'bot-creator'],
      memberName: 'about',
      group: 'other',
      description: "Learn about the bot and it's creator!"
    });
  }

  run(message) {
    message.say(
      'Made by WilliamD47 and also a bit of help from Master Bot'
    );
  }
};
