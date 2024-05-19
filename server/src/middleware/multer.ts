import aws from "@aws-sdk/client-s3";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { config } from "../config";

const s3 = new aws.S3Client({
  credentials: {
    accessKeyId: config.awsS3.id,
    secretAccessKey: config.awsS3.secret,
  },
  region: config.awsS3.region,
});

export const multerUpload = multer({
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

export const imageUploading = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.warn(err);
      return res.status(409).json({ message: "failed to upload image" });
    } else if (err) {
      console.warn(err);
      return res.status(409).json({ message: "failed to upload image" });
    }
    next();
  });
};
