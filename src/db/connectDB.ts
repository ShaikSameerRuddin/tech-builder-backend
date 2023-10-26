import mongoose, { ConnectOptions } from "mongoose";

const connectDB = (url: string): Promise<typeof mongoose> => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
};

export { connectDB };
