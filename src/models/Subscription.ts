import { Sequelize, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

const subscriptionModel = (sequelize: Sequelize) => {
  const Subscription = sequelize.define('Subscription', {
    subscriptionID: {
      type: DataTypes.UUIDV4,
      defaultValue: uuidv4(),
      unique: true,
      primaryKey: true
    },
    subscriberID: DataTypes.UUIDV4,
    mailingListID: {
      // The ID of the mailing list/contact list generated remotely by the email provider.
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Subscription;
}


export default subscriptionModel;
