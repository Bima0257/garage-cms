'use client'

import { IconBrandWhatsapp } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactMessageSchema, type ContactMessageFormData } from '@/lib/validations'
import Swal from 'sweetalert2'

interface ContactFormProps {
  whatsapp?: string
}

export function ContactForm({ whatsapp }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageFormData>({
    resolver: zodResolver(contactMessageSchema),
  })

  const onSubmit = async (data: ContactMessageFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Gagal mengirim pesan')

      Swal.fire({
        icon: 'success',
        title: 'Pesan Terkirim!',
        text: 'Terima kasih, pesan Anda telah diterima.',
        confirmButtonColor: '#f2a93b',
      })

      reset()
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengirim pesan. Silakan coba lagi.',
        confirmButtonColor: '#f2a93b',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase block">
          Nama Lengkap
        </label>
        <input
          {...register('name')}
          className="w-full bg-transparent border-b border-text-muted focus:border-primary focus:ring-0 text-on-surface transition-all py-2 placeholder:text-text-muted/50"
          placeholder="Nama lengkap Anda"
        />
        {errors.name && (
          <p className="text-accent-red text-xs md:text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <label className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase block">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full bg-transparent border-b border-text-muted focus:border-primary focus:ring-0 text-on-surface transition-all py-2 placeholder:text-text-muted/50"
            placeholder="email@anda.com"
          />
          {errors.email && (
            <p className="text-accent-red text-xs md:text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase block">
            Telepon
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full bg-transparent border-b border-text-muted focus:border-primary focus:ring-0 text-on-surface transition-all py-2 placeholder:text-text-muted/50"
            placeholder="+62 xxx xxxx xxxx"
          />
          {errors.phone && (
            <p className="text-accent-red text-xs md:text-sm">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase block">
          Subjek
        </label>
        <input
          {...register('subject')}
          className="w-full bg-transparent border-b border-text-muted focus:border-primary focus:ring-0 text-on-surface transition-all py-2 placeholder:text-text-muted/50"
          placeholder="Perihal apa?"
        />
        {errors.subject && (
          <p className="text-accent-red text-xs md:text-sm">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase block">
          Pesan
        </label>
        <textarea
          {...register('message')}
          rows={4}
          className="w-full bg-transparent border-b border-text-muted focus:border-primary focus:ring-0 text-on-surface transition-all py-2 placeholder:text-text-muted/50 resize-none"
          placeholder="Tulis pesan..."
        />
        {errors.message && (
          <p className="text-accent-red text-xs md:text-sm">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-on-primary px-6 md:px-10 py-3 md:py-4 font-bold uppercase tracking-wider md:tracking-widest flex-1 active:scale-95 transition-transform flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50 text-sm md:text-base"
        >
          KIRIM PESAN
          <span className="text-lg md:text-xl">→</span>
        </button>
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-whatsapp-green text-whatsapp-green px-6 md:px-10 py-3 md:py-4 font-bold uppercase tracking-wider md:tracking-widest flex-1 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-whatsapp-green/5 text-sm md:text-base"
          >
            <IconBrandWhatsapp size={18} />
            <span className="hidden sm:inline">WHATSAPP</span>
            <span className="sm:hidden">WA</span>
          </a>
        )}
      </div>
    </form>
  )
}
