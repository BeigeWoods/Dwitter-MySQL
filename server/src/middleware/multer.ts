import { NextFunction, Request, Response } from "express";
import aws from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import config from "../config.js";

const s3 = new aws.S3Client({
  credentials: {
    accessKeyId: config.awsS3.id,
    secretAccessKey: config.awsS3.secret,
  },
  region: config.awsS3.region,
});

const multerUpload = multer({
  // dest: "uploads/",
  limits: {
    fileSize: 10000000,
  },
  storage: multerS3({
    s3,
    bucket: "dwitter-images",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});

const upload = multerUpload.single("image");

const imageUploading = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Error! imageUpload < multer\n", err);
      return res.status(409).json({ message: "Failed to upload image" });
    } else if (err) {
      console.error("Error! imageUpload < other than multer\n", err);
      return res.status(409).json({ message: "Failed to upload image" });
    }
    next();
  });
};

export default imageUploading;
