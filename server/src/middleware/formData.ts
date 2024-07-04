import { NextFunction, Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import config from "../config.js";
import awsS3 from "./awsS3.js";

const handleFormData = (req: Request, res: Response, next: NextFunction) => {
  const multerUpload = multer({
    // dest: "uploads/",
    limits: {
      fileSize: 10000000,
    },
    storage: multerS3({
      s3: awsS3.s3,
      bucket: config.awsS3.bucket,
      acl: "public-read",
      key: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
      },
    }),
  });

  const upload = multerUpload.single("newImage");

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("## handleFormData < multer ##\n", err);
      return res.status(409).json({ message: "Failed to upload image" });
    } else if (err) {
      console.error("## handleFormData < other than multer ##\n", err);
      return res.status(409).json({ message: "Failed to upload image" });
    }
    next();
  });
};

export default handleFormData;
