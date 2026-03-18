'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function RegisterPage() {
  const router = useRouter()
  const t = useTranslations('auth.register')
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const registerSchema = z.object({
    name: z.string().min(2, t('errorEmailTaken')),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Min 8 characters'),
  })
  type RegisterForm = z.infer<typeof registerSchema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterForm) {
    setServerError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json()
      setServerError(body.error || t('errorEmailTaken'))
      return
    }

    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 p-8 animate-scale-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-primary-500 mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-500 text-sm">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('name')}
          </label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              {...register('name')}
              placeholder={t('namePlaceholder')}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('email')}
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="email"
              {...register('email')}
              placeholder={t('emailPlaceholder')}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('password')}
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder={t('passwordPlaceholder')}
              className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-sm text-red-600 animate-fade-in">
            {serverError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white font-semibold py-3.5 px-6 rounded-xl text-base transition-all min-h-touch flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/25"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t('submitting')}</span>
            </>
          ) : (
            t('submit')
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t('hasAccount')}{' '}
        <Link href="/login" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
          {t('login')}
        </Link>
      </p>
    </div>
  )
}
