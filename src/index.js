import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./apps.js";
dotenv.config({
  path: "./env",
});
connectDB()
  .then(() => {
    app.on((error) => {
      console.log("error occurred in app ", error);
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`process is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("mongo db connection failed", error);
  });
