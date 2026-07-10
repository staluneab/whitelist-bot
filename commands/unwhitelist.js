const { SlashCommandBuilder } = require("discord.js");
const db = require("../database");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unwhitelist")
        .setDescription("Remove a serial from the whitelist")
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

        const [result] = await db.query(
            "DELETE FROM whitelist WHERE serial = ?",
            [serial]
        );

        if (result.affectedRows === 0) {
            return interaction.reply("❌ Serial not found.");
        }

        interaction.reply(`✅ Removed **${serial}** from the whitelist.`);
    }
};