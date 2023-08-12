import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');
const Subscription = sequelize.define('Subscription', {
  subscription_id: DataTypes.UUIDV4,
  subscriber_id: DataTypes.UUIDV4,
  mailing_list_id: DataTypes.UUIDV4,
  active: DataTypes.BOOLEAN,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
});

export default Subscription;




/*
  person subscribes to ->
  subscription which is linked to a ->
  mailing list which defines a name, description, mail provider, last message sent ts, last person added ts and is linked to a ->
  provider which defines a name, and details of how to use the provider's api
*/