const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


function createRequestEmbed({
    guild,
    member,
    role,
    executor,
    requestId
}) {


    const embed = new EmbedBuilder()

        .setTitle("🛡️ CargoGuard - Solicitação de Cargo")

        .setDescription(
`
👤 **Usuário:**
${member}

🎭 **Cargo solicitado:**
${role}

👮 **Adicionado por:**
${executor || "Desconhecido"}

📌 **Status:**
⏳ Aguardando aprovação
`
        )

        .setThumbnail(
            member.user.displayAvatarURL()
        )

        .setFooter({
            text: guild.name,
            iconURL: guild.iconURL()
        })

        .setTimestamp();



    const buttons =
        new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
            .setCustomId(
                `approve_${requestId}`
            )
            .setLabel("Aprovar")
            .setStyle(
                ButtonStyle.Success
            ),


            new ButtonBuilder()
            .setCustomId(
                `deny_${requestId}`
            )
            .setLabel("Negar")
            .setStyle(
                ButtonStyle.Danger
            )

        );



    return {
        embeds:[embed],
        components:[buttons]
    };

}


module.exports = {
    createRequestEmbed
};