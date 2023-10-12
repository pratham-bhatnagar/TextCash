import * as MongoDB from "mongodb";
import { errors } from "../errors/error.constants";
import logger from "./logger.service";

export class DatabaseService {
  private static instance: DatabaseService;
  private dbClient: MongoDB.MongoClient = new MongoDB.MongoClient(
    process.env.MONGO_URI!
  );
  private constructor() {}

  public initialize = async (): Promise<void> => {
    try {
      await this.dbClient.connect();
      logger.info("Connected to MongoDB");
    } catch (err) {
      logger.error("Could not connect to MongoDB\n%o", err);
      throw errors.MONGODB_CONNECTION_ERROR;
    }
  };

  public static getInstance = (): DatabaseService => {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  };

  public getDb = async (
    collection: string,
    database?: string
  ): Promise<MongoDB.Collection> => {
    if (!process.env.MONGO_DB) {
      process.env.MONGO_DB = "test";
    }
    return this.dbClient
      .db(`${database ?? process.env.MONGO_DB}`)
      .collection(collection);
  };
}
