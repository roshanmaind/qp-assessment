import { Request, Response, RequestHandler } from "express";
import logger from "../setup/logging";

export default function makeExpressCallback(func: any): RequestHandler {
  return (req: Request, res: Response) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      method: req.method,
      path: req.path,
      headers: {
        "Content-Type": req.get("Content-Type"),
        Referer: req.get("referer"),
        "User-Agent": req.get("User-Agent"),
      },
    };

    func(httpRequest)
      .then((httpResponse: any) => {
        if (httpResponse.headers) {
          res.set(httpResponse.headers);
        }
        res.type("json");
        res.status(httpResponse.statusCode || 200).send(httpResponse.body);
      })
      .catch((err: any) => {
        console.error(err);
        res.status(500).send({ error: "An unkown error occurred." });
      });
  };
}
