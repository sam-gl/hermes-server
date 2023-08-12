import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');
const Subscriber = sequelize.define('Subscriber', {
  subscriber_id: DataTypes.UUIDV4,
  email: DataTypes.STRING,
  verified: DataTypes.BOOLEAN,
  created_at: DataTypes.DATE,
  verified_at: DataTypes.DATE
});

export default Subscriber;
