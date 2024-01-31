import express, { Express } from "express";
import { createServer } from "node:http";
import path from "node:path";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import FileStore from "session-file-store";
import cookieParser from "cookie-parser";
import DatabaseManager from "./db";
import airdropRoute from "./routes/airdrop.route";
import authRoute from "./routes/auth.route";
import nftRoute from "./routes/nft.route";
import apiKey from "./middlewares/apiKey.middleware";

/** @dev Bootstrap and config*/
dotenv.config({
  path: path.resolve(__dirname, "../.env.development"),
});

const app: Express = express();
const FileStoreInstance = FileStore(session);
const server = createServer(app);
const PORT = process.env.PORT || "8888";

/** @dev Register middlewares */
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: [
      "Access-Control-Allow-Credentials",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: new FileStoreInstance(),
    secret: process.env.COOKIE_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86_400 * 1000, // 1 day in millseconds
      sameSite: "lax",
    },
  })
);
app.use(apiKey);

/** @dev Register routes */
app.use("/api/airdrop", airdropRoute);
app.use("/api/auth", authRoute);
app.use("/api/nft", nftRoute);

/** @dev Logic to handle shutting server & mongo connection */
const dbManager = DatabaseManager.getInstance();

const shutdown = async () => {
  console.log(
    `[app@shutdown]: Server is shutting down on http://localhost:${PORT}`
  );

  try {
    await dbManager.disconnect();
    console.log("[app@shutdown]: Succesfully closed Mongo connection");
    server.close((err?: Error) => {
      if (err) {
        console.log(
          "[app@shutdown]: Error closing Express application:",
          err.message
        );
        process.exit(1);
      }
      console.log("[app@shutdown]: Succesfully closed Express application");
    });
    process.exit(0);
  } catch (err) {
    console.error(
      "[app@shutdown]: Error closing Mongo:",
      (err as Error).message
    );
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/** @dev Logic to handle opening server & mongo connection */
server.listen(PORT, async () => {
  try {
    await dbManager.connect(
      process.env.MONGO_URI ?? "mongodb://mongodb:27017/nft-airdrop"
    );
    console.log(`Server is running at http://localhost:${PORT}`);
  } catch (err) {
    if (err instanceof Error) {
      console.error("[app@server.listen]:", err.message);
      process.exit(1);
    }
  }
});

export default app;
