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

    updateRequestStatus(
        requestId,
        "DENIED",
        interaction.user.id
    );

    await interaction.update({

        embeds: [],

        content:
            `❌ Solicitação #${requestId} negada por ${interaction.user.tag}`,

        components: []

    });

};