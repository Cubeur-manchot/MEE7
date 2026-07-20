"use strict";

import {triggerAlgsOfTheDay} from "../algOfTheDay.js";

const onTick = discordClient => triggerAlgsOfTheDay(discordClient);

export default onTick;
