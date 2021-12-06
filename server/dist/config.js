import dotenv from "dotenv";
dotenv.config();
function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;
    if (value == null) {
        throw new Error(`Key ${key} is undefined`);
    }
    return value;
}
export const config = {
    cors: {
        allowedOrigin: required("ALLOWED_ORIGIN"),
    },
    jwt: {
        secretKey: required("JWT_SECRET"),
        expiresInSec: parseInt(required("JWT_EXPIRES_SEC", 86400)),
    },
    bcrypt: {
        saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 12)),
    },
    port: parseInt(required("HOST_PORT", 8080)),
    db: {
        host: required("DB_HOST"),
        user: required("DB_USER"),
        database: required("DB_DATABASE"),
        password: required("DB_PASSWORD"),
    },
    csrf: {
        plainToken: required("CSRF_SECRET_KEY"),
    },
    ghOauth: {
        clientId: required("GH_CLIENT_ID"),
        clientSecret: required("GH_CLIENT_SECRETS"),
    },
};
//# sourceMappingURL=config.js.map