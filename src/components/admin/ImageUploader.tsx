'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { SWAL_CONFIRM_COLOR } from '@/lib/utils'
import { IconUpload, IconX } from '@tabler/icons-react'
import Swal from 'sweetalert2'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
}

export function ImageUploader({ value, onChange, folder = 'general' }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      onChange(data.url)
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Upload Gagal',
        text: 'Gagal mengupload gambar. Silakan coba lagi.',
        confirmButtonColor: SWAL_CONFIRM_COLOR,
      })
    } finally {
      setIsUploading(false)
    }
  }, [folder, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full aspect-video bg-surface border border-outline-variant overflow-hidden group">
          <Image
            src={value}
            alt="Preview"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-black/50 text-white hover:bg-accent-red transition-colors opacity-0 group-hover:opacity-100"
          >
            <IconX size={16} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`w-full aspect-video border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-outline-variant hover:border-primary'
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-text-muted text-sm">Mengupload...</p>
            </div>
          ) : (
            <>
              <IconUpload size={32} className="text-text-muted mb-2" />
              <p className="text-text-muted text-sm">
                Seret atau klik untuk upload
              </p>
              <p className="text-text-muted text-xs mt-1">
                JPG, PNG, WEBP (maks 5MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
