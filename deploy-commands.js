const { REST, Routes } = require("discord.js");
const config = require("./config.json");

const commands = [
    {
        name: "whitelist",
        description: "Whitelist a player serial",
        options: [
            {
                name: "serial",
                description: "Player serial",
                type: 3,
                required: true
            }
        ]
    },
    {
        name: "unwhitelist",
        description: "Remove a player from whitelist",
        options: [
            {
                name: "serial",
                description: "Player serial",
                type: 3,
                required: true
            }
        ]
    },
    {
        name: "check",
        description: "Check if a serial is whitelisted",
        options: [
            {
                name: "serial",
                description: "Player serial",
                type: 3,
                required: true
            }
        ]
    }
];

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
    try {
        console.log("Registering slash commands...");

        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands }
        );

        console.log("Slash commands registered successfully.");
    } catch (error) {
        console.error(error);
    }
})();