const auth = require('./credentials.json');
const Discord = require('discord.js');
const client = new Discord.Client();
global.fetch = require("node-fetch");
const Core = require('./core.js');

// (1) client start

client.login(auth.token);
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// (2) events
client.on('message', msg => {

    if (msg.toString().startsWith("!core")) {

        var args = msg.toString().substring(1).split(' ');
        var cmd = args[1];

        if (cmd == "setdonations") {

            try {

                if (msg.member.hasPermission('ADMINISTRATOR', false, false)) {

                    new Core().fromDiscord(msg.guild.id, auth.token).then(function (core) {

                        core.getInstance().asNetwork().setDonationChannel(msg.channel.id).then((core) => {

                            const embed = new Discord.RichEmbed()
                                .setColor('#ff8a65')
                                .addField('🔗', 'The donation events will now appear on this channel', false)
                                .setTimestamp()
                                .setFooter('the all-in-one community managment solution');
                            msg.channel.send(embed);

                        }).catch(function (reason) {
                            const embed = new Discord.RichEmbed()
                                .setColor('#ff8a65')
                                .addField('There was an error while linking the guild with your donation events', reason, false)
                                .setTimestamp()
                                .setFooter('the all-in-one community managment solution');
                            msg.channel.send(embed);
                        });

                    })

                } else {
                    const embed = new Discord.RichEmbed()
                        .setColor('#ff8a65')
                        .addField('❌ You\'re not an administrator!', 'You need to have the ADMINISTRATOR permission in order to execute this command.', false)
                        .setTimestamp()
                        .setFooter('the all-in-one community managment solution');
                    msg.channel.send(embed);
                }
            } catch (error) {
                console.log(error)
            }

        } else if (cmd == "setsessions") {
            try {

                if (msg.member.hasPermission('ADMINISTRATOR', false, false)) {

                    new Core().fromDiscord(msg.guild.id, auth.token).then(function (core) {

                        core.getInstance().asNetwork().setSessionChannel(msg.channel.id).then((core) => {

                            const embed = new Discord.RichEmbed()
                                .setColor('#ff8a65')
                                .addField('🔗', 'The session events will now appear on this channel', false)
                                .setTimestamp()
                                .setFooter('the all-in-one community managment solution');
                            msg.channel.send(embed);

                        }).catch(function (reason) {
                            const embed = new Discord.RichEmbed()
                                .setColor('#ff8a65')
                                .addField('There was an error while linking the guild with your session events', reason, false)
                                .setTimestamp()
                                .setFooter('the all-in-one community managment solution');
                            msg.channel.send(embed);
                        });

                    })

                } else {
                    const embed = new Discord.RichEmbed()
                        .setColor('#ff8a65')
                        .addField('❌ You\'re not an administrator!', 'You need to have the ADMINISTRATOR permission in order to execute this command.', false)
                        .setTimestamp()
                        .setFooter('the all-in-one community managment solution');
                    msg.channel.send(embed);
                }
            } catch (error) {
                console.log(error)
            }
        } else if (cmd == "setkey") {

            if (args.length = 3) {

                var coreInstance = new Core(args[2])

                try {
                    if (msg.member.hasPermission('ADMINISTRATOR', false, false)) {
                        coreInstance.getInstance().asNetwork().setGuild(msg.guild.id).then((successMessage) => {
                            const embed = new Discord.RichEmbed()
                                .setColor('#ff8a65')
                                .addField('🔗', 'This instance has been linked to this guild. The message has been deleted in order to prevent your keys to be copied.', false)
                                .setTimestamp()
                                .setFooter('the all-in-one community managment solution');
                            msg.channel.send(embed);
                        }).catch(function (reason) {
                            const embed = new Discord.RichEmbed()
                                .setColor('#ff8a65')
                                .addField('There was an error while linking the guild with your instance', reason, false)
                                .setTimestamp()
                                .setFooter('the all-in-one community managment solution');
                            msg.channel.send(embed);
                        });;
                    } else {
                        const embed = new Discord.RichEmbed()
                            .setColor('#ff8a65')
                            .addField('❌ You\'re not an administrator!', 'You need to have the ADMINISTRATOR permission in order to execute this command.', false)
                            .setTimestamp()
                            .setFooter('the all-in-one community managment solution');
                        msg.channel.send(embed);
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {

                const embed = new Discord.RichEmbed()
                    .setColor('#ff8a65')
                    .addField('Invalid params', 'You need a second param in order to execute this command. The message has been deleted in order to prevent your keys to be copied.', false)
                    .setTimestamp()
                    .setFooter('the all-in-one community managment solution');
                msg.channel.send(embed);

            }

            msg.delete()

        } else {

            const embed = new Discord.RichEmbed()
                .setColor('#ff8a65')
                .setTitle('core. help')
                .setDescription('Welcome to [purecore.io](https://purecore.io/)!')
                .setAuthor('quiquelhappy', 'https://i.imgur.com/OAQblee.png', 'https://twitter.com/quiquelhappy/')
                .addBlankField(false)
                .addField('!core setkey <key>', 'Sets your discord key. This links your instance with this guild. In order to execute any other commands, you need to do this first. You can get your key [here](https://purecore.io/dashboard/)', true)
                .addBlankField(false)
                .addField('!core settickets', 'Set ticket updates channel', true)
                .addField('!core setpunishments', 'Set punishment updates channel', true)
                .addField('!core setdonations', 'Set donation updates channel', true)
                .addField('!core setsessions', 'Set session updates channel', true)
                .addBlankField(false)
                .addField('!core minecraft', 'Returns your Minecraft account if any', true)
                .addField('!core payments', 'Returns your payments if any', true)
                .addField('!core link', 'Returns an url so you can link your discord account with your game sessions', true)
                .setTimestamp()
                .setFooter('the all-in-one community managment solution');
            msg.channel.send(embed);

        }
    }
});