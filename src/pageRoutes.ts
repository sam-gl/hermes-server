import { Express, Request, Response } from "express";

const { ERROR_CONTACT_MAIL } = process.env;

export default (app: Express) => {
  app.get("/manage", (req: Request, res: Response) => {
    res.render("manage", {
      subscriptionID: req.query.id,
      error: req.query.error,
      errorContactEmail: ERROR_CONTACT_MAIL
    });
  });

  app.get("/manage/subscriptions", (req: Request, res: Response) => {
    res.render("subscriptions");
  });

  app.get("/manage/verify", (req: Request, res: Response) => {
    res.render("verify");
  });
};
