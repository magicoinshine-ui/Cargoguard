require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const eventHandler = require("./handlers/eventHandler");
const commandHandler = require("./handlers/commandHandler");

// ========================================
// SERVIDOR HTTP (RENDER)
// ========================================

const app = express();

app.get("/", (req, res) => {
    res.send("CargoGuard online!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🌐 Servidor HTTP ativo na porta ${PORT}`);
});

// ========================================
// CLIENT DISCORD
// ========================================

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