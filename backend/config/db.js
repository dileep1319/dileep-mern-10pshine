const sequelize = require('./config'); // Import the sequelize instance

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connection has been established successfully.');
    // Sync models with the database (creates tables if they don't exist)
    await sequelize.sync({ alter: true }); 
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
