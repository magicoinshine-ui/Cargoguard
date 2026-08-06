const db = require("../database/database");


// ===========================
// CRIAR PEDIDO
// ===========================

function createRequest(data) {

    const result = db.prepare(`
        INSERT INTO requests
        (
            guild_id,
            user_id,
            role_id,
            executor_id,
            status
        )

        VALUES (?, ?, ?, ?, ?)

    `)
    .run(

        data.guildId,

        data.userId,

        data.roleId,

        data.executorId,

        data.status || "PENDING"

    );


    return result.lastInsertRowid;

}



// ===========================
// BUSCAR PEDIDO
// ===========================

function getRequest(id) {

    return db.prepare(`
        SELECT *
        FROM requests
        WHERE id = ?
    `)
    .get(id);

}



// compatibilidade

function getRequestById(id) {

    return getRequest(id);

}



// ===========================
// ATUALIZAR PEDIDO
// ===========================

function updateRequest(id, status, moderatorId = null) {


    if(status === "APPROVED") {


        db.prepare(`
            UPDATE requests

            SET 
            status = ?,
            approved_by = ?

            WHERE id = ?

        `)
        .run(
            status,
            moderatorId,
            id
        );


    } else {


        db.prepare(`
            UPDATE requests

            SET
            status = ?,
            denied_by = ?

            WHERE id = ?

        `)
        .run(
            status,
            moderatorId,
            id
        );


    }

}



// compatibilidade

function updateRequestStatus(
    id,
    status,
    moderatorId
){

    updateRequest(
        id,
        status,
        moderatorId
    );

}



// ===========================
// EXPORT
// ===========================

module.exports = {


    createRequest,

    getRequest,

    getRequestById,


    updateRequest,

    updateRequestStatus


};