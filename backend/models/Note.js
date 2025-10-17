const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const User = require("./userModel");

const Note = sequelize.define(
  "Note",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Relationship: One user can have many notes
User.hasMany(Note, { foreignKey: "userId", onDelete: "CASCADE" });
Note.belongsTo(User, { foreignKey: "userId" });

module.exports = Note;
