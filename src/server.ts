import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";

const DB_URI = config.DATABASE_URI;
const PORT = config.PORT || 5000;
async function main() {
  try {
    await mongoose.connect(DB_URI as string);
    app.listen(PORT, () => {
      console.log(`Server is running port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
