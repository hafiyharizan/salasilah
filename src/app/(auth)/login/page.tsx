'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations('auth.login')
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const loginSchema = z.object({
    email: z.string().email(t('errorInvalid')),
    password: z.string().min(1, t('errorInvalid')),
  })
  type LoginForm = z.infer<typeof loginSchema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginForm) {
    setServerError('')
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setServerError(t('errorInvalid'))
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-primary-500 mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-500 text-sm">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('email')}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              {...register('email')}
              placeholder={t('emailPlaceholder')}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('password')}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? t('hidePassword') : t('showPassword')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl text-base transition-all min-h-touch flex items-center justify-center gap-2 disabled:opacity-70"
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

      {/* Demo credentials hint */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-700 text-center">
          <span className="font-medium">Demo:</span> demo@salasilah.my / demo1234
        </p>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t('noAccount')}{' '}
        <Link href="/register" className="text-primary-500 font-semibold hover:underline">
          {t('register')}
        </Link>
      </p>
    </div>
  )
}
