import { v2 as cloudinary } from "cloudinary"

// Check if Cloudinary is configured
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET

// Configure Cloudinary if credentials are available
if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
} else {
  console.warn("Cloudinary credentials not found. Using local fallback for image uploads.")
}

export async function uploadImage(file: string) {
  try {
    // If Cloudinary is not configured, return a placeholder image
    if (!isCloudinaryConfigured) {
      console.log("Using placeholder image instead of Cloudinary upload")
      // Extract the file type from the base64 string
      const fileType = file.split(';')[0].split('/')[1]
      // Generate a random ID for the image
      const randomId = Math.random().toString(36).substring(2, 15)
      return {
        url: `/placeholder.svg?height=300&width=400&text=Image_${randomId}`,
        publicId: `local_${randomId}`,
      }
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: "athleteverse",
    })
    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error)
    // Return a placeholder image as fallback
    return {
      url: "/placeholder.svg?height=300&width=400&text=Upload_Failed",
      publicId: "upload_failed",
    }
  }
}

export async function deleteImage(publicId: string) {
  try {
    // If Cloudinary is not configured or the image is a local placeholder, just return success
    if (!isCloudinaryConfigured || publicId.startsWith('local_') || publicId === 'upload_failed') {
      return { result: 'ok' }
    }

    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
    throw new Error("Failed to delete image")
  }
}

export default cloudinary

