import aws, { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../config.js";

const awsS3 = {
  s3: new aws.S3Client({
    credentials: {
      accessKeyId: config.awsS3.id,
      secretAccessKey: config.awsS3.secret,
    },
    region: config.awsS3.region,
  }),
  async putImage(image: any) {
    return this.s3
      .send(
        new PutObjectCommand({
          Bucket: config.awsS3.bucket,
          Key: `${Date.now()}_${image.originalname}`,
          ACL: "public-read",
          Body: image,
        })
      )
      .catch((error) => {
        throw `AWS-S3: putImage ##\n ${error}`;
      });
  },
  async deleteImage(fileName: string) {
    return this.s3
      .send(
        new DeleteObjectCommand({
          Bucket: config.awsS3.bucket,
          Key: fileName.slice(57),
        })
      )
      .catch((error) => {
        throw `AWS-S3: deleteImage ##\n ${error}`;
      });
  },
};

export default awsS3;
