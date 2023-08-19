import { Sequelize, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'node:crypto';


const sequelize = new Sequelize('sqlite::memory:');
const Subscriber = sequelize.define('Subscriber', {
  subscriber_id: {
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
  verification_code: {
    type: DataTypes.STRING,
    defaultValue: randomBytes(32).toString('hex'), // async this
    unique: true
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: new Date(Date.now()),
    
  },
  verified_at: DataTypes.DATE
});

export default Subscriber;
