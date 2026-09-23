const get = (k: string) => process.env[k] ?? "";

export const env = {
  MONGODB_URI: get("MONGODB_URI"),
  CLOUDINARY_CLOUD_NAME: get("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: get("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: get("CLOUDINARY_API_SECRET"),
  ADMIN_KEY: get("ADMIN_KEY"),
  SITE_URL: get("NEXT_PUBLIC_SITE_URL") || "https://nuttinghouse.co.za",
};

export const hasMongo = () => env.MONGODB_URI.length > 10;
export const hasCloudinary = () =>
  env.CLOUDINARY_CLOUD_NAME !== "" && env.CLOUDINARY_API_KEY !== "" && env.CLOUDINARY_API_SECRET !== "";
export const hasAdminKey = () => env.ADMIN_KEY.length >= 8;
