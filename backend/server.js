const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const logger = require("./utils/logger"); // <-- added

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
