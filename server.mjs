import dotenv from "dotenv";
import app from "./app.mjs";
import { testConnection } from "./dbConnection.mjs";

dotenv.config();

const port = process.env.PORT;

(async () => {
  try {
    //test db connection
    await testConnection();

    //serverio paleidimas
    app.listen(port, () => {
      console.log(`App is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();
