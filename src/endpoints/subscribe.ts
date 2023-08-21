import { Express, Request, Response } from 'express';
import { ValidationError } from 'runtypes';

import { validateSubscribeBody } from './validators/subscribe.ts';
import { addEmail, sendVerificationEmail, subscribe, verifyEmail } from '../providers/mailjet.ts';

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

      if (addEmailResponse.Count !== 1) { // check status code here
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
      res.status(201).send(/*addEmailResponse*/);
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

  // Start unsubscription, needs verification
  app.delete(`${endpointPrefix}`, (req: Request, res: Response) => {
    // Check email exists in db
    
    // Send verification email containing link to unsubscribe

    // Send response
    res.status(200).send();
  });
}