import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');
const MailProvider = sequelize.define('MailProvider', {
  mailProviderID: DataTypes.UUIDV4,
  name: DataTypes.STRING,
  addSubscriberEndpoint: DataTypes.STRING,
  removeSubscriberEndpoint: DataTypes.STRING
});

export default MailProvider;
