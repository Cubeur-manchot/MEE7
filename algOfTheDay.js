"use strict";

import {loadJsonData} from "./data.js";
import createRowWithSelectComponents from "./discordBuilders/componentBuilder.js";
import logger from "./logger.js";

const algOfTheDayFileId = process.env.ALGOFTHEDAY_FILE_ID;

const numberEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

const algOfTheDayStringSelectCustomIdPrefix = "algOfTheDay";

const algOfTheDayStringSelectCustomId = `${algOfTheDayStringSelectCustomIdPrefix}${process.env.STRINGSELECT_SUFFIX}`;

const triggerAlgsOfTheDay = async discordClient => {
	const algOfTheDayData = await loadJsonData(algOfTheDayFileId);
	for (const [channelId, algSet] of Object.entries(algOfTheDayData)) {
		const channel = await fetchChannel(discordClient, channelId);
		if (!channel) {
			logger.error(`Cannot send alg of the day for channel with id ${channelId}`);
			continue;
		}
		const algOfTheDayMessage = await getNewAlgOfTheDay(algSet);
		await sendMessageToChannel(algOfTheDayMessage, channel);
		logger.info(`Alg of the day successfully sent for set "${channel.name}" (channel id = "${channelId}").`);
	}
};

const getNewAlgOfTheDay = algSet => { // used to add the new alg on scheduled tick
	const caseCount = algSet.cases.length;
	// dates are local
	const now = new Date();
	const epoch = new Date("1970-01-01 00:00:00");
	const daysCount = Math.floor((now - epoch) / (24*60*60*1000));
	const caseIndex = daysCount % caseCount;
	const caseOfTheDay = algSet.cases[caseIndex];
	const defaultAlgorithm = getAlg(caseOfTheDay.algorithms[0]);
	const eventOption = algSet.event.startsWith("3") ? "" : ` -${algSet.event[0]}`;
	return {
		embeds: null,
		components: buildAlgOfTheDayComponents(caseOfTheDay.algorithms.map(getAlg)),
		textContent: `$alg ${defaultAlgorithm} -${algSet.mask ?? algSet.name}${eventOption} // ${algSet.name} du jour (${caseIndex + 1}/${caseCount}) : ${caseOfTheDay.name}`
	};
};

const getUpdatedAlgOfTheDay = (alg, message) => ({ // used to update the alg on string select interaction
	embeds: null,
	components: buildAlgOfTheDayComponents(message.components[0].components[0].data.options.map(option => option.value), alg),
	textContent: message.content.replace(/(?<=\$alg ).*?(?= -)/, alg)
});

const getAlg = alg =>
	alg.algorithm // return .algorithm if object
	?? alg; // otherwise assume it is just a string
 
const buildAlgOfTheDayComponents = (algorithms, selectedAlgorithm) => {
	const selectOptions = algorithms
		.slice(0, 10) // maximum 10 options
		.map((algorithm, index) => ({
			label: algorithm,
			emoji: numberEmojis[index],
			value: algorithm
		}));
	return createRowWithSelectComponents(selectOptions, selectedAlgorithm ?? selectOptions[0].value, algOfTheDayStringSelectCustomId);
};

const fetchChannel = async (discordClient, channelId) => {
	try {
		logger.info(`Fetching channel with id ${channelId}`);
		const channel = await discordClient.channels.fetch(channelId);
		logger.info(`Channel with id ${channelId} has been fetched successfully.`);
		return channel;
	} catch (fetchChannelError) {
		logger.error(`Error while fetching channel with id ${channelId}: ${fetchChannelError.stack}`);
		return null;
	}
};

const sendMessageToChannel = async (message, channel) => {
	try {
		await channel.send({
			content: message.textContent,
			embeds: message.embeds,
			components: message.components
		});
	} catch (sendMessageError) {
		logger.error(`Fail to send message in channel with id ${channel.id} : ${sendMessageError.stack}`);
	}
};

export {algOfTheDayStringSelectCustomId, triggerAlgsOfTheDay, getUpdatedAlgOfTheDay};
