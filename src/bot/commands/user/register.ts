import { EmbedBuilder } from "discord.js";
import log from "../../../structs/log";
const Users = require('../../../model/user');

export { }

const { SlashCommandBuilder } = require('discord.js');
const functions = require('../../../structs/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Creates an account for you')
		.addStringOption(option =>
			option.setName('username')
				.setDescription('The username you want to use')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('email')
				.setDescription('The email you want to use')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('password')
				.setDescription('The password you want to use')
				.setRequired(true)),


	async execute(interaction) {

		const discordId = interaction.user.id;
		const username = interaction.options.getString('username');
		const email = interaction.options.getString('email');
		const plainPassword = interaction.options.getString('password');

		const user = await Users.findOne({ discordId: interaction.user.id });
        if (user) return interaction.reply({ content: "You are already registered!", ephemeral: true });

		await functions.registerUser(discordId, username, email, plainPassword).then(async (res) => {
			const publicembed = new EmbedBuilder()
				.setTitle("Thank you!")
				.setDescription("Thank you for registering at Momentum! As a reward you have been granted 500 vBucks you can use in the shop.")
				.addFields(
					{
						name: "Username",
						value: username,
					},
					{
						name: "Email",
						value: email,
					},
				)
				.setColor("#2b2d31")
				.setFooter({
					text: "Momentum",
					iconURL: "https://cdn.discordapp.com/app-assets/432980957394370572/1084188429077725287.png",
				})
				.setTimestamp();


			const embed = new EmbedBuilder()
				.setTitle("Account created")
				.setDescription("Your account has been successfully created")
				.addFields(
					{
						name: "Username",
						value: username,
					},
					{
						name: "Email",
						value: email,
					},
				)
				.setColor("#2b2d31")
				.setFooter({
					text: "Momentum",
					iconURL: "https://cdn.discordapp.com/app-assets/432980957394370572/1084188429077725287.png",
				})
				.setTimestamp();

				await interaction.reply({ content: res.message, ephemeral: true });

				const publicEmbed = new EmbedBuilder()
					.setTitle("New registration")
					.setDescription("A new user has registered")
					.addFields(
						{
							name: "Username",
							value: username,
						}
					)
					.setColor("#2b2d31")
					.setFooter({
						text: "Momentum",
						iconURL: "https://cdn.discordapp.com/app-assets/432980957394370572/1084188429077725287.png",
					})
					.setTimestamp();

				await interaction.channel.send({ embeds: [publicEmbed] });
		}).catch((err) => {
			log.error(err);
		});
	},
};