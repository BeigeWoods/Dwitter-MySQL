import aws from "aws-sdk";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { config } from "../config.js";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: config.awsS3.id,
    secretAccessKey: config.awsS3.secret,
  },
});

export const multerUpload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10000000,
  },
  // storage: multerS3({
  //   s3,
  //   bucket: "dwitter-media",
  //   acl: "public-read",
  //   key: function (req, file, cb) {
  //     console.log("What the fuck", file);
  //     cb(null, `${Date.now()}_${file.originalname}`);
  //   },
  // }),
});

export const imageUploading = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const upload = multerUpload.single("image");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(409).json({ message: err });
    } else {
      next();
    }
  });
};
