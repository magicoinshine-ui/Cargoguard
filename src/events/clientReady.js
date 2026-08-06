module.exports = {
    name: "clientReady",

    once: true,

    async execute(client) {

        console.log("=================================");
        console.log("✅ CargoGuard iniciado!");
        console.log(`🤖 Logado como ${client.user.tag}`);
        console.log("=================================");

    }
};