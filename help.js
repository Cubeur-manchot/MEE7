"use strict";

import {commands, prefix} from "./eventHandler.js";
import {createEmbed} from "./embedBuilder.js";

const getHelp = () => ({
	embeds: [
		createEmbed(
			"Aide",
			null,
			"Voici les commandes actuellement reconnues :",
			commands
				.map(command => {return {
					name: `${prefix}${command.name}`,
					value: `\`${prefix}${command.name}${command.options ? ` ${command.options[0]}` : ""}\` : `
						+ `${command.description}${command.options ? `\nOptions valides : ${command.options.map(option => `\`${option}\``).join(", ")}.` : ""}`,
				}})
		)
	]
});

export {getHelp};
