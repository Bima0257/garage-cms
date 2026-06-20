'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconDeviceFloppy, IconSettings } from '@tabler/icons-react'
import { settingsSchema, type SettingsFormData } from '@/lib/validations/settings'
import type { About } from '@/types/database.types'
import Swal from 'sweetalert2'
import { SWAL_CONFIRM_COLOR } from '@/lib/utils'
import { ImageUploader } from '@/components/admin'

interface SettingsClientProps {
  about: About | null
}

export function SettingsClient({ about }: SettingsClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: about?.name || '',
      tagline: about?.tagline || '',
      description: about?.description || '',
      vision: about?.vision || '',
      mission: about?.mission || '',
      address: about?.address || '',
      phone: about?.phone || '',
      email: about?.email || '',
      whatsapp: about?.whatsapp || '',
      google_maps: about?.google_maps || '',
      image: about?.image || '',
    },
  })

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Gagal menyimpan')

      Swal.fire({
        icon: 'success',
        title: 'Pengaturan Disimpan',
        text: 'Pengaturan berhasil diperbarui.',
        confirmButtonColor: SWAL_CONFIRM_COLOR,
      })
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menyimpan pengaturan.',
        confirmButtonColor: SWAL_CONFIRM_COLOR,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <IconSettings size={28} className="text-primary" />
        <div>
          <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
            Settings
          </h2>
          <p className="text-text-muted text-sm">
            Kelola profil bisnis dan informasi kontak
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-surface-card border border-outline-variant p-6 space-y-6">
          <h3 className="font-[var(--font-label-technical)] text-primary uppercase">
            Informasi Dasar
          </h3>

          <div className="space-y-2">
            <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
              Nama Bisnis <span className="text-accent-red">*</span>
            </label>
            <input
              {...register('name')}
              className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
            {errors.name && (
              <p className="text-accent-red text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
              Tagline
            </label>
            <input
              {...register('tagline')}
              className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
              Gambar
            </label>
            <ImageUploader
              value={watch('image') || ''}
              onChange={(url) => setValue('image', url)}
              folder="abouts"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-surface-card border border-outline-variant p-6 space-y-6">
          <h3 className="font-[var(--font-label-technical)] text-primary uppercase">
            Informasi Kontak
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
                Alamat
              </label>
              <textarea
                {...register('address')}
                rows={3}
                className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
                  Telepon
                </label>
                <input
                  {...register('phone')}
                  className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
                  WhatsApp
                </label>
                <input
                  {...register('whatsapp')}
                  placeholder="e.g. 628123456789"
                  className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
              URL Google Maps
            </label>
            <input
              {...register('google_maps')}
              placeholder="https://maps.google.com/..."
              className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Company Profile */}
        <div className="bg-surface-card border border-outline-variant p-6 space-y-6">
          <h3 className="font-[var(--font-label-technical)] text-primary uppercase">
            Profil Perusahaan
          </h3>

          <div className="space-y-2">
            <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
              Deskripsi
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
                Visi
              </label>
              <textarea
                {...register('vision')}
                rows={4}
                className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
                Misi
              </label>
              <textarea
                {...register('mission')}
                rows={4}
                className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-on-primary px-8 py-4 font-bold uppercase flex items-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            <IconDeviceFloppy size={18} />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  )
}
