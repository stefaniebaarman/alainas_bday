const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
}

export async function uploadPhoto(file: File): Promise<string> {
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured. Check your environment variables.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData },
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Photo upload failed: ${error}`)
  }

  const data = (await response.json()) as CloudinaryUploadResult
  return data.secure_url
}
