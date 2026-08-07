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

            // ========================================
            // DIAGNÓSTICO
            // ========================================

            console.log(
                `🔎 guildMemberUpdate recebido: ${newMember.user.tag}`
            );

            // ========================================
            // VERIFICA CARGOS ADICIONADOS
            // ========================================

            const addedRoles =
                newMember.roles.cache.filter(
                    role =>
                        !oldMember.roles.cache.has(role.id)
                );

            if (addedRoles.size === 0) {
                console.log(
                    "ℹ️ Nenhum cargo novo foi adicionado."
                );

                return;
            }

            console.log(
                "🎖️ Cargos adicionados:",
                addedRoles.map(role => role.name).join(", ")
            );

            // ========================================
            // BUSCA CARGOS PROTEGIDOS
            // ========================================

            const protectedRoles =
                getProtectedRoles(
                    newMember.guild.id
                );

            console.log(
                "🛡️ Cargos protegidos:",
                protectedRoles
            );

            if (!protectedRoles.length) {

                console.log(
                    "⚠️ Nenhum cargo protegido configurado."
                );

                return;
            }

            // ========================================
            // CARGO APROVADOR
            // ========================================

            const approverRole =
                getApproverRole(
                    newMember.guild.id
                );

            // ========================================
            // IGNORA QUEM POSSUI CARGO APROVADOR
            // ========================================

            if (
                approverRole &&
                newMember.roles.cache.has(approverRole)
            ) {

                console.log(
                    "ℹ️ Usuário possui cargo aprovador. Ignorando."
                );

                return;
            }

            // ========================================
            // VERIFICA CARGOS APROVADOS
            // ========================================

            const ignoredRoles = new Set();

            for (const role of addedRoles.values()) {

                const key =
                    `${newMember.id}_${role.id}`;

                if (
                    global.approvedCargo.has(key)
                ) {

                    console.log(
                        `✅ Cargo ${role.name} foi previamente aprovado.`
                    );

                    global.approvedCargo.delete(key);

                    ignoredRoles.add(role.id);
                }
            }

            // ========================================
            // FILTRA CARGOS PROTEGIDOS
            // ========================================

            const blockedRoles =
                addedRoles.filter(
                    role =>
                        protectedRoles.includes(role.id) &&
                        !ignoredRoles.has(role.id)
                );

            if (blockedRoles.size === 0) {

                console.log(
                    "ℹ️ Nenhum dos cargos adicionados está protegido."
                );

                return;
            }

            console.log(
                "🚨 Cargos bloqueados:",
                blockedRoles.map(role => role.name).join(", ")
            );

            // ========================================
            // CANAL DE APROVAÇÃO
            // ========================================

            const channelId =
                getApprovalChannel(
                    newMember.guild.id
                );

            if (!channelId) {

                console.log(
                    "❌ Canal de aprovação não configurado."
                );

                return;
            }

            const channel =
                newMember.guild.channels.cache.get(
                    channelId
                );

            if (!channel) {

                console.log(
                    "❌ Canal de aprovação não encontrado."
                );

                return;
            }

            // ========================================
            // VERIFICA BOT
            // ========================================

            const botMember =
                newMember.guild.members.me;

            if (!botMember) {

                console.log(
                    "❌ Não consegui encontrar o membro do bot."
                );

                return;
            }

            console.log(
                `🤖 Cargo mais alto do bot: ${botMember.roles.highest.name}`
            );

            // ========================================
            // PROCESSA CADA CARGO
            // ========================================

            for (const role of blockedRoles.values()) {

                console.log(
                    `🔐 Processando cargo protegido: ${role.name}`
                );

                // ========================================
                // HIERARQUIA
                // ========================================

                if (
                    role.position >=
                    botMember.roles.highest.position
                ) {

                    console.log(
                        `❌ Bot não consegue remover o cargo ${role.name}.`
                    );

                    console.log(
                        `Cargo: ${role.position} | Bot: ${botMember.roles.highest.position}`
                    );

                    continue;
                }

                // ========================================
                // REMOVE CARGO
                // ========================================

                try {

                    await newMember.roles.remove(
                        role.id,
                        "Cargo protegido aguardando aprovação"
                    );

                    console.log(
                        `✅ Cargo ${role.name} removido de ${newMember.user.tag}`
                    );

                } catch (error) {

                    console.error(
                        `❌ Erro ao remover cargo ${role.name}:`,
                        error
                    );

                    continue;
                }

                // ========================================
                // CRIA PEDIDO
                // ========================================

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

                    `).run(

                        newMember.guild.id,

                        newMember.id,

                        role.id,

                        oldMember.id

                    );

                const requestId =
                    request.lastInsertRowid;

                console.log(
                    `📋 Pedido criado: ${requestId}`
                );

                // ========================================
                // EMBED
                // ========================================

                const embed =
                    new EmbedBuilder()

                        .setTitle(
                            "🛡️ Solicitação de cargo"
                        )

                        .setDescription(
                            `👤 **Usuário:**\n` +
                            `<@${newMember.id}>\n\n` +

                            `🎖️ **Cargo solicitado:**\n` +
                            `<@&${role.id}>\n\n` +

                            `🆔 **Pedido:**\n` +
                            `${requestId}`
                        )

                        .setColor("Orange")

                        .setTimestamp();

                // ========================================
                // BOTÕES
                // ========================================

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

                // ========================================
                // MENÇÃO DO APROVADOR
                // ========================================

                const currentApproverRole =
                    getApproverRole(
                        newMember.guild.id
                    );

                // ========================================
                // ENVIA SOLICITAÇÃO
                // ========================================

                await channel.send({

                    content:
                        currentApproverRole
                            ? `<@&${currentApproverRole}>`
                            : "",

                    embeds: [
                        embed
                    ],

                    components: [
                        buttons
                    ]

                });

                console.log(
                    `📨 Solicitação ${requestId} enviada para #${channel.name}`
                );
            }

            // ========================================
            // FINAL
            // ========================================

            console.log(
                "✅ CargoGuard terminou o processamento."
            );

        } catch (error) {

            console.error(
                "❌ Erro CargoGuard no guildMemberUpdate:",
                error
            );

        }

    }

};