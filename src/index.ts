import Express, { Application, Request, Response, NextFunction } from "express";
import { DatabaseService } from "./services/database.service";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import logger from "./services/logger.service";
import errorHandler from "./errors/error.handler";
import AuthRoutes from "./auth/auth.routes";

config();

const app: Application = Express();
app.use(Express.json());
app.use(cors());
app.set("trust proxy", true);
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.debug(message),
    },
  })
);

app.use("/api/v1/auth", AuthRoutes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(405).json({
    success: false,
    message: "Method Not Allowed!",
  });
});

app.use(errorHandler());

Promise.all([DatabaseService.getInstance().initialize()])
  .then(() => {
    app.listen(process.env.PORT!, () => {
      logger.info(`Server running on Port: ${process.env.PORT}`);
    });
  })
  .catch((_) => {
    process.exit(1);
  });
process.on("SIGHUP", (_) => {
  process.exit(0);
});
process.on("SIGINT", (_) => {
  process.exit(0);
});
