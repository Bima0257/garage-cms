'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { IconX } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodSchema } from 'zod'
import Swal from 'sweetalert2'
import { SWAL_CONFIRM_COLOR } from '@/lib/utils'
import { ImageUploader } from './ImageUploader'

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'image' | 'url' | 'date'
  placeholder?: string
  options?: { value: string | number; label: string }[]
  required?: boolean
}

interface FormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  title: string
  schema: ZodSchema
  fields: FormField[]
  defaultValues?: Record<string, unknown>
  loading?: boolean
}

export function FormDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  schema,
  fields,
  defaultValues,
  loading,
}: FormDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues,
  })

  useEffect(() => {
    if (isOpen && defaultValues) {
      reset(defaultValues)
    }
  }, [isOpen, defaultValues, reset])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    try {
      await onSubmit(data)
      onClose()
      reset()
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data berhasil disimpan',
        confirmButtonColor: SWAL_CONFIRM_COLOR,
      })
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menyimpan data',
        confirmButtonColor: SWAL_CONFIRM_COLOR,
      })
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-card border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-surface-card border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h3 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-md)] uppercase">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-white transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-secondary uppercase">
                {field.label}
                {field.required && <span className="text-accent-red ml-1">*</span>}
              </label>

              {field.type === 'textarea' && (
                <textarea
                  {...register(field.name)}
                  rows={4}
                  placeholder={field.placeholder}
                  className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
                />
              )}

              {field.type === 'select' && (
                <select
                  {...register(field.name)}
                  className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="">Pilih...</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'checkbox' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register(field.name)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-text-secondary">Aktif</span>
                </label>
              )}

              {field.type === 'image' && (
                <ImageUploader
                  value={watch(field.name) as string}
                  onChange={(url) => setValue(field.name, url)}
                  folder={field.name}
                />
              )}

              {!field.type || ['text', 'email', 'password', 'number', 'url', 'date'].includes(field.type) ? (
                <input
                  type={field.type}
                  {...register(field.name, { valueAsNumber: field.type === 'number' })}
                  placeholder={field.placeholder}
                  className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              ) : null}

              {errors[field.name] && (
                <p className="text-accent-red text-sm">
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-white/20 text-text-primary font-[var(--font-label-technical)] uppercase hover:bg-white/5 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-on-primary font-[var(--font-label-technical)] uppercase hover:bg-primary-container transition-colors disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
