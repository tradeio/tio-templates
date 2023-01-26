import { RequestHandler } from "express";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  console.log(req.params.sampleId);
  res.status(200).json({ message: "server is running" });
};

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  // sample id is available through Id
  console.log(req.params.sampleId);
  res.status(200).json({ message: "server is running" });
};
