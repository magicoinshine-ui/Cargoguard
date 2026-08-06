const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");



module.exports = {


    data: new SlashCommandBuilder()

        .setName("setup")

        .setDescription(
            "Abre o painel do CargoGuard"
        ),





    async execute(interaction) {



        await interaction.deferReply({

            ephemeral:true

        });







        const embed = new EmbedBuilder()


            .setTitle(
                "🛡️ CargoGuard"
            )


            .setDescription(

`
Configure o sistema usando os botões abaixo.


🛡️ Cargos protegidos

👥 Cargo aprovador

📢 Canal de aprovação

📋 Canal de logs

`

            )


            .setColor(
                "Blue"
            )


            .setTimestamp();









        const row1 = new ActionRowBuilder()

            .addComponents(



                new ButtonBuilder()

                    .setCustomId(
                        "protectedRoles"
                    )

                    .setLabel(
                        "Cargos Protegidos"
                    )

                    .setStyle(
                        ButtonStyle.Primary
                    ),




                new ButtonBuilder()

                    .setCustomId(
                        "approvers"
                    )

                    .setLabel(
                        "Cargo Aprovador"
                    )

                    .setStyle(
                        ButtonStyle.Primary
                    )



            );











        const row2 = new ActionRowBuilder()

            .addComponents(




                new ButtonBuilder()

                    .setCustomId(
                        "channel"
                    )

                    .setLabel(
                        "Canal Aprovação"
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    ),





                new ButtonBuilder()

                    .setCustomId(
                        "logs"
                    )

                    .setLabel(
                        "📋 Canal de Logs"
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    )



            );











        const row3 = new ActionRowBuilder()

            .addComponents(




                new ButtonBuilder()

                    .setCustomId(
                        "save"
                    )

                    .setLabel(
                        "Salvar"
                    )

                    .setStyle(
                        ButtonStyle.Success
                    )



            );









        await interaction.editReply({


            embeds:[

                embed

            ],


            components:[

                row1,

                row2,

                row3

            ]


        });



    }


};