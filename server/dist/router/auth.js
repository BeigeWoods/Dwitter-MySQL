import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import * as authController from "../controller/auth.js";
import { isAuth } from "../middleware/auth.js";
const router = express.Router();
const validateCredential = [
    body("username")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("username should be at least 3 characters"),
    body("password")
        .trim()
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("password should be at least 8 characters"),
    validate,
];
const validateSignup = [
    ...validateCredential,
    body("name").notEmpty().withMessage("name is missing"),
    body("email")
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("invalid email"),
    body("url")
        .isURL()
        .withMessage("invalid URL")
        .optional({ nullable: true, checkFalsy: true }),
    validate,
];
router.post("/signup", validateSignup, authController.signup);
router.post("/login", validateCredential, authController.login);
router.post("/logout", authController.logout);
router.get("/csrf-token", authController.csrfToken);
router.get("/me", isAuth, authController.me);
export default router;
//# sourceMappingURL=auth.js.map