const { MessageEmbed } = require('discord.js');
const { yandex_API } = require('../../config.js');
const ISO6391 = require('iso-639-1');
const fetch = require('node-fetch');

module.exports = {
    config: {
        name: 'translate',
        description: 'Translate to any language using the Yandex Translation service (only supported languages)',
        noalias: [""],
        category: "info",
        usage: "[language] | [text]",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        const supportedLanguages = ISO6391.getAllNames();
        const supportedLanguagesList = supportedLanguages.join(", ");

        if (args.length < 2) {
            return message.channel.send("<a:warn:891035320030724196> | Please provide a language and text to translate.");
        }

        const langCode = ISO6391.getCode(args[0]);
        const langName = ISO6391.getName(langCode);
        
        if (!langCode) {
            const notSupportedEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription("**<a:deny:892076004183506954> | This language is not supported!**");

            const supportedLanguagesEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("List of Supported Languages")
                .setThumbnail(message.guild.iconURL())
                .addField('**Supported Languages**', supportedLanguagesList);

            const sentMessage = await message.channel.send(notSupportedEmbed);
            return sentMessage.edit(supportedLanguagesEmbed);
        }

        const text = args.slice(1).join(" ");

        try {
            const res = await fetch(
                `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandex_API}&text=${encodeURI(
                    text
                )}&lang=${langCode}`
            );
            const json = await res.json();
            message.channel.send(embedTranslation(json.text[0]));
        } catch (e) {
            const errorEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription('**<a:warn:891035320030724196> | Something went wrong while trying to translate the text!**');
            return message.channel.send(errorEmbed);
        }

        function embedTranslation(text) {
            return new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`Translated to ${langName}`)
                .setDescription(text)
                .setFooter(message.guild.name, message.guild.iconURL());
        }
    }
};
