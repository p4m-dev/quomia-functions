import { collTimers } from "../config/config";
import { Timer } from "../models/timer";

const retrieveTimers = async () => {
  const timers: Timer[] = [];

  const snapshot = await collTimers.orderBy("createdAt", "desc").get();

  snapshot.forEach((doc) => {
    timers.push({ ...(doc.data() as Timer) });
  });

  return timers;
};

export { retrieveTimers };
