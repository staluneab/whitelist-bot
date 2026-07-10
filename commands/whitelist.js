const { SlashCommandBuilder } = require("discord.js");
const db = require("../database");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("whitelist")
        .setDescription("Whitelist a player serial")
        .addStringOption(option =>
            option
                .setName("serial")
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

        if (serial.length !== 32) {
            return interaction.reply({
                content: "❌ Invalid serial.",
                ephemeral: true
            });
        }

        const [rows] = await db.query(
            "SELECT * FROM whitelist WHERE serial = ?",
            [serial]
        );

        if (rows.length) {
            return interaction.reply({
                content: "⚠️ This serial is already whitelisted.",
                ephemeral: true
            });
        }

        await db.query(
            "INSERT INTO whitelist (serial, added_by) VALUES (?, ?)",
            [serial, interaction.user.tag]
        );

        interaction.reply(`✅ **${serial}** has been whitelisted.`);
    }
};