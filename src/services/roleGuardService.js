const {
    createRequest
} = require("../repositories/requestRepository");


const {
    getRoleAddExecutor
} = require("./auditService");



async function handleProtectedRole(
    oldMember,
    newMember,
    role
) {

    const guild = newMember.guild;


    const executor =
        await getRoleAddExecutor(
            guild,
            newMember,
            role.id
        );


    // Remove imediatamente
    await newMember.roles.remove(
        role.id,
        "Cargo protegido pelo CargoGuard"
    );



    await createRequest({

        guildId:
            guild.id,

        userId:
            newMember.id,

        roleId:
            role.id,

        executorId:
            executor?.id || null,

        status:
            "pending"

    });



    return {
        executor
    };

}



async function detectBypass(
    member,
    role
) {


    await member.roles.remove(
        role.id,
        "Tentativa de bypass detectada"
    );


    return true;

}



module.exports = {

    handleProtectedRole,

    detectBypass

};