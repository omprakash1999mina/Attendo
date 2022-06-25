import Redis from "ioredis"
import { REDIS_URL } from "../config";

// let redis;

const RedisService = {
  createRedisClient() {
    const redis = new Redis(REDIS_URL);
    return redis;
  }
}

export default RedisService;
