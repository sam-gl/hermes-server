import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');
const MailingList = sequelize.define('MailingList', {
  mailing_list_id: DataTypes.UUIDV4,
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  mail_provider_id: DataTypes.UUIDV4,
  last_mail_sent_at: DataTypes.DATE,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
});

export default MailingList;
