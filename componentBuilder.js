"use strict";

import Discord from "discord.js";

const createRowWithSelectComponents = (selectOptions, selectedOption, customId) => {
	selectOptions.forEach(selectOption => selectOption.default = selectOption.value === selectedOption);
	return [new Discord.ActionRowBuilder()
		.setComponents([
			new Discord.StringSelectMenuBuilder()
				.setOptions(selectOptions)
				.setCustomId(customId)
		])
	];
};

export {createRowWithSelectComponents};
