import { Express, Request, Response } from "express";

export default (app: Express) => {
  app.get("/manage", (req: Request, res: Response) => {
    res.render("hello");
  });

  app.get("/manage/subscriptions", (req: Request, res: Response) => {
    res.render("subscriptions");
  });

  app.get("/manage/verify", (req: Request, res: Response) => {
    res.render("verify");
  });
};
