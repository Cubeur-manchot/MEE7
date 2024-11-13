"use strict";

import {loadJsonData} from "./data.js";
import {createRowWithSelectComponents} from "./componentBuilder.js";
import {sendMessageToChannel} from "./messages.js";
import {errorLog} from "./logger.js";

const algOfTheDayFileId = "1RUYN-sqngHdW_SEVG3_BfUoj_M2kKaam";

const numberEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

const algOfTheDayStringSelectCustomId = "algOfTheDayStringSelectCustomId";

const getAlgOfTheDay = async (alg, message, channelScheduled) => {
	if (alg) { // component interaction
		return {
			embeds: null,
			components: buildAlgOfTheDayComponents(message.components[0].components[0].data.options.map(option => option.value), alg),
			textContent: message.content.replace(/(?<=\$alg ).*?(?= -)/, alg)
		}
	} else {
		let channel =
			channelScheduled // scheduled command, no message
			?? message.channel; // command by a user in a channel
		let algset = (await loadJsonData(algOfTheDayFileId))[channel.id];
		if (!algset) {
			return {
				embeds: null,
				components: null,
				textContent: `:x: Erreur : Salon "${channel.name}" invalide.`
			};
		}
		let caseOfTheDay = algset.cases[Math.floor(new Date() / (24*60*60*1000)) % algset.cases.length];
		return {
			embeds: null,
			components: buildAlgOfTheDayComponents(caseOfTheDay.algorithms.map(algorithm => algorithm.algorithm)),
			textContent: `$alg ${caseOfTheDay.algorithms[0].algorithm} -${algset.name}${algset.event.startsWith("3") ? "" : ` -${algset.event[0]}`} // ${algset.name} du jour : ${caseOfTheDay.name}`
		};
	}
};

const buildAlgOfTheDayComponents = (algorithms, selectedAlgorithm) => {
	let selectOptions = algorithms
		.slice(0, 10) // maximum 10 options
		.map((algorithm, index) => ({
			label: algorithm,
			emoji: numberEmojis[index],
			value: algorithm
		}));
	return createRowWithSelectComponents(selectOptions, selectedAlgorithm ?? selectOptions[0].value, algOfTheDayStringSelectCustomId);
};

const scheduleNextAlgOfTheDay = discordClient => {
	let now = new Date();
	let nextMidnight = new Date(now);
	nextMidnight.setHours(24, 0, 0, 0);
	let timeSpanMillisecondsUntilNextExecution = nextMidnight - now;
	setTimeout(
		() => {
			scheduleNextAlgOfTheDay(discordClient);
			triggerAlgOfTheDay(discordClient);
		},
		timeSpanMillisecondsUntilNextExecution
	);
};

const triggerAlgOfTheDay = async discordClient => {
	let channelIds = Object.keys((await loadJsonData(algOfTheDayFileId)).data);
	for (let channelId of channelIds) {
		let channel = await fetchChannel(discordClient, channelId);
		if (!channel) {
			continue;
		}
		sendMessageToChannel(await getAlgOfTheDay(null, null, channel), channel);
	}
};

const fetchChannel = (discordClient, channelId) =>
	discordClient.channels.fetch(channelId)
		.catch(fetchChannelError => errorLog(`Fail to fetch channel with id ${channelId}: ${fetchChannelError}`));

export {algOfTheDayStringSelectCustomId, getAlgOfTheDay, scheduleNextAlgOfTheDay};
