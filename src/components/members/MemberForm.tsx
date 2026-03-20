'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AvatarUpload } from '@/components/members/AvatarUpload'
import type { FamilyMember } from '@prisma/client'

const GENERATIONAL_TITLES = [
  'Datuk', 'Datin', 'Tok', 'Wan', 'Nenek', 'Opah',
  'Pak Long', 'Mak Long', 'Pak Ngah', 'Mak Ngah',
  'Pak Teh', 'Mak Teh', 'Pak Cik', 'Mak Cik',
  'Pak Su', 'Mak Su', 'Pak Tam', 'Mak Tam',
  'Abang', 'Kakak', 'Adik', 'Sepupu',
]

const NEGERI = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
  'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah',
  'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur',
  'Labuan', 'Putrajaya',
]

const schema = z.object({
  fullName: z.string().min(2),
  nickname: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  isDeceased: z.boolean().optional(),
  placeOfBirth: z.string().optional(),
  binBinti: z.string().optional(),
  currentAddress: z.string().optional(),
  negeri: z.string().optional(),
  religion: z.string().optional(),
  familyBranch: z.string().optional(),
  generationalTitle: z.string().optional(),
  occupation: z.string().optional(),
  biography: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
}).refine((data) => {
  // If not deceased, deathDate must be empty
  if (!data.isDeceased && data.deathDate) return false
  return true
}, {
  message: 'Date of death requires the deceased checkbox to be checked',
  path: ['deathDate'],
})

type FormData = z.infer<typeof schema>

interface MemberFormProps {
  familyId: string
  member?: FamilyMember
}

