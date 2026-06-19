'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { IconLock, IconUser } from '@tabler/icons-react'
import Swal from 'sweetalert2'
import { loginSchema, type LoginFormData } from '@/lib/validations'

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: result.error || 'Username atau password salah',
          confirmButtonColor: '#f2a93b',
        })
      } else {
        window.location.assign(callbackUrl)
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan yang tidak terduga',
        confirmButtonColor: '#f2a93b',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
      {/* Background Ghost Text */}
      <div className="fixed inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none">
        <h1 className="font-[var(--font-display-ghost)] text-[var(--font-size-display-ghost)] ghost-text uppercase whitespace-nowrap opacity-50 transform -rotate-12 scale-150">
          STEED AUTH STEED AUTH STEED AUTH
        </h1>
      </div>

      {/* Login Panel */}
      <div className="w-full max-w-md bg-surface-card border border-white/5 p-12 relative overflow-hidden">
        {/* Technical Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-2">
            <span className="font-[var(--font-headline-md)] text-[var(--font-size-headline-md)] font-bold text-primary uppercase tracking-[0.2em]">
              STEED
            </span>
          </div>
          <p className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted uppercase tracking-widest">
            Workshop Management System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Username */}
          <div className="group relative">
            <label className="block font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-secondary uppercase mb-2">
              Admin Identifier
            </label>
            <div className="relative flex items-center border-b border-outline-variant transition-colors focus-within:border-primary amber-glow">
              <IconUser size={20} className="absolute left-0 text-text-muted group-focus-within:text-primary transition-colors" />
              <input
                {...register('username')}
                type="text"
                placeholder="Masukkan username"
                className="w-full bg-transparent border-none text-text-primary py-3 pl-8 placeholder:text-text-muted focus:ring-0 font-[var(--font-label-technical)]"
              />
            </div>
            {errors.username && (
              <p className="text-accent-red text-sm mt-2">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="group relative">
            <div className="flex justify-between items-end mb-2">
              <label className="block font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-secondary uppercase">
                Access Key
              </label>
            </div>
            <div className="relative flex items-center border-b border-outline-variant transition-colors focus-within:border-primary amber-glow">
              <IconLock size={20} className="absolute left-0 text-text-muted group-focus-within:text-primary transition-colors" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent border-none text-text-primary py-3 pl-8 placeholder:text-text-muted focus:ring-0 font-[var(--font-label-technical)]"
              />
            </div>
            {errors.password && (
              <p className="text-accent-red text-sm mt-2">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary py-5 font-[var(--font-headline-md)] text-[var(--font-size-headline-md)] font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(242,169,59,0.25)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
            {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center opacity-30">
          <span className="font-[var(--font-label-technical)] text-[10px] uppercase">
            Ver. 2.4.0_CR
          </span>
          <span className="font-[var(--font-label-technical)] text-[10px] uppercase">
            Secure Encrypted Session
          </span>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
