const {
    ActionRowBuilder,
    RoleSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    ChannelType
} = require("discord.js");



function protectedRolesMenu() {

    return new ActionRowBuilder()
        .addComponents(

            new RoleSelectMenuBuilder()

                .setCustomId("selectProtectedRoles")

                .setPlaceholder(
                    "Selecione os cargos protegidos"
                )

                .setMinValues(1)

                .setMaxValues(10)

        );

}



function approverMenu() {

    return new ActionRowBuilder()
        .addComponents(

            new RoleSelectMenuBuilder()

                .setCustomId("selectApproverRole")

                .setPlaceholder(
                    "Selecione o cargo aprovador"
                )

                .setMinValues(1)

                .setMaxValues(1)

        );

}



function channelMenu() {

    return new ActionRowBuilder()
        .addComponents(

            new ChannelSelectMenuBuilder()

                .setCustomId("selectApprovalChannel")

                .setPlaceholder(
                    "Selecione o canal"
                )

                .setChannelTypes(
                    ChannelType.GuildText
                )

        );

}



module.exports = {

    protectedRolesMenu,

    approverMenu,

    channelMenu

};