export function MemberForm({ familyId, member }: MemberFormProps) {
  const router = useRouter()
  const isEditing = !!member
  const t = useTranslations('member')
  const tCommon = useTranslations('common')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: member?.fullName ?? '',
      nickname: member?.nickname ?? '',
      gender: (member?.gender as 'MALE' | 'FEMALE') ?? 'MALE',
      birthDate: member?.birthDate ? new Date(member.birthDate).toISOString().split('T')[0] : '',
      deathDate: member?.deathDate ? new Date(member.deathDate).toISOString().split('T')[0] : '',
      isDeceased: member?.isDeceased ?? false,
      placeOfBirth: member?.placeOfBirth ?? '',
      binBinti: member?.binBinti ?? '',
      currentAddress: member?.currentAddress ?? '',
      negeri: member?.negeri ?? '',
      religion: member?.religion ?? 'ISLAM',
      familyBranch: member?.familyBranch ?? '',
      generationalTitle: member?.generationalTitle ?? '',
      occupation: member?.occupation ?? '',
      biography: member?.biography ?? '',
      contactEmail: member?.contactEmail ?? '',
      contactPhone: member?.contactPhone ?? '',
    },
  })

  const gender = watch('gender')
  const isDeceased = watch('isDeceased')

  const [photoUrl, setPhotoUrl] = useState<string | null>(member?.photoUrl ?? null)

  async function onSubmit(data: FormData) {
    const url = isEditing
      ? `/api/families/${familyId}/members/${member!.id}`
      : `/api/families/${familyId}/members`
    const method = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        photoUrl: photoUrl ?? undefined,
        birthDate: data.birthDate || undefined,
        deathDate: data.deathDate || undefined,
        contactEmail: data.contactEmail || undefined,
      }),
    })

    if (!res.ok) {
      const body = await res.json()
      toast.error(body.error ?? tCommon('error'))
      return
    }

    toast.success(isEditing ? t('saveChanges') : t('addMember'))
    router.push(`/family/${familyId}/members`)
    router.refresh()
  }

  const religions = [
    { value: 'ISLAM', label: 'Islam' },
    { value: 'CHRISTIAN', label: 'Kristian / Christian' },
    { value: 'BUDDHIST', label: 'Buddha / Buddhist' },
    { value: 'HINDU', label: 'Hindu' },
    { value: 'OTHERS', label: 'Lain-lain / Others' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Avatar Upload */}
      <section className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          {t('profilePhoto')}
        </h2>
        <div className="flex items-center gap-5">
          <AvatarUpload
            memberId={member?.id}
            currentUrl={photoUrl}
            name={watch('fullName') || 'Ahli'}
            branch={watch('familyBranch')}
            size="xl"
            onUploaded={setPhotoUrl}
          />
          <div className="text-sm text-gray-500 space-y-1">
            <p className="font-medium text-gray-700">{t('uploadPhotoHint')}</p>
            <p>{t('uploadPhotoFormats')}</p>
            <p>{t('uploadPhotoSize')}</p>
          </div>
        </div>
      </section>

      {/* Section: Basic Info */}
      <section className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          {t('sections.basicInfo')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fullName')} <span className="text-red-500">*</span>
            </label>
            <Input {...register('fullName')} placeholder="Ahmad bin Abdullah" />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('nickname')}</label>
            <Input {...register('nickname')} placeholder="Tok Ahmad, Abang, dsb." />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('gender')} <span className="text-red-500">*</span>
            </label>
            <Select
              value={gender}
              onValueChange={(v) => setValue('gender', v as 'MALE' | 'FEMALE')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">{tCommon('male')}</SelectItem>
                <SelectItem value="FEMALE">{tCommon('female')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('birthDate')}</label>
            <Input type="date" {...register('birthDate')} />
          </div>

          {/* Place of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('placeOfBirth')}</label>
            <Input {...register('placeOfBirth')} placeholder="Kota Bharu, Kelantan" />
          </div>

          {/* Is Deceased */}
          <div className="flex items-center gap-3 mt-1">
            <input
              type="checkbox"
              id="isDeceased"
              {...register('isDeceased', {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (!e.target.checked) {
                    setValue('deathDate', '')
                  }
                },
              })}
              className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
            />
            <label htmlFor="isDeceased" className="text-sm font-medium text-gray-700 cursor-pointer">
              {t('deceased')} (Al-Fatihah)
            </label>
          </div>

          {/* Death Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('deathDate')}
            </label>
            <Input
              type="date"
              {...register('deathDate')}
              disabled={!isDeceased}
              className={!isDeceased ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
            />
            {errors.deathDate && <p className="mt-1 text-sm text-red-500">{errors.deathDate.message}</p>}
          </div>
        </div>
      </section>

      {/* Section: Malaysian Cultural Fields */}
      <section className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          {t('sections.malaysianFields')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Bin/Binti */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {gender === 'FEMALE' ? 'Binti' : 'Bin'}
            </label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 py-2 bg-gray-100 rounded-l-xl border border-r-0 border-gray-200 text-sm text-gray-600 whitespace-nowrap">
                {gender === 'FEMALE' ? 'binti' : 'bin'}
              </span>
              <input
                {...register('binBinti')}
                placeholder={t('binBintiPlaceholder')}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-r-xl text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Generational Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('generationalTitle')}
            </label>
            <Select
              value={watch('generationalTitle') ?? ''}
              onValueChange={(v) => setValue('generationalTitle', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectTitle')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('none')}</SelectItem>
                {GENERATIONAL_TITLES.map((title) => (
                  <SelectItem key={title} value={title}>{title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('currentAddress')}</label>
            <Input {...register('currentAddress')} placeholder={t('currentAddressPlaceholder')} />
          </div>

          {/* Negeri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('negeri')}</label>
            <Select
              value={watch('negeri') ?? ''}
              onValueChange={(v) => setValue('negeri', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectNegeri')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('none')}</SelectItem>
                {NEGERI.map((n) => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Religion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('religion')}</label>
            <Select
              value={watch('religion') ?? 'ISLAM'}
              onValueChange={(v) => setValue('religion', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {religions.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Family Branch */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('familyBranch')}</label>
            <Input
              {...register('familyBranch')}
              placeholder={t('familyBranchPlaceholder')}
            />
          </div>
        </div>
      </section>

      {/* Section: Additional Info */}
      <section className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">
          {t('sections.additional')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('occupation')}</label>
            <Input {...register('occupation')} placeholder={t('occupationPlaceholder')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactPhone')}</label>
            <Input {...register('contactPhone')} placeholder="01x-xxxxxxx" type="tel" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactEmail')}</label>
            <Input {...register('contactEmail')} placeholder={t('emailPlaceholder')} type="email" />
            {errors.contactEmail && <p className="mt-1 text-sm text-red-500">{errors.contactEmail.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('biography')}
            </label>
            <textarea
              {...register('biography')}
              rows={4}
              placeholder={t('biographyPlaceholder')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          {tCommon('cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('saving')}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditing ? t('saveChanges') : t('addMember')}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
