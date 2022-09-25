import { eventsTypes } from "./types";
export const addEvents = event => ({
  type: eventsTypes.CREATE_EVENT_SUCCESSFUL,
  event,
});
