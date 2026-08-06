require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const eventHandler = require("./handlers/eventHandler");
const commandHandler = require("./handlers/commandHandler");


// ===============================
// SERVIDOR HTTP PARA O RENDER
// ===============================

const app = express();

app.get("/", (req, res) => {
    res.send("CargoGuard online!");
});


app.listen(3000, () => {
    console.log("🌐 Servidor HTTP ativo na porta 3000");
});


// ===============================
// DISCORD BOT
// ===============================

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