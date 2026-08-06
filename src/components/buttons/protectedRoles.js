const {
    ActionRowBuilder,
    RoleSelectMenuBuilder
} = require("discord.js");

module.exports = {

    id: "protected_roles_menu",

    async execute(interaction) {

        const row = new ActionRowBuilder().addComponents(

            new RoleSelectMenuBuilder()
                .setCustomId("protected_roles_select")
                .setPlaceholder("Selecione os cargos protegidos")
                .setMinValues(1)
                .setMaxValues(25)

        );

        await interaction.reply({
            content: "🔐 Escolha os cargos protegidos:",
            components: [row],
            ephemeral: true
        });

    }

};