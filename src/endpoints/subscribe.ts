import { Express, Request, Response } from 'express';

import { validateSubscribeBody } from './validators/subscribe.ts';

export default (app: Express) => {
  const endpointPrefix = "/subscribe";

  // All endpoints here: more heavily rate limited


  // Create a new subscription
  app.post(`${endpointPrefix}`, (req: Request, res: Response) => {
    try {
      const subscribeBody = validateSubscribeBody(req.body);
      console.log("SB", subscribeBody);

      // Make request(s) to email provider


      // Save email in local db

      // Send response
      res.status(201).send();
    } catch(e) {
      console.error(e);
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

  // Verify unsubscription (from link in their inbox, so must be a GET)
  app.get(`${endpointPrefix}/verify`, (req: Request, res: Response) => {
    const verificationCode = req.query.code;

    // Lookup email and check verification code is correct

    // Make request to email provider to remove email

    // Remove email from local db

    // Send response
    res.status(200).send();
  });
}