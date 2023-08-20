import { Express, Request, Response } from 'express';
import { ValidationError } from 'runtypes';

import Subscriber from '../models/Subscriber.ts';
import { validateSubscribeBody } from './validators/subscribe.ts';
import { addEmail, sendVerificationEmail } from '../providers/mailjet.ts';

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

      if (addEmailResponse.Count !== 1) {
        console.error(`Error adding email to provider: ${req.body.email}`);
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
  app.get(`${endpointPrefix}/verify`, (req: Request, res: Response) => {
    const verificationCode = req.query.code;

    // Lookup email and check verification code is correct

    // Make request to email provider to verify email

    // Update local db

    // Send response
    res.status(200).send();
  });

  // Start unsubscription, needs verification
  app.delete(`${endpointPrefix}`, (req: Request, res: Response) => {
    // Check email exists in db
    
    // Send verification email containing link to unsubscribe

    // Send response
    res.status(200).send();
  });
}