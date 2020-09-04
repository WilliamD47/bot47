const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { geniusLyricsAPI } = require('../../config.json');

module.exports = class LyricsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lyrics',
      memberName: 'lyrics',
      aliases: ['lr'],
      description:
        'Get lyrics of any song or the lyrics of the currently playing song',
      group: 'music',
      throttling: {
        usages: 1,
        duration: 10
      },
      args: [
        {
          key: 'songName',
          default: '',
          type: 'string',
          prompt: 'What song lyrics would you like to get?'
        }
      ]
    });
  }
  async run(message, { songName }) {
    if (
      songName == '' &&
      message.guild.musicData.isPlaying &&
      !message.guild.triviaData.isTriviaRunning
    ) {
      songName = message.guild.musicData.nowPlaying.title;
    } else if (songName == '' && message.guild.triviaData.isTriviaRunning) {
      return message.say('Please try again after the trivia has ended');
    } else if (songName == '' && !message.guild.musicData.isPlaying) {
      return message.say(
        'There is no song playing right now, please try again with a song name or play a song first'
      );
    }
    const sentMessage = await message.channel.send(
      'Sorry Lyrics are temporarily broken at the moment :/'
       
    );
      return; //WilliamD47

    // remove stuff like (Official Video)
    songName = songName.replace(/ *\([^)]*\) */g, '');

    // remove emojis
    songName = songName.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ''
    );

    LyricsCommand.searchSong(songName)
      .then(function(url) {
        LyricsCommand.getSongPageURL(url)
          .then(function(url) {
            LyricsCommand.getLyrics(url)
              .then(function(lyrics) {
                if (lyrics.length > 4095) {
                  message.say(
                    'Lyrics are too long to be returned in a message embed'
                  );
                  return;
                }
                if (lyrics.length < 2048) {
                  const lyricsEmbed = new MessageEmbed()
                    .setColor('#00724E')
                    .setDescription(lyrics.trim())
                    .setFooter('Provided by genius.com');
                  return sentMessage.edit('', lyricsEmbed);
                } else {
                  // 2048 < lyrics.length < 4096
                  const firstLyricsEmbed = new MessageEmbed()
                    .setColor('#00724E')
                    .setDescription(lyrics.slice(0, 2048))
                    .setFooter('Provided by genius.com');
                  const secondLyricsEmbed = new MessageEmbed()
                    .setColor('#00724E')
                    .setDescription(lyrics.slice(2048, lyrics.length))
                    .setFooter('Provided by genius.com');
                  sentMessage.edit('', firstLyricsEmbed);
                  message.channel.send(secondLyricsEmbed);
                  return;
                }
              })
              .catch(function(err) {
                message.say(err);
                return;
              });
          })
          .catch(function(err) {
            message.say(err);
            return;
          });
      })
      .catch(function(err) {
        message.say(err);
        return;
      });
  }
  //WilliamD47

  
};
