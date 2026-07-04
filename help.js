"use strict";

import {commands} from "./eventHandler.js";
import {createEmbed} from "./embedBuilder.js";

const getHelp = () => ({
	embeds: [
		createEmbed(
			"Aide",
			null,
			"Voici les commandes actuellement reconnues :",
			commands
				.map(command => {return {
					name: command.name,
					value: `\`/${command.name}${command.options ? ` ${command.options[0]}` : ""}\` : `
						+ `${command.description}${command.options ? `\nOptions valides : ${command.options.map(option => `\`${option}\``).join(", ")}.` : ""}`,
				}})
		)
	]
});

export {getHelp};
