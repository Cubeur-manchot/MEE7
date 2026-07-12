"use strict";

import {triggerAlgsOfTheDay} from "../algOfTheDay.js";

const onTick = () => triggerAlgsOfTheDay();

export default onTick;
