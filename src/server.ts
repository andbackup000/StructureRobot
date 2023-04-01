import "express-async-errors";
import "reflect-metadata";
import "dotenv";
import "./shared/container"
import express, { Router, NextFunction, Request, Response } from "express"
import { AppError } from "./errors/AppError";
import { routes } from  "./routes"
import  pullBack  from "./scripts/kucoinStrategy"

const PORT = 4003;
const HOST = '0.0.0.0';

const app = express();

app.use(express.json());
app.use(routes);

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          status: "error",
          message: err.message,
        });
      }
  
      return response.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`,
      });
    }
  );

pullBack.pullBack()

app.listen(PORT, HOST,  () => console.log("Server is running on PORT 4003"));