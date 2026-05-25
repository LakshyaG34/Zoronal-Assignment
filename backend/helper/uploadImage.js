import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";

const uploadToS3 = async (file, folder = "uploads") => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  console.log(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Starting image upload to S3`);

  try {
    // Validate file input
    if (!file) {
      console.error(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - No file provided for upload`);
      throw new Error("No file provided for upload");
    }

    console.log(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - File details:`, {
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      encoding: file.encoding,
      bufferSize: file.buffer ? file.buffer.length : 0
    });

    // Validate file size (e.g., max 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      console.error(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - File too large: ${file.size} bytes (max: ${maxFileSize} bytes)`);
      throw new Error(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`);
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      console.error(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Invalid file type: ${file.mimetype}`);
      console.error(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Allowed types: ${allowedMimeTypes.join(', ')}`);
      throw new Error(`Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`);
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const sanitizedFileName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special characters
      .substring(0, 100); // Limit length

    const fileName = `${folder}/${Date.now()}-${sanitizedFileName}`;

    console.log(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Generated filename: ${fileName}`);
    console.log(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - File extension: ${fileExtension}`);

    // Log AWS configuration (without sensitive data)
    console.log(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - AWS Configuration:`, {
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY,
      hasSecretKey: !!process.env.AWS_SECRET_KEY,
      endpoint: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`
    });

    // Prepare S3 upload command
    console.log(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Preparing PutObjectCommand`);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      // Metadata: {
      //   originalName: file.originalname,
      //   uploadedAt: new Date().toISOString(),
      //   fileSize: file.size.toString()
      // }
    });

    // Upload to S3
    console.log(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Uploading to S3...`);
    const uploadStartTime = Date.now();

    const result = await s3.send(command);

    const uploadDuration = Date.now() - uploadStartTime;
    console.log(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Upload completed in ${uploadDuration}ms`);
    console.log(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - S3 Response:`, {
      ETag: result.ETag,
      versionId: result.VersionId,
      requestId: result.$metadata?.requestId,
      attempts: result.$metadata?.attempts,
      totalRetryDelay: result.$metadata?.totalRetryDelay
    });

    // Generate image URL
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    console.log(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Generated image URL: ${imageUrl}`);

    const totalDuration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Upload successful (Total duration: ${totalDuration}ms)`);

    return imageUrl;

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Error occurred: ${error.message}`);
    console.error(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Stack trace:`, error.stack);

    // Log specific error types
    if (error.name === 'CredentialsProviderError') {
      console.error(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - AWS Credentials error. Check your AWS credentials configuration.`);
    } else if (error.name === 'BucketNotFoundError') {
      console.error(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Bucket not found: ${process.env.AWS_BUCKET_NAME}`);
    } else if (error.name === 'NetworkingError') {
      console.error(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Network error. Check your internet connection and AWS region configuration.`);
    } else if (error.Code === 'NoSuchBucket') {
      console.error(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Bucket does not exist: ${process.env.AWS_BUCKET_NAME}`);
    } else if (error.Code === 'AccessDenied') {
      console.error(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Access denied. Check IAM permissions for S3 upload.`);
    }

    console.error(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Error details:`, {
      name: error.name,
      code: error.Code,
      statusCode: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId,
      extendedRequestId: error.$metadata?.extendedRequestId
    });

    console.log(`[${new Date().toISOString()}] [${requestId}] S3 UPLOAD - Upload failed (Duration: ${duration}ms)`);

    throw new Error(`Failed to upload image to S3: ${error.message}`);
  }
};

export default uploadToS3;