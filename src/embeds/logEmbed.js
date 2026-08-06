const {
    EmbedBuilder
} = require("discord.js");


function createLogEmbed({
    guild,
    member,
    role,
    executor,
    status
}) {


    return new EmbedBuilder()

    .setTitle(
        "🛡️ CargoGuard Log"
    )

    .setDescription(
`
👤 **Usuário:**
${member}

🎭 **Cargo:**
${role}

👮 **Adicionado por:**
${executor || "Desconhecido"}

📌 **Status:**
${status}
`
    )

    .setThumbnail(
        member.user.displayAvatarURL()
    )

    .setFooter({
        text:guild.name,
        iconURL:guild.iconURL()
    })

    .setTimestamp();

}



module.exports = {
    createLogEmbed
};