import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("sqlite::memory:");
const MailingList = sequelize.define("MailingList", {
  mailingListID: DataTypes.UUIDV4,
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  mailProviderID: DataTypes.UUIDV4,
  lastMailSentAt: DataTypes.DATE
});

export default MailingList;
