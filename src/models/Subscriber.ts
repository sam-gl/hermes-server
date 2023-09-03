import { Sequelize, DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "node:crypto";

const subscriberModel = (sequelize: Sequelize) => {
  const Subscriber = sequelize.define("Subscriber", {
    subscriberID: {
      type: DataTypes.UUIDV4,
      defaultValue: uuidv4(),
      unique: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    verificationCode: {
      type: DataTypes.STRING,
      defaultValue: randomBytes(32).toString("hex"), // async this
      unique: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verifiedAt: DataTypes.DATE
  });

  return Subscriber;
};

export default subscriberModel;
