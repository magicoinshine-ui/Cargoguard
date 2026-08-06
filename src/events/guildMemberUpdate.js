const {
    getProtectedRoles,
    getApprovalChannel,
    getApproverRole
} = require("../repositories/configRepository");


const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


const db = require("../database/database");


global.approvedCargo =
    global.approvedCargo || new Set();




module.exports = {

    name: "guildMemberUpdate",



    async execute(client, oldMember, newMember) {


        try {


            const addedRoles =
                newMember.roles.cache.filter(

                    role =>
                    !oldMember.roles.cache.has(role.id)

                );



            if (addedRoles.size === 0)
                return;





            const protectedRoles =
                getProtectedRoles(
                    newMember.guild.id
                );



            if (!protectedRoles.length)
                return;





            const approverRole =
                getApproverRole(
                    newMember.guild.id
                );



            // =========================
            // IGNORA APROVADORES
            // =========================

            if (

                approverRole &&

                newMember.roles.cache.has(
                    approverRole
                )

            ) {

                return;

            }







            const ignoredRoles = new Set();



            for (const role of addedRoles.values()) {


                const key =
                    `${newMember.id}_${role.id}`;



                if (

                    global.approvedCargo.has(
                        key
                    )

                ) {


                    global.approvedCargo.delete(
                        key
                    );


                    ignoredRoles.add(
                        role.id
                    );


                }


            }









            const blockedRoles =
                addedRoles.filter(


                    role =>


                    protectedRoles.includes(
                        role.id
                    )


                    &&


                    !ignoredRoles.has(
                        role.id
                    )


                );




            if (blockedRoles.size === 0)
                return;









            const channelId =
                getApprovalChannel(
                    newMember.guild.id
                );




            const channel =
                newMember.guild.channels.cache.get(
                    channelId
                );



            if (!channel) {


                console.log(
                    "❌ Canal de aprovação não configurado."
                );


                return;

            }






            for (const role of blockedRoles.values()) {




                // Verifica hierarquia do bot

                if (

                    role.position >=
                    newMember.guild.members.me.roles.highest.position

                ) {


                    console.log(
                        `❌ Bot sem permissão para remover ${role.name}`
                    );


                    continue;

                }






                await newMember.roles.remove(

                    role.id,

                    "Cargo protegido aguardando aprovação"

                );







                const request =

                    db.prepare(`

                    INSERT INTO requests

                    (

                        guild_id,

                        user_id,

                        role_id,

                        executor_id

                    )

                    VALUES (?, ?, ?, ?)

                    `)

                    .run(


                        newMember.guild.id,

                        newMember.id,

                        role.id,

                        oldMember.id


                    );







                const requestId =
                    request.lastInsertRowid;







                const embed =

                    new EmbedBuilder()

                    .setTitle(
                        "🛡️ Solicitação de cargo"
                    )


                    .setDescription(

`
👤 Usuário:
<@${newMember.id}>


🎖️ Cargo:
<@&${role.id}>


🆔 Pedido:
${requestId}
`

                    )


                    .setColor(
                        "Orange"
                    )


                    .setTimestamp();









                const buttons =

                    new ActionRowBuilder()

                    .addComponents(



                        new ButtonBuilder()

                        .setCustomId(
                            `approve_${requestId}`
                        )

                        .setLabel(
                            "✅ Aprovar"
                        )

                        .setStyle(
                            ButtonStyle.Success
                        ),





                        new ButtonBuilder()

                        .setCustomId(
                            `deny_${requestId}`
                        )

                        .setLabel(
                            "❌ Negar"
                        )

                        .setStyle(
                            ButtonStyle.Danger
                        )



                    );









                const approverRole =
                    getApproverRole(
                        newMember.guild.id
                    );





                await channel.send({


                    content:

                    approverRole

                    ?

                    `<@&${approverRole}>`

                    :

                    "",



                    embeds:[

                        embed

                    ],



                    components:[

                        buttons

                    ]


                });



            }







        } catch(error) {



            console.error(

                "Erro CargoGuard:",

                error

            );


        }


    }

};