import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { BirthdayWidget } from '@/components/dashboard/BirthdayWidget'
import { RecentMembers } from '@/components/dashboard/RecentMembers'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { JoinFamilyForm } from '@/components/dashboard/JoinFamilyForm'
import { OnboardingIllustration } from '@/components/shared/EmptyStateIllustration'
import { Button } from '@/components/ui/button'
import { Plus, Users, GitBranch, Layers, Cake, TreePine, UserPlus } from 'lucide-react'

export const metadata = { title: 'Papan Pemuka' }

async function getDashboardData(userId: string) {
  // Find families the user owns OR is a member of
  const families = await prisma.family.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      members: {
        orderBy: { updatedAt: 'desc' },
      },
      _count: { select: { members: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })
  return families
}

function calculateGenerations(members: { birthDate: Date | null }[]): number {
  const years = members
    .filter((m) => m.birthDate)
    .map((m) => new Date(m.birthDate!).getFullYear())
  if (years.length === 0) return 0
  const range = Math.max(...years) - Math.min(...years)
  return Math.max(1, Math.ceil(range / 25))
}

function countBranches(members: { familyBranch: string | null }[]): number {
  const branches = new Set(members.map((m) => m.familyBranch).filter(Boolean))
  return branches.size || 1
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const [families, t] = await Promise.all([
    getDashboardData(session.user.id),
    getTranslations('dashboard'),
  ])
  const tMember = await getTranslations('member')

  // If no family yet, show onboarding with Create + Join options
  if (families.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in-up">
        <OnboardingIllustration className="w-48 h-48 mb-6" />
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
          {t('noFamily.title')}
        </h1>
        <p className="text-gray-500 max-w-md mb-10 leading-relaxed">
          {t('noFamily.desc')}
        </p>

        {/* Two-column: Create + Join */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Create New Family */}
          <div className="card p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto">
              <TreePine className="w-6 h-6 text-primary-500" />
            </div>
            <h2 className="font-semibold text-gray-900">{t('noFamily.createNew')}</h2>
            <CreateFamilyForm
              namePlaceholder={t('noFamily.familyNamePlaceholder')}
              buttonLabel={t('noFamily.createButton')}
            />
          </div>

          {/* Join Existing Family */}
          <div className="card p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto">
              <UserPlus className="w-6 h-6 text-accent-600" />
            </div>
            <h2 className="font-semibold text-gray-900">{t('noFamily.joinTitle')}</h2>
            <p className="text-sm text-gray-500">{t('noFamily.joinDesc')}</p>
            <JoinFamilyForm />
          </div>
        </div>
      </div>
    )
  }

  const primaryFamily = families[0]
  const members = primaryFamily.members
  const totalMembers = primaryFamily._count.members
  const totalGenerations = calculateGenerations(members)
  const totalBranches = countBranches(members)

  const upcomingBirthdays = members.filter((m: { birthDate: Date | null; isDeceased: boolean }) => {
    if (!m.birthDate || m.isDeceased) return false
    const birth = new Date(m.birthDate)
    const today = new Date()
    const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
    if (next < today) next.setFullYear(today.getFullYear() + 1)
    const days = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return days <= 30
  }).length

  return (
    <div>
      <PageHeader
        title={`Salasilah ${primaryFamily.name}`}
        description={t('title')}
        action={
          <Link href={`/family/${primaryFamily.id}/members/new`}>
            <Button size="sm">
              <Plus className="w-4 h-4" />
              {tMember('addMember')}
            </Button>
          </Link>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title={t('stats.totalMembers')}
          value={totalMembers}
          icon={Users}
          color="green"
          subtitle={t('statsSubtitle.totalMembers')}
          index={0}
        />
        <StatsCard
          title={t('stats.generations')}
          value={totalGenerations}
          icon={Layers}
          color="blue"
          subtitle={t('statsSubtitle.generations')}
          index={1}
        />
        <StatsCard
          title={t('stats.branches')}
          value={totalBranches}
          icon={GitBranch}
          color="gold"
          subtitle={t('statsSubtitle.branches')}
          index={2}
        />
        <StatsCard
          title={t('stats.upcomingBirthdays')}
          value={upcomingBirthdays}
          icon={Cake}
          color="purple"
          subtitle={t('statsSubtitle.upcomingBirthdays')}
          index={3}
        />
      </div>

      {/* Quick access to family tree */}
      <div className="card p-5 mb-8 flex items-center justify-between bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 border-0 shadow-lg shadow-primary-500/10 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">{t('viewTree')}</p>
            <p className="text-primary-200 text-sm">{t('viewTreeDesc')}</p>
          </div>
        </div>
        <Link href={`/family/${primaryFamily.id}`}>
          <Button variant="outline" size="sm" className="bg-white text-primary-600 border-white hover:bg-white/90 shadow-sm">
            {t('viewTree')}
          </Button>
        </Link>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentMembers members={members} familyId={primaryFamily.id} />
          <ActivityFeed members={members} />
        </div>
        <div>
          <BirthdayWidget members={members} familyId={primaryFamily.id} />
        </div>
      </div>
    </div>
  )
}

function CreateFamilyForm({ namePlaceholder, buttonLabel }: { namePlaceholder: string; buttonLabel: string }) {
  return (
    <form action="/api/families/create" method="POST" className="w-full max-w-sm">
      <div className="flex gap-3">
        <input
          name="name"
          placeholder={namePlaceholder}
          required
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary-500 transition-colors"
        />
        <button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  )
}
