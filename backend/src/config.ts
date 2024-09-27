import { createClient } from 'redis';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Redis Client
export const redisClient = createClient({
  url: `redis://default:MmQ4B0nIGQZFAzBYcIWCuYrnSGxOy04t@redis-10237.c212.ap-south-1-1.ec2.redns.redis-cloud.com:10237`, //sunil
  // url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com:${process.env.REDIS_PORT}`,//kazam

});

redisClient.connect().catch(console.error);

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
