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


            // espera o Discord atualizar o cache
            await new Promise(resolve => setTimeout(resolve, 1000));



            const member =
                await newMember.guild.members.fetch(
                    newMember.id,
                    {
                        force:true
                    }
                );




            const addedRoles =
                member.roles.cache.filter(

                    role =>
                    !oldMember.roles.cache.has(role.id)

                );



            if (addedRoles.size === 0)
                return;





            const protectedRoles =
                getProtectedRoles(
                    member.guild.id
                );



            if (!protectedRoles.length)
                return;






            const blockedRoles =
                addedRoles.filter(

                    role =>

                    protectedRoles.includes(role.id)

                );



            if (blockedRoles.size === 0)
                return;






            const channelId =
                getApprovalChannel(
                    member.guild.id
                );



            const approverRole =
                getApproverRole(
                    member.guild.id
                );



            const channel =
                member.guild.channels.cache.get(
                    channelId
                );



            if (!channel)
                return;






            for (const role of blockedRoles.values()) {



                if (

                    role.position >=
                    member.guild.members.me.roles.highest.position

                ) {


                    console.log(
                        "Sem permissão para remover:",
                        role.name
                    );


                    continue;

                }





                await member.roles.remove(

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

                        member.guild.id,

                        member.id,

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
<@${member.id}>

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