const auth = require('./credentials.json');
const Discord = require('discord.js');
const client = new Discord.Client();

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

        if (cmd == "settickets") {
            const embed = new Discord.RichEmbed()
                .setColor('#ff8a65')
                .addField('Sorry, this is not ready yet', 'This is a development version', false)
                .setTimestamp()
                .setFooter('the all-in-one community managment solution');
            msg.channel.send(embed);
        } else if (cmd == "setpunishments") {
            const embed = new Discord.RichEmbed()
                .setColor('#ff8a65')
                .addField('Sorry, this is not ready yet', 'This is a development version', false)
                .setTimestamp()
                .setFooter('the all-in-one community managment solution');
            msg.channel.send(embed);
        } else if (cmd == "setpunishments") {
            const embed = new Discord.RichEmbed()
                .setColor('#ff8a65')
                .addField('Sorry, this is not ready yet', 'This is a development version', false)
                .setTimestamp()
                .setFooter('the all-in-one community managment solution');
            msg.channel.send(embed);
        } else if (cmd == "setkey") {
            if (args.length > 1) {
                const embed = new Discord.RichEmbed()
                    .setColor('#ff8a65')
                    .addField('Sorry, this is not ready yet', 'This is a development version', false)
                    .setTimestamp()
                    .setFooter('the all-in-one community managment solution');
                msg.channel.send(embed);
            } else {
                const embed = new Discord.RichEmbed()
                    .setColor('#ff8a65')
                    .addField('Invalid params', 'You need a second param in order to execute this command', false)
                    .setTimestamp()
                    .setFooter('the all-in-one community managment solution');
                msg.channel.send(embed);
            }
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