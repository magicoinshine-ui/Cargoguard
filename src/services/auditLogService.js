const {
    EmbedBuilder
} = require("discord.js");


const {
    getApprovalChannel
} = require("../repositories/configRepository");



async function sendAuditLog(
    guild,
    title,
    description,
    color = "Blue"
) {


    const channelId =
        getApprovalChannel(
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



    const embed =
        new EmbedBuilder()

        .setTitle(title)

        .setDescription(description)

        .setColor(color)

        .setTimestamp();



    await channel.send({

        embeds:[
            embed
        ]

    });


}



module.exports = {

    sendAuditLog

};