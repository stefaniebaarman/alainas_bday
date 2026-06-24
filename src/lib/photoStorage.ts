import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebase'

export interface PhotoUploadResult {
  url: string
  storagePath: string
}

function extensionFor(file: File): string {
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  if (file.type === 'image/gif') return 'gif'
  return 'jpg'
}

function photoStoragePath(teamId: string, challengeId: string, file: File): string {
  return `photos/${teamId}/${challengeId}.${extensionFor(file)}`
}

export async function uploadPhoto(
  teamId: string,
  challengeId: string,
  file: File,
): Promise<PhotoUploadResult> {
  const path = photoStoragePath(teamId, challengeId, file)
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return { url, storagePath: path }
}

export async function deletePhoto(storagePath: string): Promise<void> {
  await deleteObject(ref(storage, storagePath))
}
