const {
    getRequest,
    updateRequest
} = require("../repositories/requestRepository");


const {
    getLogChannel
} = require("../repositories/configRepository");


const {
    EmbedBuilder
} = require("discord.js");






async function sendLog(
    guild,
    embed
) {


    const channelId =
        getLogChannel(
            guild.id
        );



    if (!channelId)
        return;



    const channel =
        guild.channels.cache.get(
            channelId
        );



    if (!channel)
        return;



    await channel.send({

        embeds:[

            embed

        ]

    });


}









async function approveRequest(
    interaction,
    requestId
) {



    const request =
        getRequest(requestId);




    if (!request) {


        return interaction.reply({

            content:
            "❌ Pedido não encontrado.",

            ephemeral:true

        });


    }







    const guild =
        interaction.guild;





    const member =
        await guild.members.fetch(

            request.user_id

        );







    await member.roles.add(

        request.role_id,

        "Cargo aprovado pelo CargoGuard"

    );







    updateRequest(

        requestId,

        "APPROVED",

        interaction.user.id

    );








    const embed =

        new EmbedBuilder()

        .setTitle(
            "🟢 Cargo aprovado"
        )

        .setColor(
            "Green"
        )

        .setDescription(

`
👤 Usuário:
<@${request.user_id}>


🎖️ Cargo:
<@&${request.role_id}>


✅ Aprovado por:
${interaction.user}


🆔 Pedido:
${requestId}
`

        )

        .setTimestamp();






    await sendLog(

        guild,

        embed

    );







    return interaction.reply({

        content:
        "✅ Cargo aprovado e restaurado.",

        ephemeral:true

    });


}









async function denyRequest(
    interaction,
    requestId
) {



    const request =
        getRequest(requestId);





    if (!request) {


        return interaction.reply({

            content:
            "❌ Pedido não encontrado.",

            ephemeral:true

        });


    }








    updateRequest(

        requestId,

        "DENIED",

        interaction.user.id

    );







    const embed =

        new EmbedBuilder()

        .setTitle(
            "🔴 Cargo negado"
        )

        .setColor(
            "Red"
        )

        .setDescription(

`
👤 Usuário:
<@${request.user_id}>


🎖️ Cargo solicitado:
<@&${request.role_id}>


❌ Negado por:
${interaction.user}


🆔 Pedido:
${requestId}
`

        )

        .setTimestamp();






    await sendLog(

        guild,

        embed

    );







    return interaction.reply({

        content:
        "❌ Pedido negado.",

        ephemeral:true

    });



}









module.exports = {


    approveRequest,

    denyRequest


};