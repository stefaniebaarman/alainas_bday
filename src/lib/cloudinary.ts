const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  delete_token?: string
}

export async function uploadPhoto(file: File): Promise<CloudinaryUploadResult> {
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
    const body = await response.text()
    let message = body
    try {
      const parsed = JSON.parse(body) as { error?: { message?: string } }
      message = parsed.error?.message ?? body
    } catch {
      // keep raw body
    }
    if (/unknown api key/i.test(message)) {
      throw new Error(
        'Photo upload failed: invalid Cloudinary cloud name. In the Cloudinary dashboard, copy Cloud name (not API key) into VITE_CLOUDINARY_CLOUD_NAME, then restart the dev server or redeploy.',
      )
    }
    throw new Error(`Photo upload failed: ${message}`)
  }

  return (await response.json()) as CloudinaryUploadResult
}

export async function deletePhoto(deleteToken: string): Promise<void> {
  if (!cloudName) {
    throw new Error('Cloudinary is not configured. Check your environment variables.')
  }

  const formData = new FormData()
  formData.append('token', deleteToken)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`,
    { method: 'POST', body: formData },
  )

  if (!response.ok) {
    const body = await response.text()
    let message = body
    try {
      const parsed = JSON.parse(body) as { error?: { message?: string } }
      message = parsed.error?.message ?? body
    } catch {
      // keep raw body
    }
    throw new Error(`Photo delete failed: ${message}`)
  }
}
