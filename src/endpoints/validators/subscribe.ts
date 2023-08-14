import { Literal, Record, String } from "runtypes";

const SubscribeBody = Record({
  email: String
});

const validateSubscribeBody = (subscribeBody: object) => SubscribeBody.check(subscribeBody);

export { validateSubscribeBody };