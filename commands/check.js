const { SlashCommandBuilder } = require("discord.js");
const db = require("../database");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("check")
        .setDescription("Check if a serial is whitelisted")
        .addStringOption(option =>
            option.setName("serial")
                .setDescription("Player serial")
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config.staffRole)) {
            return interaction.reply({
                content: "❌ You don't have permission.",
                ephemeral: true
            });
        }

        const serial = interaction.options.getString("serial");

        const [rows] = await db.query(
            "SELECT * FROM whitelist WHERE serial = ?",
            [serial]
        );

        if (rows.length === 0) {
            return interaction.reply("❌ This serial is NOT whitelisted.");
        }

        interaction.reply(
            `✅ This serial is whitelisted.\nAdded by: **${rows[0].added_by}**`
        );
    }
};
