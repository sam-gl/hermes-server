import { resolve } from "node:path";
import { Sequelize } from "sequelize";

import subscriptionModel from "./Subscription.ts";
import subscriberModel from "./Subscriber.ts";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: resolve(process.env.DB_FILE as string)
});

const Subscription = subscriptionModel(sequelize);
const Subscriber = subscriberModel(sequelize);

// Subscriber.hasMany(Subscription, {
//   foreignKey: 'subscriptionID'
// });

// Subscription.hasOne(Subscriber, {
//   foreignKey: 'subscriberID'
// });

const initDatabase = async () => {
  return sequelize.sync();
};

export { initDatabase, Subscription, Subscriber };
