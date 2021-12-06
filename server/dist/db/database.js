import SQ from "sequelize";
import { config } from "../config.js";
const { database, user, password, host } = config.db;
const { DataTypes } = SQ;
export const sequelize = new SQ.Sequelize(database, user, password, {
    host,
    dialect: "mysql",
    logging: false,
});
export const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(45),
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(128),
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false,
    },
    socialLogin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    url: DataTypes.TEXT,
}, { timestamps: false, charset: "utf8mb4", collate: "utf8mb4_general_ci" });
export const Tweet = sequelize.define("tweet", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
});
Tweet.belongsTo(User);
//# sourceMappingURL=database.js.map