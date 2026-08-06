const db = require("../database/database.js");


// ===========================
// CARGOS PROTEGIDOS
// ===========================

function saveProtectedRoles(guildId, roles) {

    db.prepare(
        "DELETE FROM protected_roles WHERE guild_id = ?"
    )
    .run(guildId);


    const stmt = db.prepare(
        "INSERT INTO protected_roles (guild_id, role_id) VALUES (?, ?)"
    );


    for (const role of roles) {

        stmt.run(
            guildId,
            role
        );

    }

}



function getProtectedRoles(guildId) {

    return db.prepare(
        "SELECT role_id FROM protected_roles WHERE guild_id = ?"
    )
    .all(guildId)
    .map(r => r.role_id);

}




// ===========================
// CARGO APROVADOR
// ===========================

function saveApproverRole(guildId, roleId) {

    db.prepare(`

        INSERT INTO guild_config

        (
            guild_id,
            approver_role
        )

        VALUES (?, ?)

        ON CONFLICT(guild_id)

        DO UPDATE SET

        approver_role = excluded.approver_role

    `)
    .run(
        guildId,
        roleId
    );

}



function getApproverRole(guildId) {

    const row =
        db.prepare(
            "SELECT approver_role FROM guild_config WHERE guild_id = ?"
        )
        .get(guildId);


    return row?.approver_role || null;

}





// ===========================
// CANAL APROVAÇÃO
// ===========================

function saveApprovalChannel(guildId, channelId) {

    db.prepare(`

        INSERT INTO guild_config

        (
            guild_id,
            approval_channel
        )

        VALUES (?, ?)

        ON CONFLICT(guild_id)

        DO UPDATE SET

        approval_channel = excluded.approval_channel

    `)
    .run(
        guildId,
        channelId
    );

}



function getApprovalChannel(guildId) {

    const row =
        db.prepare(
            "SELECT approval_channel FROM guild_config WHERE guild_id = ?"
        )
        .get(guildId);


    return row?.approval_channel || null;

}





// ===========================
// CANAL LOGS
// ===========================

function saveLogChannel(guildId, channelId) {

    db.prepare(`

        INSERT INTO guild_config

        (
            guild_id,
            log_channel
        )

        VALUES (?, ?)

        ON CONFLICT(guild_id)

        DO UPDATE SET

        log_channel = excluded.log_channel

    `)
    .run(
        guildId,
        channelId
    );

}




function getLogChannel(guildId) {

    const row =
        db.prepare(
            "SELECT log_channel FROM guild_config WHERE guild_id = ?"
        )
        .get(guildId);


    return row?.log_channel || null;

}





// ===========================
// CONFIG COMPLETA
// ===========================

function getConfig(guildId) {

    return {

        protected_roles:
            getProtectedRoles(guildId),


        approval_channel:
            getApprovalChannel(guildId),


        log_channel:
            getLogChannel(guildId),


        approver_role:
            getApproverRole(guildId)

    };

}





module.exports = {

    saveProtectedRoles,
    getProtectedRoles,

    saveApproverRole,
    getApproverRole,

    saveApprovalChannel,
    getApprovalChannel,

    saveLogChannel,
    getLogChannel,

    getConfig

};