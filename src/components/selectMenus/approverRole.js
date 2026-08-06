const {
    ActionRowBuilder,
    RoleSelectMenuBuilder
} = require("discord.js");

module.exports = {

    async execute(interaction) {

        const row = new ActionRowBuilder().addComponents(

            new RoleSelectMenuBuilder()
                .setCustomId("approver_role_select")
                .setPlaceholder("Selecione o cargo aprovador")
                .setMinValues(1)
                .setMaxValues(1)

        );

        await interaction.reply({

            content: "👮 Escolha o cargo que poderá aprovar:",

            components: [row],

            ephemeral: true

        });

    }

};