import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";

const uploadImageToS3 = async (file) => {
  const fileName = `profile-images/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,

    Key: fileName,

    Body: file.buffer,

    ContentType: file.mimetype,
  });

  await s3.send(command);

  const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

  return imageUrl;
};

export default uploadImageToS3;