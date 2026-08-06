const { AuditLogEvent } = require("discord.js");


async function getRoleAddExecutor(
    guild,
    member,
    roleId
) {


    try {


        const logs =
            await guild.fetchAuditLogs({

                limit: 10,

                type:
                AuditLogEvent.MemberRoleUpdate

            });



        const entries =
            [...logs.entries.values()]
            .sort(
                (a,b) =>
                b.createdTimestamp -
                a.createdTimestamp
            );



        const entry =
            entries.find(log => {


                if(!log.target)
                    return false;



                return (

                    log.target.id === member.id

                    &&

                    log.changes?.some(change =>

                        change.key === "$add"

                        &&

                        change.new?.some(role =>

                            role.id === roleId

                        )

                    )

                );


            });



        if(!entry)
            return null;



        return entry.executor;



    } catch(error){


        console.error(
            "Erro Audit Log:",
            error
        );


        return null;


    }

}



module.exports = {

    getRoleAddExecutor

};