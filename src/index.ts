//external
import express, { Request, Response } from "express";
import "dotenv/config";

//internal
import { connectDB } from "./db/connectDB";
import { errorHandlerMiddleware, notFoundMiddleware } from "./middlewares";

const app = express();

//middlewares

app.use(express.json());

app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Hello, boss!");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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
