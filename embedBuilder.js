"use strict";

import Discord from "discord.js";

const createEmbed = (title, titleUrl, description, fields) => {
	return new Discord.EmbedBuilder()
		.setColor(0xffbf00)
		.setTitle(title)
		.setURL(titleUrl)
		.setDescription(description)
		.addFields(...fields)
		.setTimestamp();
};

export {createEmbed};
