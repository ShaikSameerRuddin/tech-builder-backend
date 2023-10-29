//external
import express from "express";
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';


import 'express-async-errors'
import "dotenv/config";

//internal
import { connectDB } from "./src/db/connectDB";
import { errorHandlerMiddleware, notFoundMiddleware } from "./src/middlewares";
import { routes } from "./src/app/routes/routes";
import bodyParser from "body-parser";

const app = express();

// Define CORS options
const corsOptions = {
  origin: ['http://localhost:4000'], // Set the allowed origin
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Use the cors middleware with the specified options

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors(corsOptions));

app.use(mongoSanitize());


//middlewares
routes(app, express)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);


//server start
const startServer = async (): Promise<void> => {
  const port = process.env.PORT || "5000";
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in environment variables");
    }
    await connectDB(process.env.MONGO_URI);
    console.log(`Connected to MongoDB`);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
