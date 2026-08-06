const {
    getRequestById,
    updateRequestStatus
} = require("../../repositories/requestRepository");

module.exports = async (interaction) => {

    const requestId = interaction.customId.split("_")[1];

    const request = getRequestById(requestId);

    if (!request)
        return interaction.reply({
            content: "❌ Solicitação não encontrada.",
            ephemeral: true
        });

    const member = await interaction.guild.members.fetch(request.user_id);

    await member.roles.add(request.role_id);

    updateRequestStatus(
        requestId,
        "APPROVED",
        interaction.user.id
    );

    await interaction.update({

        embeds: [],

        content:
            `✅ Solicitação #${requestId} aprovada por ${interaction.user.tag}`,

        components: []

    });

};