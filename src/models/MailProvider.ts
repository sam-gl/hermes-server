import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');
const MailProvider = sequelize.define('MailProvider', {
  mail_provider_id: DataTypes.UUIDV4,
  name: DataTypes.STRING,
  add_subscriber_endpoint: DataTypes.STRING,
  remove_subscriber_endpoint: DataTypes.STRING,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
});

export default MailProvider;
