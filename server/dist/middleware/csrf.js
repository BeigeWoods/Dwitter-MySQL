var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import { config } from "../config.js";
export const csrfCheck = (req, res, next) => {
    if (req.method === "GET" ||
        req.method === "OPTIONS" ||
        req.method === "HEAD") {
        return next();
    }
    const csrfHeader = req.get("dwitter_csrf-token");
    if (!csrfHeader) {
        console.warn('Missing required "dwitter_csrf-token" header.', req.headers.origin);
        return res.status(403).json({ message: "Failed CSRF check" });
    }
    validateCsrfToken(csrfHeader)
        .then((valid) => {
        if (!valid) {
            console.warn('Value provided in "dwitter_csrf-token" header does not validate.', req.headers.origin, csrfHeader);
            return res.status(403).json({ message: "Failed CSRF check" });
        }
        next();
    })
        .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    });
};
function validateCsrfToken(csrfHeader) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt.compare(config.csrf.plainToken, csrfHeader);
    });
}
//# sourceMappingURL=csrf.js.map