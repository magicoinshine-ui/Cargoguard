require("dotenv").config();

const { Client, GatewayIntentBits, Collection } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const commandHandler = require("./handlers/commandHandler");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration
    ]
});

// Coleção de comandos
client.commands = new Collection();

// Carrega eventos
eventHandler(client);

// Carrega comandos
commandHandler(client);

// Login
client.login(process.env.TOKEN);