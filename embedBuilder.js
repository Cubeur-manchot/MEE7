"use strict";

import Discord from "discord.js";

const createEmbed = (title, titleUrl, fields) => {
	return new Discord.EmbedBuilder()
		.setColor(0xffbf00)
		.setTitle(title)
		.setURL(titleUrl)
		.addFields(...fields)
		.setTimestamp();
};

export {createEmbed};
