const {
    ActionRowBuilder,
    RoleSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    ChannelType,
    EmbedBuilder
} = require("discord.js");


const {
    saveProtectedRoles,
    saveApproverRole,
    saveApprovalChannel,
    saveLogChannel,
    getApproverRole,
    getLogChannel
} = require("../repositories/configRepository");


const db = require("../database/database");


global.approvedCargo =
    global.approvedCargo || new Set();






module.exports = {

    name: "interactionCreate",



    async execute(client, interaction) {



        console.log(
            "INTERAÇÃO:",
            interaction.type
        );







        // =========================
        // COMANDOS
        // =========================

        if (interaction.isChatInputCommand()) {



            const command =
                client.commands.get(
                    interaction.commandName
                );



            if (!command)
                return;



            try {


                await command.execute(
                    interaction
                );



            } catch(error) {


                console.error(
                    "Erro comando:",
                    error
                );



                if (!interaction.replied) {


                    await interaction.reply({

                        content:
                        "❌ Erro interno.",

                        ephemeral:true

                    });


                }


            }



            return;

        }









        // =========================
        // BOTÕES
        // =========================

        if (interaction.isButton()) {



            console.log(
                "BOTÃO:",
                interaction.customId
            );








            // SALVAR

            if (
                interaction.customId === "save"
            ) {



                await interaction.deferReply({

                    ephemeral:true

                });



                await interaction.editReply({

                    content:
                    "✅ Configuração salva!"

                });



                return;

            }









            // PERMISSÃO APROVADOR

            if (

                interaction.customId.startsWith("approve_")
                ||
                interaction.customId.startsWith("deny_")

            ) {



                const approverRole =
                    getApproverRole(
                        interaction.guild.id
                    );



                if (

                    !approverRole

                    ||

                    !interaction.member.roles.cache.has(
                        approverRole
                    )

                ) {



                    await interaction.reply({

                        content:
                        "❌ Você não tem permissão para analisar solicitações.",

                        ephemeral:true

                    });



                    return;

                }


            }









            // APROVAR

            if (
                interaction.customId.startsWith("approve_")
            ) {



                await interaction.deferReply({

                    ephemeral:true

                });





                const id =
                    interaction.customId.split("_")[1];





                const request =

                    db.prepare(`

                    SELECT *

                    FROM requests

                    WHERE id = ?

                    `)

                    .get(id);





                if (!request) {


                    return interaction.editReply({

                        content:
                        "❌ Pedido não encontrado."

                    });


                }






                const member =
                    await interaction.guild.members.fetch(

                        request.user_id

                    );





                global.approvedCargo.add(

                    `${request.user_id}_${request.role_id}`

                );





                await member.roles.add(

                    request.role_id,

                    "Cargo aprovado"

                );                const logChannelId =
                    getLogChannel(
                        interaction.guild.id
                    );


                const logChannel =
                    interaction.guild.channels.cache.get(
                        logChannelId
                    );


                if (logChannel) {


                    const embed =
                        new EmbedBuilder()

                        .setTitle(
                            "✅ Cargo aprovado"
                        )

                        .setDescription(
`
👤 Usuário:
<@${request.user_id}>

🎖️ Cargo:
<@&${request.role_id}>

👮 Aprovado por:
${interaction.user}
`
                        )

                        .setColor(
                            "Green"
                        )

                        .setTimestamp();



                    await logChannel.send({

                        embeds:[
                            embed
                        ]

                    });


                }






                db.prepare(`

                    UPDATE requests

                    SET status='APPROVED'

                    WHERE id=?

                `)
                .run(id);







                await interaction.message.edit({

                    content:

                    `✅ **Pedido aprovado!**\n\nAprovado por: ${interaction.user}`,

                    components:[]

                });







                await interaction.editReply({

                    content:
                    "✅ Cargo aprovado."

                });



                return;

            }









            // NEGAR

            if (
                interaction.customId.startsWith("deny_")
            ) {



                await interaction.deferReply({

                    ephemeral:true

                });






                const id =
                    interaction.customId.split("_")[1];







                const request =

                    db.prepare(`

                    SELECT *

                    FROM requests

                    WHERE id = ?

                    `)

                    .get(id);






                db.prepare(`

                    UPDATE requests

                    SET status='DENIED'

                    WHERE id=?

                `)
                .run(id);







                const logChannelId =
                    getLogChannel(
                        interaction.guild.id
                    );


                const logChannel =
                    interaction.guild.channels.cache.get(
                        logChannelId
                    );


                if (logChannel) {


                    const embed =
                        new EmbedBuilder()

                        .setTitle(
                            "❌ Cargo negado"
                        )

                        .setDescription(
`
👤 Usuário:
${request ? `<@${request.user_id}>` : "Não encontrado"}

🆔 Pedido:
${id}

👮 Negado por:
${interaction.user}
`
                        )

                        .setColor(
                            "Red"
                        )

                        .setTimestamp();



                    await logChannel.send({

                        embeds:[
                            embed
                        ]

                    });


                }







                await interaction.message.edit({

                    content:

                    `❌ **Pedido negado!**\n\nNegado por: ${interaction.user}`,

                    components:[]

                });







                await interaction.editReply({

                    content:
                    "❌ Solicitação negada."

                });



                return;

            }









            // PROTEGER CARGOS

            if (
                interaction.customId === "protectedRoles"
            ) {



                const roles =

                    interaction.guild.roles.cache

                    .filter(

                        role =>
                        role.id !== interaction.guild.id

                    )

                    .map(

                        role =>
                        role.id

                    );





                saveProtectedRoles(

                    interaction.guild.id,

                    roles

                );





                await interaction.reply({

                    content:

                    `🛡️ Todos os cargos protegidos!\nTotal: ${roles.length}`,

                    ephemeral:true

                });



                return;

            }









            // CARGO APROVADOR

            if (
                interaction.customId === "approvers"
            ) {



                const menu =

                    new RoleSelectMenuBuilder()

                    .setCustomId(
                        "selectApproverRole"
                    )

                    .setPlaceholder(
                        "Selecione o cargo aprovador"
                    )

                    .setMinValues(1)

                    .setMaxValues(1);





                await interaction.reply({

                    content:
                    "👥 Selecione o cargo aprovador:",


                    components:[

                        new ActionRowBuilder()

                        .addComponents(menu)

                    ],


                    ephemeral:true

                });



                return;

            }









            // CANAL APROVAÇÃO

            if (
                interaction.customId === "channel"
            ) {



                const menu =

                    new ChannelSelectMenuBuilder()

                    .setCustomId(
                        "selectApprovalChannel"
                    )

                    .setPlaceholder(
                        "Selecione o canal de aprovação"
                    )

                    .setChannelTypes(
                        ChannelType.GuildText
                    );





                await interaction.deferReply({

                    ephemeral:true

                });



                await interaction.editReply({

                    content:
                    "📢 Selecione o canal de aprovação:",


                    components:[

                        new ActionRowBuilder()

                        .addComponents(menu)

                    ]

                });



                return;

            }









            // CANAL LOGS

            if (
                interaction.customId === "logs"
            ) {



                const menu =

                    new ChannelSelectMenuBuilder()

                    .setCustomId(
                        "selectLogChannel"
                    )

                    .setPlaceholder(
                        "Selecione o canal de logs"
                    )

                    .setChannelTypes(
                        ChannelType.GuildText
                    );





                await interaction.deferReply({

                    ephemeral:true

                });



                await interaction.editReply({

                    content:
                    "📋 Selecione o canal de logs:",


                    components:[

                        new ActionRowBuilder()

                        .addComponents(menu)

                    ]

                });



                return;

            }



        }









        // SELECT CARGO

        if (
            interaction.isRoleSelectMenu()
        ) {



            if (
                interaction.customId === "selectApproverRole"
            ) {



                saveApproverRole(

                    interaction.guild.id,

                    interaction.values[0]

                );





                await interaction.update({

                    content:
                    "✅ Cargo aprovador salvo!",

                    components:[]

                });



            }



            return;

        }









        // SELECT CANAIS

        if (
            interaction.isChannelSelectMenu()
        ) {



            if (
                interaction.customId === "selectApprovalChannel"
            ) {



                saveApprovalChannel(

                    interaction.guild.id,

                    interaction.values[0]

                );



                await interaction.update({

                    content:
                    "✅ Canal de aprovação salvo!",

                    components:[]

                });



                return;

            }







            if (
                interaction.customId === "selectLogChannel"
            ) {



                saveLogChannel(

                    interaction.guild.id,

                    interaction.values[0]

                );



                await interaction.update({

                    content:
                    "✅ Canal de logs salvo!",

                    components:[]

                });



                return;

            }



        }



    }

};