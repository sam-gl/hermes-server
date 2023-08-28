import { Express, Request, Response } from 'express';
import { ValidationError } from 'runtypes';

import { validateSubscribeBody } from './validators/subscribe.ts';
import { addEmail, sendVerificationEmail, subscribe, verifyEmail, unsubscribe, removeUser } from '../providers/mailjet.ts';

import { Subscriber, Subscription } from '../models/index.ts';

const { MAILING_LIST_ID } = process.env;

export default (app: Express) => {
  const endpointPrefix = "/subscribe";
  // All endpoints here: more heavily rate limited

  // Create a new subscription
  app.post(`${endpointPrefix}`, async (req: Request, res: Response) => {
    try {
      const subscribeBody = validateSubscribeBody(req.body);
      console.log("SB", subscribeBody);

      // Add subscriber to email provider
      const addEmailResponse = await addEmail(req.body.email);
      console.log("addEmailResponse:", addEmailResponse);

      if (addEmailResponse.Count !== 1) { // TODO: check status code here
        // check if user has already subscribed
        // otherwise: 
        console.error(`Error adding email to provider: ${req.body.email}`);
        console.error(`Response from email provider: `, addEmailResponse);
        res.status(500).send();
      }
      
      // Save email in local db and generate verification link
      const newSubscriber = await Subscriber.create({
        email: req.body.email
      });
      console.log("newSubscriber: ", newSubscriber);

      // Send verification email
      const verificationResponse = await sendVerificationEmail(req.body.email, newSubscriber.dataValues.verificationCode);
      console.log("verificationResponse: ", verificationResponse);

      // Send response
      res.status(201).send();
    } catch(e) {
      console.error(e);

      if(e instanceof ValidationError) {
        res.status(400).send();
      }

      res.status(500).send();
    }
  });

  // Verify subscription from link in their inbox
  app.get(`${endpointPrefix}/verify`, async (req: Request, res: Response) => {
    try {
      const verificationCode = req.query.code;

      // Lookup email and check verification code is correct
      const subscriber = await Subscriber.findOne({
        where: { verificationCode }
      });

      if(!subscriber) {
        // No subscriber found with that verification code
        res.status(404).send();
      }

      console.log(subscriber);

      // Make request to email provider to verify email
      const verifyEmailResponse = await verifyEmail(subscriber?.dataValues.email);
      console.log("Verify Email Response: ", verifyEmailResponse);

      // Subscribe email to the specified mailing list
      const subscribeEmailResponse = await subscribe(
        MAILING_LIST_ID as string,
        subscriber?.dataValues.email
      );
      console.log("subscribeEmailResponse: ", subscribeEmailResponse);

      // Update local db
      const updatedSubscriber = await Subscriber.update(
        {
          verified: true,
          verifiedAt: new Date(Date.now())
        },
        {
          where: { subscriberID: subscriber?.dataValues.subscriberID }
        }
      );

      const subscription = await Subscription.create({
        subscriberID: subscriber?.dataValues.subscriberID,
        mailingListID: MAILING_LIST_ID,
        active: true
      });
      console.log("subscription: ", subscription);

      // Send response
      res.status(200).send("Done");
    } catch(e) {
      console.error("Some other error: ", e);
      res.status(500).send();
    }
  });

  // Unsub from the subscription passed in and if there are no more 
  // subscriptions after this unsub, then also delete the 
  // user/contact from the provider completely.
  app.delete(`${endpointPrefix}`, async (req: Request, res: Response) => {
    try {
      const subscriptionID = req.query.subscriptionID as string;

      if(!subscriptionID) {
        res.status(500).send();
        return;
      }

      // Check subscription and email exists in db
      const subscription = await Subscription.findByPk(subscriptionID);
      const subscriber = await Subscriber.findByPk(subscription?.dataValues.subscriberID);
      console.log("Subscription: ", subscription);
      console.log("Subscriber: ", subscriber);

      if(!subscription || !subscriber) {
        res.status(500).send();
        return;
      }

      // Make request to email provider to unsubscribe user
      const unsubscribeResponse = await unsubscribe(
        subscription?.dataValues.mailingListID,
        subscriber?.dataValues.email
      );
      console.log("unsubscribeResponse: ", unsubscribeResponse);

      // Remove row relating to subscription from db
      const removedSubscription = await Subscription.destroy({
        where: {
          subscriptionID
        }
      });
      console.log("removedSubscription: ", removedSubscription);

      // Check if user has any other subscriptions
      const remainingSubscriptionCount = await Subscription.count({
        where: {
          subscriberID: subscription?.dataValues.subscriberID
        }
      });
      console.log("remainingSubscriptionCount: ", remainingSubscriptionCount);
      
      // No remaining subscriptions after unsubbing - remove the subscriber completely
      if(remainingSubscriptionCount === 0) {
        console.log("No more subs! Removing user completely...");

        const deletedSubscriberResponse = await removeUser(subscriber?.dataValues.email)
        console.log("deletedSubscriberResponse: ", deletedSubscriberResponse);

        const deletedSubscriber = await Subscriber.destroy({
          where: {
            subscriberID: subscriber?.dataValues.subscriberID
          }
        });
        console.log("deletedSubscriber: ", deletedSubscriber);
      }

      // Send response
      res.status(200).send();
    } catch(e) {
      console.error("Some other error: ", e);
      res.status(500).send();
    }
  });
}