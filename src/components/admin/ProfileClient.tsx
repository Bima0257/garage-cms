'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userUpdateSchema, type UserUpdateFormData } from '@/lib/validations/user'
import { useRouter } from 'next/navigation'
import { safeImageSrc } from '@/lib/utils'
import { IconUser, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react'
import Image from 'next/image'
import Swal from 'sweetalert2'

interface UserData {
  id: number
  name: string
  username: string
  email: string | null
  photo: string | null
}

interface ProfileClientProps {
  userId: number
  initialUser: UserData
}

export function ProfileClient({ userId, initialUser }: ProfileClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: initialUser.name,
      username: initialUser.username,
      email: initialUser.email || '',
      currentPassword: '',
      newPassword: '',
    },
  })

  const newPasswordValue = watch('newPassword')

  useEffect(() => {
    reset({
      name: initialUser.name,
      username: initialUser.username,
      email: initialUser.email || '',
      currentPassword: '',
      newPassword: '',
    })
  }, [initialUser, reset])

  const validateConfirmPassword = (value: string) => {
    if (newPasswordValue && value !== newPasswordValue) {
      setPasswordError('Password tidak cocok')
      return false
    }
    setPasswordError('')
    return true
  }

  const onSubmit = async (data: UserUpdateFormData) => {
    if (data.newPassword) {
      if (!validateConfirmPassword(confirmPassword)) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Password tidak cocok',
          confirmButtonColor: '#f2a93b',
        })
        return
      }
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Gagal memperbarui profil')
      }

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Profil berhasil diperbarui',
        confirmButtonColor: '#f2a93b',
      })

      router.refresh()

      reset({
        name: data.name,
        username: data.username,
        email: data.email || '',
        currentPassword: '',
        newPassword: '',
      })
      setConfirmPassword('')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error instanceof Error ? error.message : 'Gagal memperbarui profil',
        confirmButtonColor: '#f2a93b',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-surface-card border border-white/10 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="w-20 h-20 bg-surface-elevated border border-outline-variant flex items-center justify-center">
            {initialUser.photo ? (
              <Image
                src={safeImageSrc(initialUser.photo)}
                alt={initialUser.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-primary font-bold">
                {initialUser.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
              {initialUser.name}
            </h2>
            <p className="text-text-secondary text-sm mt-1">@{initialUser.username}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <IconUser size={20} />
              <h3 className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] uppercase font-bold">
                Informasi Profil
              </h3>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-secondary uppercase">
                Nama Lengkap <span className="text-accent-red ml-1">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                placeholder="Masukkan nama lengkap"
              />
              {errors.name && (
                <p className="text-accent-red text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-secondary uppercase">
                Username <span className="text-accent-red ml-1">*</span>
              </label>
              <input
                type="text"
                {...register('username')}
                className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                placeholder="Masukkan username"
              />
              {errors.username && (
                <p className="text-accent-red text-sm">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-secondary uppercase">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full bg-surface border border-outline-variant px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                placeholder="Masukkan email"
              />
              {errors.email && (
                <p className="text-accent-red text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-primary">
              <IconLock size={20} />
              <h3 className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] uppercase font-bold">
                Ubah Password
              </h3>
            </div>
            <p className="text-text-muted text-sm">
              Kosongkan password jika tidak ingin mengubah.
            </p>

            {/* Current Password */}
            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-secondary uppercase">
                Password Saat Ini
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  {...register('currentPassword')}
                  className="w-full bg-surface border border-outline-variant px-4 py-3 pr-12 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder="Masukkan password saat ini"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showCurrentPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-accent-red text-sm">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-secondary uppercase">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  {...register('newPassword')}
                  className="w-full bg-surface border border-outline-variant px-4 py-3 pr-12 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder="Masukkan password baru (min. 6 karakter)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showNewPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-accent-red text-sm">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="block font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-secondary uppercase">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface border border-outline-variant px-4 py-3 pr-12 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder="Konfirmasi password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-accent-red text-sm">{passwordError}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                reset({
                  name: initialUser.name,
                  username: initialUser.username,
                  email: initialUser.email || '',
                  currentPassword: '',
                  newPassword: '',
                })
                setConfirmPassword('')
                setPasswordError('')
              }}
              className="px-6 py-3 border border-white/20 text-text-primary font-[var(--font-label-technical)] uppercase hover:bg-white/5 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary text-on-primary font-[var(--font-label-technical)] uppercase hover:bg-primary-container transition-colors disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
