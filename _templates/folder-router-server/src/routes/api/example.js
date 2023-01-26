import { RequestHandler } from "express";

/**
 * @type {RequestHandler}
 */
export const GET = async (req, res) => {
  console.log("here");
  // Errors will be caught by the error handler at src/index.js
  throw new Error("error");
  res.status(200).json({ message: "server is running" });
};

/**
 * @type {RequestHandler}
 */
export const POST = async (req, res) => {
  res.status(200).json({ message: "server is running" });
};

/**
 * @type {RequestHandler}
 */
function exampleMiddleware(req, res, next) {
  console.log("THIS is middleware");
  next();
}

/**
 * @type {import("../../interfaces/types").IEndpointsConfig}
 */
export default {
  middleware: {
    all: [exampleMiddleware],
  },
};
