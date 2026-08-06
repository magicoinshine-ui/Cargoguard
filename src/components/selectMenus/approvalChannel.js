const {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType
} = require("discord.js");

module.exports = {

    async execute(interaction) {

        const row = new ActionRowBuilder().addComponents(

            new ChannelSelectMenuBuilder()
                .setCustomId("approval_channel_select")
                .setPlaceholder("Selecione o canal de aprovação")
                .addChannelTypes(ChannelType.GuildText)

        );

        await interaction.reply({

            content: "📁 Escolha o canal onde serão enviados os pedidos de aprovação.",

            components: [row],

            ephemeral: true

        });

    }

};