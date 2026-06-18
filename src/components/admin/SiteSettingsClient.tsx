'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconDeviceFloppy, IconWorldWww } from '@tabler/icons-react'
import { siteSettingsSchema, type SiteSettingsFormData } from '@/lib/validations/site-settings'
import type { Settings } from '@/types/database.types'
import Swal from 'sweetalert2'
import { ImageUploader } from '@/components/admin'

interface SiteSettingsClientProps {
  settings: Settings | null
}

export function SiteSettingsClient({ settings }: SiteSettingsClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      site_name: settings?.site_name || '',
      tagline: settings?.tagline || '',
      logo: settings?.logo || '',
      favicon: settings?.favicon || '',
      meta_title: settings?.meta_title || '',
      meta_description: settings?.meta_description || '',
      footer_text: settings?.footer_text || '',
      whatsapp: settings?.whatsapp || '',
    },
  })

  const onSubmit = async (data: SiteSettingsFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Gagal menyimpan')

      Swal.fire({
        icon: 'success',
        title: 'Pengaturan Disimpan',
        text: 'Pengaturan situs berhasil diperbarui.',
        confirmButtonColor: '#f2a93b',
      })
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menyimpan pengaturan.',
        confirmButtonColor: '#f2a93b',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <IconWorldWww size={28} className="text-primary" />
        <div>
          <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
            Site Settings
          </h2>
          <p className="text-text-muted text-sm">
            Konfigurasi branding dan pengaturan situs
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Branding */}
        <div className="bg-surface-card border border-outline-variant p-6 space-y-6">
          <h3 className="font-[var(--font-label-technical)] text-primary uppercase">
            Branding
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
                Nama Situs <span className="text-accent-red">*</span>
              </label>
              <input
                {...register('site_name')}
                className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
              {errors.site_name && (
                <p className="text-accent-red text-sm">{errors.site_name.message}</p>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
                Logo
              </label>
              <ImageUploader
                value={watch('logo') || ''}
                onChange={(url) => setValue('logo', url)}
                folder="logo"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
                Favicon
              </label>
              <ImageUploader
                value={watch('favicon') || ''}
                onChange={(url) => setValue('favicon', url)}
                folder="favicon"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-surface-card border border-outline-variant p-6 space-y-6">
          <h3 className="font-[var(--font-label-technical)] text-primary uppercase">
            Pengaturan SEO
          </h3>

          <div className="space-y-2">
            <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
              Meta Title
            </label>
            <input
              {...register('meta_title')}
              className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
              Meta Description
            </label>
            <textarea
              {...register('meta_description')}
              rows={3}
              className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Footer & WhatsApp */}
        <div className="bg-surface-card border border-outline-variant p-6 space-y-6">
          <h3 className="font-[var(--font-label-technical)] text-primary uppercase">
            Footer & Kontak
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
                Teks Footer
              </label>
              <input
                {...register('footer_text')}
                className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-xs text-text-secondary uppercase">
                Nomor WhatsApp
              </label>
              <input
                {...register('whatsapp')}
                placeholder="e.g. 628123456789"
                className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
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
