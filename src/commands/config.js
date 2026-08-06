const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");


const {
    getConfig
} = require("../repositories/configRepository");


const db = require("../database/database");



module.exports = {


    data: new SlashCommandBuilder()

        .setName("config")

        .setDescription(
            "Mostra a configuração do CargoGuard"
        ),




    async execute(interaction) {


        try {


            await interaction.deferReply({
                ephemeral: true
            });



            const config =
                getConfig(
                    interaction.guild.id
                );



            const pending =
                db.prepare(`

                    SELECT COUNT(*) AS total

                    FROM requests

                    WHERE guild_id = ?

                    AND status = 'PENDING'

                `)
                .get(
                    interaction.guild.id
                );



            const embed =
                new EmbedBuilder()


                .setTitle(
                    "🛡️ CargoGuard Configuração"
                )


                .setColor(
                    "Blue"
                )


                .setDescription(
`
🛡️ **Cargos protegidos**

\`${config.protected_roles.length}\` cargos


👥 **Cargo aprovador**

${
config.approver_role
?
`<@&${config.approver_role}>`
:
"Não configurado"
}


📢 **Canal de aprovação**

${
config.log_channel
?
`<#${config.log_channel}>`
:
"Não configurado"
}


📨 **Pedidos pendentes**

\`${pending?.total || 0}\`


🟢 **Sistema**

Ativo
`
                )


                .setTimestamp();





            await interaction.editReply({

                embeds: [
                    embed
                ]

            });



        } catch(error) {


            console.error(
                "Erro no /config:",
                error
            );



            if (!interaction.replied) {


                await interaction.reply({

                    content:
                    "❌ Erro ao carregar configuração.",

                    ephemeral:true

                });


            }


        }


    }


};