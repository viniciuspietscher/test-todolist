import mongoose from "mongoose"

const connectMongo = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable inside .env.local")
  }
  const MONGODB_URI: string = process.env.MONGO_URI

  mongoose.connect(MONGODB_URI)
}

export default connectMongo
